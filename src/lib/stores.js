import { writable } from 'svelte/store';

export const articles = writable([]);
export const categories = writable({});
export const currentCategory = writable('');