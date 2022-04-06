curl -fsSL https://get.pnpm.io/install.sh | PNPM_VERSION=7.0.0-rc.2 sh -
source /home/node/.bashrc
pnpm i -g zx
zx ./scripts/install.mjs
