function core (args) {
    const isWorkerd = args.runtime === 'cloudflare_workers';
    const imports = ['  App'];
    const use = [];
    const appOpts = [];

    if (args.includeSecurity) {
        imports.push('  Security');
        use.push("  .use(Security())");
    }

    if (args.includeCors) {
        imports.push('  Cors');
        use.push("  .use(Cors())");
    }

    if (args.includeCache) {
        if (isWorkerd) {
            imports.push('  DurableObjectCache');
            appOpts.push('  cache: new DurableObjectCache({store: ({env}) => env.MainDurable}),');
        } else {
            imports.push('  MemoryCache');
            appOpts.push('  cache: new MemoryCache(),');
        }
    }

    if (args.includeRateLimit) {
        if (isWorkerd) {
            imports.push('  DurableObjectRateLimit');
            appOpts.push('  rateLimit: new DurableObjectRateLimit({store: ({env}) => env.MainDurable}),');
        } else {
            imports.push('  MemoryRateLimit');
            appOpts.push('  rateLimit: new MemoryRateLimit(),');
        }
    }

    return {
        imports: imports.length > 1 ? `import {
${imports.join(',\n')}
} from '@trifrost/core';` : `import {${imports[0].trim()}} from '@trifrost/core';`,
        use,
        appOpts,
    };
}

export function helloWorldBlueprint (args) {
    const isWorkerd = args.runtime === 'cloudflare_workers';
    const requiresDurable = isWorkerd && (args.includeCache || args.includeRateLimit);

    const {imports, use, appOpts} = core(args);

    /* Imports */
    const index = [imports];

    if (args.includeCss) index.push("import {css} from './css';");
    if (args.includeScript) index.push("import {script} from './script';");
    index.push("import {type Env} from './types';");
    index.push("import {routes} from './routes';");
    index.push("import {notFoundHandler} from './routes/notfound';");
    index.push("import {errorHandler} from './routes/error';");
    index.push("");

    const clientOpts = [];
    if (args.includeCss) clientOpts.push("css");
    if (args.includeScript) clientOpts.push("script");

    const oneLineApp = !clientOpts.length && !appOpts.length;

    /* Workerd split */
    if (isWorkerd) {
        if (requiresDurable) {
            index.push("export {TriFrostDurableObject} from '@trifrost/core';");
            index.push("");
        }
        index.push(oneLineApp ? "const app = await new App<Env>()" : "const app = await new App<Env>({");
    } else {
        index.push(oneLineApp ? "new App<Env>()" : "new App<Env>({")
    }

    if (appOpts.length || clientOpts.length) {
        if (clientOpts.length) index.push(`  client: {${clientOpts.join(', ')}},`);
        if (appOpts.length) index.push(appOpts.join('\n'));
        index.push("})");
    }
    index.push(...use);
    index.push("  .group('', routes)");
    index.push("  .onNotFound(notFoundHandler)");
    index.push("  .onError(errorHandler)");
    index.push("  .boot();");
    if (isWorkerd) {
        index.push("");
        index.push("export default app;")
    }

    return [
        ['src/index.ts', index.join("\n")],
        ['src/components/Layout.tsx', args.includeCss
            ? `
import {css} from '../css';

type LayoutOptions = {
  children:JSX.Element;
  title?:string;
};

export function Layout ({children, title = "${args.serviceName}"}:LayoutOptions) {
  return (
    <html className={css({fontSize: '62.5%'})}>
      <head>
        <title>{title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/public/favicon.ico" />
      </head>
      <body className={css.use('f', 'fv', 'fa_c', 'fj_c', {
        width: '100vw',
        height: '100vh',
        fontFamily: 'system-ui',
        fontSize: css.$v.fontSizeBody,
        backgroundColor: css.$t.bg,
        color: css.$t.fg,
      })}>
        {children}
      </body>
    </html>
  );
}`.trim() : `
type LayoutOptions = {
  children:JSX.Element;
  title?:string;
};

export function Layout ({children, title = "${args.serviceName}"}:LayoutOptions) {
  return (
    <html>
      <head>
        <title>{title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/public/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
`.trim()],
        ['src/routes/index.tsx', args.includeCss
            ? `
import {type Router} from '../types';
import {Layout} from '../components/Layout';
import {css} from '../css';

export async function routes <State extends Record<string, unknown>> (r: Router<State>) {
  r
    .get('/public/:path', ctx => ctx.file(${args.runtime === 'cloudflare_workers' ? '\`/\${ctx.state.path}\`' : '\`public/\${ctx.state.path}\`'}))
    .get('/', ctx => {
      ctx.html(
        <Layout title={"Home"}>
          <>
            <img
              src="/public/logo.svg"
              className={css({
                animation: \`\${css.keyframes({
                  '0%': {transform: 'translateY(2px)', filter: 'drop-shadow(0 0 0 rgba(255,255,255,0.10))'},
                  '50%': {transform: 'translateY(-2px)', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.30)) brightness(1.1)',},
                  '100%': {transform: 'translateY(2px)', filter: 'drop-shadow(0 0 0 rgba(255,255,255,0.10))'},
                })} 2s cubic-bezier(0, 0, 1, 1) infinite\`,
              })} />
            <h1 className={css.use('header', {marginTop: '2rem'})}>Welcome to TriFrost</h1>
            <p className={css({marginBottom: '4rem'})}>Your runtime just got cooler</p>
            <div className={css.use('f', 'fh', 'fa_c', {gap: '1rem'})}>
                <a target="_blank" href="https://www.trifrost.dev/docs/what-is-trifrost" className={css.use('link')}>Docs</a>
                <span>|</span>
                <a target="_blank" href="https://www.trifrost.dev/news" className={css.use('link')}>News</a>
                <span>|</span>
                <a target="_blank" href="https://github.com/trifrost-js/core" className={css.use('link')}>Github</a>
            </div>
          </>
        </Layout>
      );
    });
}`.trim() : `import {type Router} from '../types';
import {Layout} from '../components/Layout';

export async function routes <State extends Record<string, unknown>> (r: Router<State>) {
  r
    .get('/public/:path', ctx => ctx.file(${args.runtime === 'cloudflare_workers' ? '\`/\${ctx.state.path}\`' : '\`public/\${ctx.state.path}\`'}))
    .get('/', ctx => {
      ctx.html(
        <Layout title={"Home"}>
          <>
            <img src="/public/logo.svg" />
            <h1>Welcome to TriFrost</h1>
            <p>Your runtime just got cooler</p>
            <br />
            <a target="_blank" href="https://www.trifrost.dev/docs/what-is-trifrost">Docs</a>
            <a target="_blank" href="https://www.trifrost.dev/news">News</a>
            <a target="_blank" href="https://github.com/trifrost-js/core">Github</a>
          </>
        </Layout>
      );
    });
}`.trim()],
        ['src/routes/notfound.tsx', args.includeCss
            ? `
import {type Context} from '../types';
import {Layout} from '../components/Layout';
import {css} from '../css';

/**
 * This method is used as a fallback for when a route is not found.
 * It is registered in the main index.ts using .onNotFound(notFoundHandler)
 * @see https://www.trifrost.dev/docs/error-notfound-handlers#404-handler-onnotfound
 */
export async function notFoundHandler (ctx:Context) {
  return ctx.html(<Layout title={"404 Not Found"}>
    <>
      <h1 className={css.use('header')}>404 Not Found</h1>
      <p>We looked but nothing is here</p>
      <a href="/">Back home</a>
    </>
  </Layout>);
}`.trim() : `
import {type Context} from '../types';
import {Layout} from '../components/Layout';

/**
 * This method is used as a fallback for when a route is not found.
 *
 * It is registered in the main index.ts using .onNotFound(notFoundHandler)
 *
 * @see https://www.trifrost.dev/docs/error-notfound-handlers#404-handler-onnotfound
 */
export async function notFoundHandler (ctx:Context) {
  return ctx.html(<Layout title={"404 Not Found"}>
    <>
      <h1>404 Not Found</h1>
      <p>We looked but nothing is here</p>
      <a href="/">Back home</a>
    </>
  </Layout>);
}`.trim()],
        ['src/routes/error.tsx', args.includeCss
            ? `
import {type Context} from '../types';
import {Layout} from '../components/Layout';
import {css} from '../css';

/**
 * This method is used as a fallback for when a route errors out, throws an error or
 * a 4/5xx non 404 status is found.
 *
 * It is registered in the main index.ts using .onError(errorHandler)
 *
 * @see https://www.trifrost.dev/docs/error-notfound-handlers#error-handler-onerror
 */
export async function errorHandler (ctx:Context) {
  return ctx.html(<Layout title={\`Oops: \${ctx.statusCode}\`}>
    <>
      <h1 className={css.use('header')}>Oops!</h1>
      <p>Looks like something went wrong (code:{ctx.statusCode})</p>
      <a href="/">Back to safety</a>
    </>
  </Layout>);
}`.trim() : `
import {type Context} from '../types';
import {Layout} from '../components/Layout';

/**
 * This method is used as a fallback for when a route errors out, throws an error or
 * a 4/5xx non 404 status is found.
 *
 * It is registered in the main index.ts using .onError(errorHandler)
 *
 * @see https://www.trifrost.dev/docs/error-notfound-handlers#error-handler-onerror
 */
export async function errorHandler (ctx:Context) {
  return ctx.html(<Layout title={\`Oops: \${ctx.statusCode}\`}>
    <>
      <h1>Oops!</h1>
      <p>Looks like something went wrong (code:{ctx.statusCode})</p>
      <a href="/">Back to safety</a>
    </>
  </Layout>);
}`.trim()],
    ];
}
