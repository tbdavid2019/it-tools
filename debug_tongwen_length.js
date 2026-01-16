import { readFileSync } from 'fs';

const content = readFileSync('src/tools/tongwen-converter/tongwen-converter.service.ts', 'utf-8');
const simplifiedMatch = content.match(/const simplifiedCharacters =\n\s*"([^"]+)"/);
const traditionalMatch = content.match(/const traditionalCharacters =\n\s*"([^"]+)"/);

if (simplifiedMatch && traditionalMatch) {
    const s = simplifiedMatch[1];
    const t = traditionalMatch[1];
    console.log(`Simplified length: ${s.length}`);
    console.log(`Traditional length: ${t.length}`);
} else {
    console.log('Could not find strings');
    if (!simplifiedMatch) console.log('Simplified match failed');
    if (!traditionalMatch) console.log('Traditional match failed');
}
