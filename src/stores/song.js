import { defineStore } from 'pinia';

export const useSongStore = defineStore('song', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count += 1;
    },
  },
});
