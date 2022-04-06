/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-param-reassign */

const pkg = require('./package.json');
const { react } = pkg.dependencies;

function readPackage(pkg) {
  if (['eslint-config-tencent'].includes(pkg.name)) {
    delete pkg.peerDependencies['@babel/core'];
    delete pkg.peerDependencies['eslint-plugin-prettier'];
    delete pkg.peerDependencies.prettier;
  }
  if (['@babel/eslint-parser'].includes(pkg.name)) {
    delete pkg.peerDependencies['@babel/core'];
  }
  if (pkg.name.startsWith('@bql/')) {
    delete pkg.peerDependencies.react;
    pkg.dependencies.react = react
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};

