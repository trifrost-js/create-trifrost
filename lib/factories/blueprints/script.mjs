export function scriptBlueprint ({includeScript, includeScriptAtomic}) {
    if (!includeScript) return [];

    const val = `
import {createScript} from '@trifrost/core';
import {type Env} from './types.ts';

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

export const {Script, script} = createScript<Env, RelayEvents, StoreData>({atomic: ${includeScriptAtomic ? 'true' : 'false'}});`;

    return [['src/script.ts', val.trim()]];
}
