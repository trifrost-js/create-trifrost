export function dotfilesBlueprint ({serviceName, port, runtime, includeCache, scripts = {}, dependencies = {}, devDependencies = {}}) {
    return [
        ['package.json', JSON.stringify({
            name: serviceName,
            version: '0.0.0',
            private: true,
            scripts: {...scripts},
            dependencies: {
                '@trifrost/core': 'latest',
                ...dependencies,
            },
            devDependencies: {
                "eslint": "^9",
                "eslint-config-prettier": "^10",
                "eslint-plugin-prettier": "^5",
                "prettier": "^3",
                "typescript": "^5",
                "typescript-eslint": "^8",
                ...devDependencies,
            },
        }, null, 2)],
        /**
         * Prettier config
         * @see https://prettier.io/
         */
        ['.prettierrc', JSON.stringify({
            semi: true,
            singleQuote: true,
            trailingComma: 'es5',
        }, null, 2)],
        /**
         * Editor config
         * @see https://editorconfig.org/
         */
        ['.editorconfig', [
            'root = true',
            '',
            '[*]',
            'charset = utf-8',
            'end_of_line = lf',
            'insert_final_newline = true',
            'indent_style = space',
            'indent_size = 2',
            'trim_trailing_whitespace = true'
          ].join('\n')],
          /**
           * Eslint config
           */
          ['eslint.config.mjs', [
            "import eslint from '@eslint/js';",
            "import tseslint from 'typescript-eslint';",
            "import prettier from 'eslint-config-prettier';",
            "",
            "export default [",
            "  eslint.configs.recommended,",
            "  ...tseslint.configs.recommended,",
            "  prettier,",
            "  {",
            "    files: ['**/*.{ts,tsx,js,jsx}'],",
            "    languageOptions: {",
            "      ecmaVersion: 'latest',",
            "      sourceType: 'module'",
            "    },",
            "    linterOptions: {",
            "      reportUnusedDisableDirectives: true",
            "    },",
            "    rules: {",
            "      // add custom rules here",
            "      '@typescript-eslint/no-empty-object-type': 'off',",
            "      '@typescript-eslint/no-explicit-any': 'off'",
            "    }",
            "  }",
            "];"
          ].join('\n')],
          ...runtime === 'node'
            ? [['tsconfig.json', JSON.stringify({
                compilerOptions: {
                    target: "ES2022",
                    module: "Node16",
                    moduleResolution: "node16",
                    lib: ["ES2023", "DOM"],
                    jsx: "react-jsx",
                    jsxImportSource: "@trifrost/core",
                    strict: true,
                    esModuleInterop: true,
                    skipLibCheck: true,
                    allowSyntheticDefaultImports: true,
                    forceConsistentCasingInFileNames: true,
                    outDir: "./dist"
                },
                include: ["src/**/*.ts", "src/**/*.tsx"]
            }, null, 2)]]
            : runtime === 'cloudflare_workers'
                ? [['tsconfig.json', JSON.stringify({
                    compilerOptions: {
                        target: "es2021",
                        lib: ["es2021", "DOM"],
                        jsx: "react-jsx",
                        jsxImportSource: "@trifrost/core",
                        module: "es2022",
                        moduleResolution: "Bundler",
                        types: ["@cloudflare/workers-types"],
                        resolveJsonModule: true,
                        allowJs: true,
                        checkJs: false,
                        noEmit: true,
                        isolatedModules: true,
                        allowSyntheticDefaultImports: true,
                        forceConsistentCasingInFileNames: true,
                        strict: true,
                        skipLibCheck: true
                    },
                    include: ["src/**/*.ts", "src/**/*.tsx"]
                }, null, 2)]]
                : [['tsconfig.json', JSON.stringify({
                    compilerOptions: {
                        lib: ["ESNext", "DOM"],
                        target: "ESNext",
                        module: "ESNext",
                        moduleDetection: "force",
                        jsx: "react-jsx",
                        jsxImportSource: "@trifrost/core",
                        allowJs: true,
                        moduleResolution: "bundler",
                        types: ["bun-types"],
                        allowImportingTsExtensions: true,
                        verbatimModuleSyntax: true,
                        noEmit: true,
                        strict: true,
                        skipLibCheck: true,
                        noFallthroughCasesInSwitch: true,
                        noUnusedLocals: false,
                        noUnusedParameters: false,
                        noPropertyAccessFromIndexSignature: false
                    },
                    include: ["src/**/*.ts", "src/**/*.tsx"]
                }, null, 2)]],
          /**
           * Environment file
           */
          ...runtime !== 'cloudflare_workers'
            ? [
                ['.env', `
# A place for your environment variables
TRIFROST_DEV=true
TRIFROST_NAME="${serviceName}"
TRIFROST_VERSION="0.1.0"
TRIFROST_PORT=${port}
                `.trim()]
            ] : [
                ['wrangler.toml', [
`
name = "${serviceName}"
main = "src/index.ts"
compatibility_date = "2025-05-08"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = "./public/"
binding = "ASSETS"

[vars]
TRIFROST_NAME="${serviceName}"
TRIFROST_VERSION="0.1.0"
`.trim(),
includeCache ? `
[[durable_objects.bindings]]
name = "MainDurable"
class_name = "TriFrostDurableObject"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["TriFrostDurableObject"]`.trimEnd() : ''].join('').trim()],
                ['.dev.vars', `
# Fill in your environment variables here
TRIFROST_DEV=true
`],
            ]
    ];
}
