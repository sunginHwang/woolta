import { atom } from 'jotai';

export const toastAtom = atom('');
export const alertAtom = atom('');
export const LoadingAtom = atom({ isLoading: false, message: '' });
