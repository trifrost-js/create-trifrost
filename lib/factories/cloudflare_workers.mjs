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
                    "deploy": "wrangler deploy",
                    "dev": "wrangler dev",
                    "start": "wrangler dev",
                    "lint": "./node_modules/.bin/eslint ./src",
                    "types": "tsc -p ./tsconfig.json --noEmit"
                },
                devDependencies: {
                    "@cloudflare/workers-types": "^4.20250620.0",
                    "wrangler": "^4.20.5"
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