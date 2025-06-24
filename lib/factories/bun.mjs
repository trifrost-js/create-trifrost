import { cssBlueprint } from "./blueprints/css.mjs";
import { dotfilesBlueprint } from "./blueprints/dotfiles.mjs";
import { podmanBlueprint } from "./blueprints/podman.mjs";
import { publicBlueprint } from "./blueprints/public.mjs";
import { scriptBlueprint } from "./blueprints/script.mjs";
import { typesBlueprint } from "./blueprints/types.mjs";
import { factory as kitFactory } from './kits';

export function factory (args) {
    return {
        files: [
            ...cssBlueprint(args),
            ...scriptBlueprint(args),
            ...dotfilesBlueprint({
                ...args,
                scripts: {
                    "dev": "bun run --watch ./src/index.ts",
                    "build": "rm -rf ./dist && bun build ./src/index.ts --outdir ./dist",
                    "lint": "./node_modules/.bin/eslint ./src",
                    "types": "tsc -p ./tsconfig.json --noEmit",
                },
                devDependencies: {
                    "bun-types": "^1.2.17"
                },
            }),
            ...typesBlueprint(args),
            ...podmanBlueprint(args),
            ...publicBlueprint(args),
            ...kitFactory(args),
        ],
        ...args.includePodman
            ? {
                installCmd: 'podman-compose build --no-cache',
                devCmd: 'podman-compose up',
            }
            : {
                installCmd: 'bun install',
                devCmd: 'bun run dev',
            },
      };
}