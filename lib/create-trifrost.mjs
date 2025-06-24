import prompts from 'prompts';
import {execSync} from 'child_process';
import {mkdirSync, writeFileSync, existsSync } from 'fs';
import {join, dirname} from 'path';
import {factory} from './factories/index.mjs';
import {version} from '../package.json';
import picocolors from 'picocolors';

function checkCommand(cmd) {
    try {
        execSync(`${cmd} --version`, {stdio: 'ignore'});
        return true;
    } catch {
        return false;
    }
}

const green = val => picocolors.green(val);

const red = val => picocolors.red(val);

const bold = val => picocolors.bold(val);

const promptOpts = {
    onCancel: () => {
        console.log(`\n${red('✖')} ${bold('Cancelling creation')}`);
        process.exit(1);
    },
};

/**
 * MARK: Welcome Wagon
 */

console.log('┌──────────────────────────────────────────────────────────────────────────────────────────┐');
console.log('│::::::::::: :::::::::  ::::::::::: :::::::::: :::::::::   ::::::::   :::::::: ::::::::::: │');
console.log('│    :+:     :+:    :+:     :+:     :+:        :+:    :+: :+:    :+: :+:    :+:    :+:     │');
console.log('│    +:+     +:+    +:+     +:+     +:+        +:+    +:+ +:+    +:+ +:+           +:+     │');
console.log('│    +#+     +#++:++#:      +#+     :#::+::#   +#++:++#:  +#+    +:+ +#++:++#++    +#+     │');
console.log('│    +#+     +#+    +#+     +#+     +#+        +#+    +#+ +#+    +#+        +#+    +#+     │');
console.log('│    #+#     #+#    #+#     #+#     #+#        #+#    #+# #+#    #+# #+#    #+#    #+#     │');
console.log('│    ###     ###    ### ########### ###        ###    ###  ########   ########     ###     │');
console.log('└──────────────────────────────────────────────────────────────────────────────────────────┘');
console.log(`\nWelcome to ${bold('TriFrost Creator')} (v${version})!`);
console.log('\nYou will be presented with a series of options to personalize your TriFrost Experience.');
console.log('\nThese options range from:\n─ Naming your upcoming creation\n─ Choosing your runtime\n- Configuring modules\n─ ...\n\nAfter you\'re done we\'ll tailor the folder structure based on your selection.');
console.log('\nThanks for choosing TriFrost ❄️, stay frosty and let\'s get started!\n');
console.log(`\n─── ${bold('App Configuration')} ──────────────────────────────────────────────────────────────────────`);

/**
 * MARK: Questionnaire
 */

let runtime;
let network;
const response = await prompts([
  {
    type: 'text',
    name: 'dir',
    message: '(1/9) Where should we create your project?',
    initial: 'my-trifrost-app',
  },
], promptOpts);

/* Ensure target dir is not taken */
const target = join(process.cwd(), response.dir);
if (existsSync(target)) {
    console.error(`${bold('└')} ${red('✖')} Directory ./${response.dir} already exists.`);
    process.exit(1);
} else {
    console.log(`${bold('└')} ${green('✔')} Directory ./${response.dir} available.`);
}

const response2 = await prompts([
  {
    type: 'text',
    name: 'serviceName',
    message: '(2/9) What name will you give your service?',
    /* Make use of provided dir but sluggify it */
    initial: () => response.dir.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
  },
  {
    type: 'select',
    name: 'runtime',
    message: '(3/9) Which runtime are you using?',
    choices: [
      { title: 'Bun', value: 'bun' },
      { title: 'CloudFlare workers', value: 'cloudflare_workers' },
      { title: 'Node', value: 'node' },
    ],
    initial: 0,
  },
  /* Start Bun/Node options */
  {
    type: prev => {
        runtime = prev;
        return runtime !== 'cloudflare_workers' ? 'toggle' : null;
    },
    name: 'includePodman',
    message: '├ Podman (yes) or standalone?',
    initial: false,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: prev => prev === true ? 'text' : null,
    name: 'podmanNetwork',
    message: '├ Which podman network should it run on?',
    initial: 'trifrost-network',
  },
  {
    type: () => runtime !== 'cloudflare_workers' ? 'number' : null,
    name: 'port',
    message: '└ What port should your service run on?',
    initial: 8787,
  },
], promptOpts);

/* Verify podman is installed */
if (response2.includePodman) {
    const hasPodman = checkCommand('podman');
    const hasCompose = checkCommand('podman-compose');
  
    if (!hasPodman || !hasCompose) {
        console.error(`    ${bold('└')} ${red('✖')} Missing dependencies for container support:`);
        if (!hasPodman) console.error(`      ${bold('└ Podman is not installed')}`);
        if (!hasCompose) console.error(`      ${bold('└ Podman compose is not installed')}`);
        console.log('\n> 💡 To install Podman, visit https://podman.io/docs/installation');
        process.exit(1);
    } else {
        console.log(`    ${bold('└')} ${green('✔')} ${bold('Podman available.')}`);
        console.log(`    ${bold('└')} ${green('✔')} ${bold('Podman compose available.')}`);
    }

    /* Create podman network */
    try {
        network = response2.podmanNetwork.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const result = execSync(`podman network ls --format "{{.Name}}"`, {encoding: 'utf8'});
        const networks = result.split('\n').filter(Boolean);
        if (!networks.includes(network)) {
            console.log(`    ${bold('└')} ${bold('🌐 Creating podman network "' + network + '"...')}`);
            execSync(`podman network create ${network}`, { stdio: 'ignore' });
        } else {
            console.log(`    ${bold('└')} ${green('✔')} ${bold('Podman network "' + network + '" exists.')}`);
        }
    } catch (err) {
        console.error(`      ${bold('└ Failed to verify/create podman network "' + network + '":')}`, err.message);
        process.exit(1);
    }
}

const response3 = await prompts([
  /* End Bun/Node options */
  {
    type: 'toggle',
    name: 'includeCache',
    message: '(4/9) Enable caching?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: 'toggle',
    name: 'includeRateLimit',
    message: '(5/9) Enable rate limiter?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: 'toggle',
    name: 'includeSecurity',
    message: '(6/9) Enable Security middleware?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: 'toggle',
    name: 'includeCors',
    message: '(7/9) Enable CORS middleware?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  /* Scripting */
  {
    type: 'toggle',
    name: 'includeScript',
    message: '(8/9) Enable scripting setup?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: prev => prev === true ? 'toggle' : null,
    name: 'includeScriptAtomic',
    message: '└ Include TriFrost Atomic?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  /* Styling */
  {
    type: 'toggle',
    name: 'includeCss',
    message: '(9/9) Enable styling setup?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: prev => prev === true ? 'toggle' : null,
    name: 'includeCssReset',
    message: '└ Include CSS Reset?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
], promptOpts);

/**
 * MARK: Scaffold
 */

console.log(`\n─── ${bold('Scaffolding project')} ────────────────────────────────────────────────────────────────────`);

const {files, installCmd, devCmd} = factory(response2.runtime, {
  serviceName: response2.serviceName,
  runtime: response2.runtime,
  port: response2.port,
  includePodman: response2.includePodman,
  podmanNetwork: network,
  includeCache: response3.includeCache,
  includeRateLimit: response3.includeRateLimit,
  includeSecurity: response3.includeSecurity,
  includeCors: response3.includeCors,
  includeScript: response3.includeScript,
  includeScriptAtomic: response3.includeScriptAtomic,
  includeCss: response3.includeCss,
  includeCssReset: response3.includeCssReset,
  kit: 'hello_world',
});

/* Sort files according to path */
files.sort((a, b) => a[0] > b[0] ? 1 : -1);

/* Write files */
mkdirSync(target, {recursive: true});
mkdirSync(join(target, '/public'), {recursive: true});
console.log(`\n${bold('Creating Structure')}`);
for (let i = 0; i < files.length; i++) {
    const [path, content] = files[i];
    const full = join(target, path);
    const dir = dirname(full);
    mkdirSync(dir, {recursive: true});
    writeFileSync(full, content);
    console.log(`${i === files.length - 1 ? '└' : '├'} 📄 ${bold(path)}`);
}

console.log('\n');
/* Podman dependency install */
if (response2.includePodman) {
    const depInstallCmd = response2.runtime === 'bun' ? 'bun install' : 'npm install';
    console.log(`🔧 ${bold('Installing dependencies on host for editor support...')}`);
    try {
      execSync(depInstallCmd, {cwd: target, stdio: 'inherit'});
      console.log(`✅ Host dependencies installed`);
    } catch (err) {
      console.warn(`⚠️ Failed to install dependencies on host: ${depInstallCmd}`);
    }
}

/* Run installer */
try {
    if (response2.includePodman) {
        console.log(`🔧 ${bold('Building podman container')}`);
    } else {
        console.log(`🔧 ${bold('Installing dependencies')}`);
    }
    execSync(installCmd, {cwd: target, stdio: 'inherit'});
} catch (e) {
    console.warn(`⚠️ Install command failed: ${installCmd}`);
}

console.log(`\n────────────────────────────────────────────────────────────────────────────────────────────`);
console.log(`\n${green('✔')} Created project in ./${response.dir}`);
console.log(`\n${bold('👉 Next steps:')}`);
console.log(`  cd ${response.dir}`);
console.log(`  ${devCmd}\n`);

if (response2.runtime !== 'cloudflare_workers') console.log(`Afterwards, visit in browser at http://localhost:${response2.port}`);
console.log(`\n────────────────────────────────────────────────────────────────────────────────────────────`);
console.log('\nNow go and have fun, and as always, stay frosty ❄️.');