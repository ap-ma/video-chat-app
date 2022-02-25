const path = require('path')

module.exports = {
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  webpackFinal: async (config, { configType }) => ({
    ...config,
    resolve: {
      ...config.resolve,
      modules: [...config.resolve.modules, process.cwd()],
      alias: {
        ...config.resolve.alias,
        '@emotion/core': path.join(process.cwd(), 'node_modules/@emotion/react'),
        'emotion-theming': path.join(process.cwd(), 'node_modules/@emotion/react')
      }
    }
  })
}
