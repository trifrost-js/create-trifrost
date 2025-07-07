export function scriptBlueprint ({includeScript, includeScriptAtomic, includeCss}) {
    if (!includeScript) return [];

    const val = `
import {createScript} from '@trifrost/core';
import {type Env} from './types';${includeCss ? "\nimport {css} from './css';" : ""}

type RelayEvents = {
  /**
   * Add your own relay events here
   * @see https://www.trifrost.dev/docs/jsx-script-behavior
   */
};

type StoreData = {
  /**
   * Add your global store type here
   * @see https://www.trifrost.dev/docs/jsx-script-behavior
   */
};

const config = {
    atomic: ${includeScriptAtomic ? 'true' : 'false'}${includeCss ? ",\n    css: css," : ""}
} as const;

export const {
    Module,
    Script,
    script
} = createScript<typeof config, Env, RelayEvents, StoreData>(config);`;

    return [['src/script.ts', val.trim()]];
}
