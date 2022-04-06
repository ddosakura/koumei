#!/usr/bin/env zx

const pkg = await fs.readJson('./package.json');
// await $`cat package.json | grep name`

const { version } = pkg;
$`echo ${version}`;

await Promise.all(['ds'].map(async (name) => {
  const pkg = await fs.readJson(`./packages/${name}/package.json`);
  await fs.writeJson(`./packages/${name}/package.json`, {
    ...pkg,
    version,
    peerDependencies: {
      react: '^16.8.0 || ^17.0.0',
    },
  }, {
    spaces: 2,
  });
}));

// await $`git add .`
// await $`git commit -m "build: ${version}".`
// await $`./build.sh`
// await $`./publish.sh`
