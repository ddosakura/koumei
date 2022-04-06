import {
  importDirectory,
  cleanupSVG,
  runSVGO,
  parseColors,
  isEmptyColor,
} from '@iconify/tools';

import unocss from 'unocss/vite';
import unocssPresetIcons from '@unocss/preset-icons';

const loadIconAssets = async (prefix: string, path: string) => {
  const iconSet = await importDirectory(path, { prefix });
  await iconSet.forEach(async (name, type) => {
    if (type !== 'icon') {
      return;
    }
    const svg = iconSet.toSVG(name);
    if (!svg) {
      iconSet.remove(name);
      return;
    }
    try {
      await cleanupSVG(svg);
      if (!name.startsWith('nomask-')) {
        await parseColors(svg, {
          defaultColor: 'currentColor',
          callback: (attr, colorStr, color) => (!color || isEmptyColor(color) ? colorStr : 'currentColor'),
        });
      }
      await runSVGO(svg);
    } catch (err) {
      console.error(`Error parsing ${name}:`, err);
      iconSet.remove(name);
      return;
    }
    iconSet.fromSVG(name.replace('icon-24-', '').replace('nomask-', ''), svg);
  });
  return iconSet.export();
};
const useIconCache = true;
const iconCache = new Map<string, ReturnType<typeof loadIconAssets>>();
const collections = Object.fromEntries(Object.entries({
  'koumei': 'assets',
}).map(([prefix, path]) => [prefix, () => {
  if (!useIconCache) return loadIconAssets(prefix, path);
  if (!iconCache.has(prefix)) iconCache.set(prefix, loadIconAssets(prefix, path));
  return iconCache.get(prefix)!;
}]));

export default unocss({
  presets: [
    unocssPresetIcons({ collections }),
  ],
})
