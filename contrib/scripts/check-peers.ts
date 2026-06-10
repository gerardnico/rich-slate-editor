import {readFileSync} from "node:fs";

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const peers = pkg.peerDependencies ?? {};
const dev = pkg.devDependencies ?? {};
let hasError = false;

for (const [name, peerVersion] of Object.entries(peers)) {
    if (dev[name] !== peerVersion) {
        console.error(`MISMATCH: ${name} — peer: ${peerVersion}, dev: ${dev[name] ?? 'missing'}`);
        hasError = true;
    }
}
if (hasError) process.exit(1);
else console.log('All peerDependencies match devDependencies ✓');