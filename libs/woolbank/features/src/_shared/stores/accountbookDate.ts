import dayjs from 'dayjs';
import { atom } from 'jotai';

export const selectedAccountBookDateAtom = atom<string>(dayjs().format('YYYY-MM'));
