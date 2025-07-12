export function scriptBlueprint ({includeScript, includeScriptAtomic, includeCss}) {
    if (!includeScript) return [];

    const val = `
import {createScript, createModule} from '@trifrost/core';
import {type Env} from './types';${includeCss ? "\nimport {css} from './css';" : ""}

export const { Module } = createModule({${includeCss ? "css" : ""}});

const config = {
    atomic: ${includeScriptAtomic ? 'true' : 'false'}${includeCss ? ",\n    css: css," : ""}
    modules: {
      // Your modules
    },
} as const;

export const { Script, script } = createScript<typeof config, Env>(config);`;

    return [['src/script.ts', val.trim()]];
}
