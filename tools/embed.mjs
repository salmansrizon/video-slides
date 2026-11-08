// Wraps a file as a <script> so a deck can use it when opened from disk (browsers block fetch() on file://).
//   node tools/embed.mjs decks/my-video/assets/intro.json   -> intro.json.js sets ASSETS['intro'] = { ...Lottie JSON }
//   node tools/embed.mjs decks/my-video/assets/robot.glb    -> robot.glb.js  sets ASSETS['robot'] = 'data:...'
// Then: <script src="assets/intro.json.js"></script>
//   lottie.loadAnimation({ container, renderer: 'svg', autoplay: false, animationData: ASSETS.intro })
//   new THREE.GLTFLoader().load(ASSETS.robot, gltf => scene.add(gltf.scene))
// Plain <img> tags don't need this; WebGL textures and 3D models do.
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, extname } from 'node:path';

const MIME = { '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.hdr': 'application/octet-stream', '.svg': 'image/svg+xml' };
const file = process.argv[2];
if (!file) { console.log('Usage: node tools/embed.mjs <file>'); process.exit(2); }
const ext = extname(file).toLowerCase(), key = basename(file, ext);
const value = ext === '.json'
  ? JSON.stringify(JSON.parse(readFileSync(file, 'utf8')))
  : JSON.stringify(`data:${MIME[ext] || 'application/octet-stream'};base64,${readFileSync(file).toString('base64')}`);
writeFileSync(`${file}.js`, `(window.ASSETS = window.ASSETS || {})[${JSON.stringify(key)}] = ${value};\n`);
console.log(`Wrote ${file}.js  ->  ASSETS[${JSON.stringify(key)}]`);
