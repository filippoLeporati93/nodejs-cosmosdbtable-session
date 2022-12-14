'use strict';

module.exports = {
  opts: {
    readme: './README.md',
    package: './package.json',
    template: './node_modules/jsdoc-fresh',
    recurse: true,
    verbose: true,
    destination: './docs/'
  },
  plugins: [
    'plugins/markdown',
    'jsdoc-region-tag'
  ],
  source: {
    excludePattern: '(^|\\/|\\\\)[._]',
    include: [
      'build/src',
    ],
    includePattern: '\\.js$'
  },
  templates: {
    copyright: 'Filippo Leporati',
    includeDate: false,
    sourceFiles: false,
    systemName: 'nodejs-cosmosdbtable-session',
    theme: 'lumen',
    default: {
      outputSourceFiles: false
    }
  },
  markdown: {
    idInHeadings: true
  }
};
