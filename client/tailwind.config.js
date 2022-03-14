const production = !process.env.ROLLUP_WATCH;

module.exports = {
  mode: "jit",
  content: [
    './src/**/*.{html,js,svelte,ts}'
  ],
  /*
  safelist: [
    // 'text-2xl',
    // 'text-3xl',
    {
      // pattern: /bg-([a-z]{1,9})-(50|100|200|300|400|500|600|700|800|900)/,
      pattern: /checked:bg-(yellow|pink|green|amber|sky|violet|rose)-(300|500|600)/,
      //patterm: /bg-red-.+/,
      //variants: ['checked', 'hover'],
    },
  ],
  */
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkPurple: "#674392",
        pastelGreen: "#BAFFB4",
        lightPurple: "#AE70BC",
      },
    },
  },
  plugins: [],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  
  
};
