#!/usr/bin/env zx

await $`pnpm i`;

// TODO: 优化 dev &prod 统一
await $`ln -s /web /com.docker.devenvironments.code/dist`

await $`echo 'Hello World!'`;
