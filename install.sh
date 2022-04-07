curl -fsSL https://get.pnpm.io/install.sh | PNPM_VERSION=7.0.0-rc.2 sh -

# /home/node/.bashrc
export PNPM_HOME="/home/node/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"

pnpm i -g zx
zx ./scripts/install.mjs

echo 'need `source /home/node/.bashrc`'
