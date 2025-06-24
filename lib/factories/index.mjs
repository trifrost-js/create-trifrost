import {factory as bunFactory} from './bun.mjs';
import {factory as cloudflareWorkersFactory} from './cloudflare_workers.mjs';
import {factory as nodeFactory} from './node.mjs';

export function factory (runtime, args) {
    switch (runtime) {
        case 'bun': return bunFactory(args);
        case 'cloudflare_workers': return cloudflareWorkersFactory(args);
        case 'node': return nodeFactory(args);
    }
}