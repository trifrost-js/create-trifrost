import {readFileSync} from 'fs';

export function publicBlueprint () {
    return [
        ['public/logo.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118 126" width="100">
  <g fill="#1491b6">
    <rect transform="rotate(150 69.2 19) scale(.20714)" rx="13" height="200.3" width="21" y="-4" x="326.2" />
    <rect transform="rotate(-150 50.5 19) scale(.20714)" rx="13" height="200.3" width="21" y="-8.4" x="238.3" />
    <rect transform="rotate(150 106.5 84.3) scale(.20714)" rx="13" height="221.3" width="21" y="300.3" x="506.2" />
    <rect transform="rotate(-150 13.3 84.3) scale(.20714)" rx="13" height="221.3" width="21" y="296" x="58.8" />
    <rect transform="rotate(90 22.2 102.5) scale(.20714)" rx="13" height="206.1" width="21" y="396.1" x="94.6" />
    <rect transform="matrix(0 .20714 -.20714 0 200 5)" rx="13" height="206.1" width="21" y="396.1" x="457.8" />
    <rect transform="rotate(40 69.2 113.4) scale(.20714)" rx="13" height="152.7" width="21" y="472.3" x="318.6" />
    <rect transform="rotate(-40 50.5 113.4) scale(.20714)" rx="13" height="152.7" width="21" y="466.6" x="231.4" />
  </g>
  <g fill="#27b0d5">
    <rect rx="13" height="93.8" width="5.4" y="20.1" x="56.3" />
    <rect transform="rotate(59 61.3 67.3) scale(.20714)" rx="13" height="470" width="26" y="92.6" x="278.6" />
    <rect transform="rotate(-59 58.7 67.3) scale(.20714)" rx="13" height="470" width="26" y="84.9" x="270" />
    <path d="m35.1 65.6 12.7 6-5.7 3.7-7-3.8v-6zM27 75l9.8 3-5.7 4-8.4-4.2L27 75zm5.8 11.1 7-4.2-3 11-5.2 1.7 1.2-8.5zm11.6-8 5.5-2.5-2.1 14.2-4.3-2 .9-9.7zm12.3 14.7.8 6.6-7.4 6-1.9-4.6 8.5-8zm4.3-.3 9 8.3-1.6 4.5-7.5-5.8.2-7zm18-10.2 6.2 3.4 1.5 8.7-5.2-1.8L79 82.3zm11.4-7.5 4.9 3-8 4-6.6-3.7 9.7-3.3zM90.2 39l-1.5 8-6.4 4.3 2.1-10.6 5.8-1.6zm-5.9 16.3 5.6-3.8 7.8 2.7-4.2 3.8-9.2-2.7zm-1.1 10.3v6L76 75l-5.2-3 12.4-6.4zm-9 13.6.7 8.4-4.3 2.4-2.3-14 5.9 3.2zM49.7 42.8l7 6.4.2 7.4-11-10.5 3.8-3.3zm18.8.2 3.8 2.8-11 11.3-.5-7.2 7.7-7zM68 29.5l.9 5.4-7.4 6.8v-7.5l6.4-4.7zm-11.4 5v6.8L49.4 35l.7-5.6 6.5 5.1zm-23.1 6.1L36 51.4l-6.1-4-1.9-8.2 5.5 1.4zm.8 14.9-9.7 2.7-4-3.8 8-2.8 5.7 3.9z" />
  </g>
</svg>       
`.trim()],
        ['public/favicon.ico', readFileSync(new URL('./favicon.ico', import.meta.url))],
    ];
}