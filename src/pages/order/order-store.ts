import { atom } from "jotai";

export const ordersState = atom<any[]>([]);
export const ordersPageState = atom(1);
export const ordersHasMoreState = atom(true);
export const ordersLoadedState = atom(false);
export const ordersScrollState = atom(0);
