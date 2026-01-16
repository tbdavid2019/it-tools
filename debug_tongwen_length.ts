import { readFileSync } from 'fs';

const content = readFileSync('src/tools/tongwen-converter/tongwen-converter.service.ts', 'utf-8');
const simplifiedMatch = content.match(/const simplifiedCharacters =\s*"([^"]+)"/);
const traditionalMatch = content.match(/const traditionalCharacters =\s*"([^"]+)"/);

if (simplifiedMatch && traditionalMatch) {
    const s = simplifiedMatch[1];
    const t = traditionalMatch[1];
    console.log(`Simplified length: ${s.length}`);
    console.log(`Traditional length: ${t.length}`);
    if (s.length !== t.length) {
        console.log('Lengths differ!');
        // Find where they diff (visually) if one has extra chars
        // Or finding if I accidentally deleted a char
        for (let i = 0; i < Math.min(s.length, t.length); i++) {
            // Just iterating to find mismatches in length logic? No, length is global.
        }
    }
} else {
    console.log('Could not find strings');
}
