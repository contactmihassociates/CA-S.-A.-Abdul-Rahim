// Usage: node scripts/build-lastmod.mjs
// Writes src/data/lastmod.json: the date each page's own source file last changed in git.
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';

const OUT = 'src/data/lastmod.json';
const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
const gitDate = (files) => {
  try {
    return execSync(`git log -1 --format=%cs -- ${files.map((f) => `"${f}"`).join(' ')}`, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};

const map = {};
const add = (path, files) => {
  const d = gitDate(files.filter((f) => existsSync(f)));
  map[path] = d || prev[path] || '';
};

const walk = (dir, base) => {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = `${dir}/${name.name}`;
    if (name.isDirectory()) walk(full, `${base}${name.name}/`);
    else if (name.name.endsWith('.astro') && !name.name.startsWith('[')) {
      const slug = name.name === 'index.astro' ? base : `${base}${name.name.replace('.astro', '')}/`;
      add(slug, [full]);
    }
  }
};
walk('src/pages', '/');

const tools = JSON.parse(readFileSync('src/data/tools.json', 'utf8'));
const list = Array.isArray(tools) ? tools : tools.tools || Object.values(tools);
const toolDate = gitDate(['src/pages/tools/[key].astro', 'src/data/tool-copy.json']);
for (const t of list) if (t && t.key) map[`/tools/${t.key}/`] = toolDate || prev[`/tools/${t.key}/`] || '';

writeFileSync(OUT, JSON.stringify(map, null, 2) + '\n');
console.log(`lastmod: ${Object.keys(map).length} paths written to ${OUT}`);
