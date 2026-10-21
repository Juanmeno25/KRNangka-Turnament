const v = (n) => `rgb(var(--${n}) / <alpha-value>)`;
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'] },
      colors: {
        bg: v('bg'), surface: v('surface'), 'surface-2': v('surface-2'),
        ink: v('ink'), muted: v('muted'), line: v('line'),
        brand: v('brand'), 'brand-ink': v('brand-ink'),
        accent: v('accent'), 'accent-ink': v('accent-ink'),
        hero: v('hero'), danger: v('danger'), 'danger-ink': v('danger-ink'),
      },
      borderColor: { DEFAULT: v('line') },
    },
  },
};
