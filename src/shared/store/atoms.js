import { atom } from 'jotai';

export const authAtom = atom(null);

export const servicesAtom = atom([]);
export const servicesLoadingAtom = atom(false);
export const servicesErrorAtom = atom(null);
