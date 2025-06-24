import { helloWorldBlueprint } from "./helloworld.mjs";

export function factory (args) {
    switch (args.kit) {
        case 'hello_world': return helloWorldBlueprint(args);
        default: return [];
    }
}