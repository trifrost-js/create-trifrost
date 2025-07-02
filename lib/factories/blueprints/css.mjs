export function cssBlueprint ({includeCss, includeCssReset}) {
    if (!includeCss) return [];

    const val = `
/* eslint-disable @typescript-eslint/no-unused-vars */

import {createCss} from '@trifrost/core';

export const css = createCss({
  theme: {
    bg: {
      light: '#ECF0FA',
      dark: '#0A101C',
    },
    fg: {
      light: '#03111F',
      dark: '#ffffff',
    },
    /**
     * Add your own theme here
     * @see https://www.trifrost.dev/docs/jsx-style-system
     */
  },
  var: {
    fontSizeHeader: '2rem',
    fontSizeBody: '1.6rem',
    /**
     * Add your own design tokens here
     * @see https://www.trifrost.dev/docs/jsx-style-system
     */
  },
  definitions: mod => ({
    f: () => ({display: 'flex'}),
    fa_c: () => ({alignItems: 'center'}),
    fj_c: () => ({justifyContent: 'center'}),
    fh: () => ({flexDirection: 'row'}),
    fv: () => ({flexDirection: 'column'}),
    header: () => ({
      fontSize: mod.$v.fontSizeHeader,
      fontWeight: 600,
    }),
    link: () => ({
      textDecoration: 'underline',
      color: mod.$t.fg,
      [mod.hover]: {
        backgroundColor: mod.$t.fg,
        color: mod.$t.bg,
        textDecoration: 'none',
      },
    }),
    /**
     * Add your own definitions here
     * @see https://www.trifrost.dev/docs/jsx-style-system
     */
  }),
  reset: ${includeCssReset ? 'true' : 'false'},
  themeAttribute: true,
});`;

    return [['src/css.ts', val.trim()]];
}
