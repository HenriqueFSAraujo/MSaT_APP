const glob = require('glob');
const {PurgeCSSPlugin} = require('purgecss-webpack-plugin');

/*

skippedContentGlobs: ['node_modules/**', 'components/**']
Here, PurgeCSS will not scan anything in the "node_modules" and "components" folders.

*/

module.exports = {
  plugins: [
    new PurgeCSSPlugin(
      {
        paths: glob.sync('./src/**/*', { nodir: true }),
        skippedContentGlobs: [],
        extractors: [
          {
            extractor: (content) => content.match(/[A-Za-z0-9-_:%\/]+/g) || [],
            extensions: ['html'],
          }
        ],
        safelist: {
          standard: [/^ql-/, /^::-webkit/],
          deep: [/^cdk-/, /^mat-/, /^mdc-/, /^ng-/, /^filetype-/],
          greedy: [/fxLayout/, /fxFlex/]
        }
      })
  ]
};
