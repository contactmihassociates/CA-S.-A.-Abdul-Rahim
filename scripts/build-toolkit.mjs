// Build the calculators from toolkit/src/toolkit.jsx (adapted from the finclar toolkit).
// Outputs, all generated (do not edit by hand):
//   public/toolkit/app.<hash>.js        shell: loader, shared helpers, year rules, App
//   public/toolkit/tools/<key>.<hash>.js one file per calculator, loaded on demand
//   public/toolkit/toolkit.<hash>.css    toolkit styles, scoped under .tk
//   public/toolkit/vendor/*              React and QR code libraries
//   src/data/tools.json                  key, label, category, heading and summary per calculator
// Run: npm run build:toolkit (also runs before every npm run build)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import babel from '@babel/core';
import postcss from 'postcss';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const tk = (...p) => path.join(root, 'toolkit', ...p);
const out = path.join(root, 'public', 'toolkit');
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 12);
const t0 = Date.now();

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'tools'), { recursive: true });
fs.mkdirSync(path.join(out, 'vendor'), { recursive: true });

// ---- JavaScript: split each registered calculator into its own file ----
const src = fs.readFileSync(tk('src', 'toolkit.jsx'), 'utf8').split('\r\n').join('\n');
const chunks = [];
const dependencies = new Set();
let categories = [];
babel.transformSync(src, {
  code: false, ast: false, babelrc: false, configFile: false,
  parserOpts: { plugins: ['jsx'] },
  plugins: [() => ({ visitor: { Program(program) {
    const registry = program.scope.getBinding('TOOLS').path;
    for (const entry of registry.node.init.properties) {
      const key = entry.key.name;
      const props = entry.value.properties;
      const name = props.find((p) => p.key.name === 'comp').value.name;
      const label = props.find((p) => p.key.name === 'label').value.value;
      const binding = program.scope.getBinding(name);
      if (!binding || binding.kind !== 'const' || binding.path.parent.declarations.length !== 1)
        throw Error('Calculator needs a single constant declaration: ' + name);
      const deps = new Set();
      binding.path.traverse({ ReferencedIdentifier(ref) {
        const b = ref.scope.getBinding(ref.node.name);
        if (b && b.scope === program.scope && ref.node.name !== name) {
          if (b.kind !== 'const') throw Error('Mutable shared value needs an accessor: ' + ref.node.name);
          deps.add(ref.node.name); dependencies.add(ref.node.name);
        }
      } });
      const decl = binding.path.parent;
      chunks.push({ key, name, label, deps: [...deps].sort(), start: decl.start, end: decl.end });
    }
    const cats = program.scope.getBinding('CATEGORIES').path.node.init.elements;
    categories = cats.map((c) => {
      const get = (k) => c.properties.find((p) => p.key.name === k).value;
      return { k: get('k').value, label: get('label').value, tools: get('tools').elements.map((e) => e.value) };
    });
  } } })],
});

const manifest = {};
const meta = [];
const attr = (tag, name) => {
  const m = tag.match(new RegExp('\\b' + name + '="([^"]*)"'));
  return m ? m[1].replace(/&apos;/g, "'").replace(/&amp;/g, '&').replace(/&#8377;|₹/g, 'Rs ').trim() : '';
};
for (const c of chunks) {
  const body = src.slice(c.start, c.end);
  const factory = 'FinclarToolLoader.register(' + JSON.stringify(c.key) + ', shared => {const {' + c.deps.join(',') + '}=shared;' + body + ';return ' + c.name + ';});';
  const code = babel.transformSync(factory, { babelrc: false, configFile: false, presets: ['@babel/preset-react'], compact: true, comments: false }).code;
  const file = c.key + '.' + hash(code) + '.js';
  fs.writeFileSync(path.join(out, 'tools', file), code + '\n');
  manifest[c.key] = '/toolkit/tools/' + file;
  const tag = (body.match(/<PanelHead\b[\s\S]*?\/>/) || [''])[0];
  const cat = categories.find((x) => x.tools.includes(c.key));
  meta.push({ key: c.key, label: c.label, cat: cat ? cat.k : 'other', catLabel: cat ? cat.label : 'Other', title: attr(tag, 'title'), em: attr(tag, 'em').replace(/^[—–-]\s*/, ''), sub: attr(tag, 'sub') });
}

let shell = src;
for (const c of [...chunks].sort((a, b) => b.start - a.start)) {
  shell = shell.slice(0, c.start) + 'const ' + c.name + ' = makeLazyTool(' + JSON.stringify(c.key) + ',' + JSON.stringify(c.label) + ');' + shell.slice(c.end);
}
const bridge = 'FinclarToolLoader.configure(' + JSON.stringify(manifest) + ',()=>({' + [...dependencies].sort().join(',') + '}));\n';
shell = shell.replace('ReactDOM.createRoot(', bridge + 'ReactDOM.createRoot(');
const shellCode = babel.transformSync(shell, { babelrc: false, configFile: false, presets: ['@babel/preset-react'], compact: true, comments: false }).code;
const rules = JSON.parse(fs.readFileSync(tk('tax-rules.json'), 'utf8'));
const cores = ['tool-loader', 'hra-core', 'vda-core', 'holding-period', 'indexation-core', 'property-relief', 'tool-navigation', 'rent-relief', 'nri-core'];
const app = '/* Calculators for casaabdulrahim.in, built from toolkit/src/toolkit.jsx by scripts/build-toolkit.mjs. */\n'
  + 'window.FINCLAR_TAX_RULES=' + JSON.stringify(rules) + ';\n'
  + 'window.CA_TOOL=(document.getElementById("app")||{dataset:{}}).dataset.tool||null;\n'
  + cores.map((n) => fs.readFileSync(tk('core', n + '.js'), 'utf8')).join('\n') + '\n' + shellCode;
const appFile = 'app.' + hash(app) + '.js';
fs.writeFileSync(path.join(out, appFile), app);

for (const f of fs.readdirSync(tk('vendor'))) fs.copyFileSync(tk('vendor', f), path.join(out, 'vendor', f));

// ---- CSS: scope every rule under .tk so the toolkit cannot restyle the site ----
const cssSources = ['base', 'vda-tool', 'holding-period', 'indexation-flow', 'tool-navigation', 'toolkit-entry', 'tool-loading',
  'rent-relief', 'property-tds', 'pan-guide', 'epf-withdrawal', 'gst-delay', 'ecommerce-tds', 'toolkit-design', 'theme'];
const scopeSel = (sel) => {
  sel = sel.trim();
  if (/^(#finclar-report|body\.printing-report)/.test(sel)) return sel; // the PDF report is appended to <body>
  sel = sel.replace(/^html\[data-theme="light"\]\s*/, '').replace(/^body\.toolkit-page\b/, '.tk');
  if (sel === ':root' || sel === 'html' || sel === 'body' || sel === '.tk') return '.tk';
  if (sel.startsWith('.tk')) return sel;
  if (/^(html|body)(::?[a-z-]+)/.test(sel)) return sel.replace(/^(html|body)/, '.tk');
  if (/^(html|body)\s/.test(sel)) return sel.replace(/^(html|body)\s+/, '.tk ');
  return '.tk ' + sel;
};
const scope = () => ({
  postcssPlugin: 'scope-tk',
  Once(rootNode) {
    rootNode.walkAtRules('font-face', (r) => r.remove());
    rootNode.walkRules((rule) => {
      if (rule.parent.type === 'atrule' && /keyframes/.test(rule.parent.name)) return;
      if (/data-theme="dark"/.test(rule.selector)) { rule.remove(); return; }
      rule.selectors = [...new Set(rule.selectors.map(scopeSel))];
    });
    rootNode.walkDecls((d) => { if (/finclar/i.test(d.value)) d.remove(); });
  },
});
const rawCss = cssSources.map((n) => fs.readFileSync(tk('css', n + '.css'), 'utf8')).join('\n');
const css = (await postcss([scope()]).process(rawCss, { from: undefined })).css;
const cssFile = 'toolkit.' + hash(css) + '.css';
fs.writeFileSync(path.join(out, cssFile), css);

fs.writeFileSync(path.join(root, 'src', 'data', 'tools.json'), JSON.stringify({
  app: '/toolkit/' + appFile, css: '/toolkit/' + cssFile, categories, tools: meta,
}, null, 1) + '\n');
console.log(`toolkit: ${chunks.length} calculators, app ${(app.length / 1024).toFixed(0)} KB, css ${(css.length / 1024).toFixed(0)} KB, ${Date.now() - t0} ms`);
