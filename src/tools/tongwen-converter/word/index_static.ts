
type Dict = Record<string, string>;

function joinDicts(dicts: Dict[]): Dict {
    return dicts.reduce((acc, dict) => ({ ...acc, ...dict }), {});
}


import entertainmentS2T from './entertainment.s2t';
import entertainmentT2S from './entertainment.t2s';
import generalS2T from './general.s2t';
import generalT2S from './general.t2s';
import itS2T from './it.s2t';
import itT2S from './it.t2s';
import personS2T from './person.s2t';
import personT2S from './person.t2s';
import placeS2T from './place.s2t';
import placeT2S from './place.t2s';
import punctuationS2T from './punctuation.s2t';
import punctuationT2S from './punctuation.t2s';
import scienceS2T from './science.s2t';
import scienceT2S from './science.t2s';
import unitS2T from './unit.s2t';
// No unitT2S exists in the file list I saw earlier (only unit.s2t.ts)

const s2tDicts: Dict[] = [
    entertainmentS2T,
    generalS2T,
    itS2T,
    personS2T,
    placeS2T,
    punctuationS2T,
    scienceS2T,
    unitS2T,
];

const t2sDicts: Dict[] = [
    entertainmentT2S,
    generalT2S,
    itT2S,
    personT2S,
    placeT2S,
    punctuationT2S,
    scienceT2S,
];

export const getWordDicts = () => {
    const s2t = joinDicts(s2tDicts);
    const t2s = joinDicts(t2sDicts);
    return Promise.resolve({ s2t, t2s });
};
