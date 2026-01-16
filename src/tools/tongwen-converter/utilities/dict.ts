import type { Dict } from '../model/model';

export function defineDict(dict: Dict): Dict {
    return dict;
}

export function createRevertDict(dict: Dict): Dict {
    return Object.entries(dict).reduce((acc, [k, v]) => {
        acc[v] = k;
        return acc;
    }, {} as Dict);
}

export function joinDicts(dicts: Dict[]): Dict {
    return dicts.reduce((acc, dict) => ({ ...acc, ...dict }), {});
}
