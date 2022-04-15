/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-param-reassign */

const pkg = require('./package.json');
const { react, 'react-dom': reactDom } = pkg.dependencies;

function readPackage(pkg) {
  if (['eslint-config-tencent'].includes(pkg.name)) {
    delete pkg.peerDependencies['@babel/core'];
    delete pkg.peerDependencies['eslint-plugin-prettier'];
    delete pkg.peerDependencies.prettier;
  }
  if (['@babel/eslint-parser'].includes(pkg.name)) {
    delete pkg.peerDependencies['@babel/core'];
  }
  if (['rollup-plugin-visualizer'].includes(pkg.name)) {
    delete pkg.peerDependencies.rollup;
  }
  if (pkg.name.startsWith('@bql/') && pkg.peerDependencies && pkg.peerDependencies.react) {
    delete pkg.peerDependencies.react;
    delete pkg.peerDependencies['react-dom'];
    pkg.dependencies.react = react;
    pkg.dependencies['react-dom'] = reactDom;
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};


