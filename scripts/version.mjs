#!/usr/bin/env zx

const pkg = await fs.readJson('./package.json');
// await $`cat package.json | grep name`

const { version, author, license, repository } = pkg;
$`echo ${version}`;

await Promise.all([
  // vanilla js
  'shared',
  'video-player',

  // react
  'hooks',
  'ds',

  // react-dom
  'micro',

  // other
  'hakke',
].map(async (name) => {
  const pkg = await fs.readJson(`./packages/${name}/package.json`);
  // $`echo ${pkg.peerDependencies?.react}`;
  await fs.writeJson(`./packages/${name}/package.json`, {
    files: [
      'dist',
    ],
    main: './dist/index.js',
    module: './dist/index.js',
    typings: './dist/index.d.ts',
    description: '',
    keywords: [],
    dependencies: {},
    ...pkg,
    version,
    author,
    license,
    repository,
    peerDependencies: {
      ...(pkg.peerDependencies?.react ? { react: '^16.8.0 || ^17.0.0' } : {}),
      ...(pkg.peerDependencies?.['react-dom'] ? { 'react-dom': '^16.8.0 || ^17.0.0' } : {}),
    },
  }, {
    spaces: 2,
  });
}));

// await $`git add .`
// await $`git commit -m "build: ${version}".`
// await $`./build.sh`
// await $`./publish.sh`
