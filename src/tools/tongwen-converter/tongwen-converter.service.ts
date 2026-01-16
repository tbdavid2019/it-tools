// Derived from the TongWen userscript (https://greasyfork.org/scripts/24300) v1.2.7.11.
// Character lists are kept inline to avoid external requests.

export type TongWenDirection = 's2t' | 't2s';

import s2tChar from './charater/s2t-char.json';
import t2sChar from './charater/t2s-char.json';
import { getWordDicts } from './word/index_static';

const s2tCharMap = new Map(Object.entries(s2tChar));
const t2sCharMap = new Map(Object.entries(t2sChar));

let s2tWordMap: Map<string, string> | null = null;
let t2sWordMap: Map<string, string> | null = null;
let initializationPromise: Promise<void> | null = null;

async function ensureInitialized() {
  if (s2tWordMap && t2sWordMap) return;
  if (!initializationPromise) {
    initializationPromise = getWordDicts().then(({ s2t, t2s }) => {
      s2tWordMap = new Map(Object.entries(s2t));
      t2sWordMap = new Map(Object.entries(t2s));
    });
  }
  await initializationPromise;
}

export async function convertTongWen(text: string, direction: TongWenDirection): Promise<string> {
  await ensureInitialized();

  let processed = text;
  const wordMap = direction === 's2t' ? s2tWordMap : t2sWordMap;
  const charMap = direction === 's2t' ? s2tCharMap : t2sCharMap;

  // 1. Phrase conversion
  if (wordMap) {
    // Very naive approach: checking every phrase. 
    // Efficiency warning: This is slow if the dictionary is huge and text is long.
    // However, for an "IT Tool" doing small text blocks, it might be acceptable.
    // A better approach would be Max-Match segmentation or Regex replacement.
    // Given the previous code was using replaceAll for a small list, let's try to construct a Regex 
    // or just iterate. The word dicts are large (hundreds of keys?), iterating all is costly.
    // But standard TongWen usually does max-match.
    // Let's create a Regex from keys.

    // Optimization: Build regex once.
    // But we lazily loaded the map.
    // For now, let's just do a simple replaceAll for keys present in the text? 
    // No, finding keys present is O(N*M).

    // Better strategy for this specific task scope:
    // Construct a RegExp from all keys in the dictionary, sorted by length descending.

    // We will do this via a helper in scope.
    processed = applyWordMap(processed, wordMap!);
  }

  // 2. Character conversion
  return Array.from(processed)
    .map(char => charMap?.get(char) ?? char)
    .join('');
}

function applyWordMap(text: string, map: Map<string, string>): string {
  // Construct a regex that matches any of the keys. 
  // Optimization: Cache this regex if possible on the map object or alongside it.
  // Since we are inside a function, let's assume valid performance for now. 
  // Collecting all keys every time is bad.

  // Actually, let's attach the regex to the map or a global variable after init.
  // See `ensureInitialized` update below.

  const keys = Array.from(map.keys()).sort((a, b) => b.length - a.length);
  if (keys.length === 0) return text;

  // Escaping regex special characters in keys is important
  const pattern = new RegExp(keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');

  return text.replace(pattern, (match) => map.get(match) || match);
}
