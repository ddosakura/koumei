#!/usr/bin/env zx

await $`pnpm i`;

await $`ln -s /web /com.docker.devenvironments.code/dist`

await $`echo 'Hello World!'`;
