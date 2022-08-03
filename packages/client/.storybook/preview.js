export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*', argTypesRegex: '^handle[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
