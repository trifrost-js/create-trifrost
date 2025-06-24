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
                    "dev": "npm run build && npm run dev:watch",
                    "dev:watch": args.includePodman
                        ? "tsc --watch & node --watch ./dist/index.js"
                        : "tsc --watch & node --env-file=.env --watch ./dist/index.js", /* note --env-file */
                    "build": "rm -rf ./dist && tsc -p ./tsconfig.json",
                    "lint": "./node_modules/.bin/eslint ./src",
                    "types": "tsc -p ./tsconfig.json --noEmit",
                },
                devDependencies: {
                    "@types/node": "^22.15.3",
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
                installCmd: 'npm install',
                devCmd: 'npm run dev',
            },
      };
}