<script setup>
import { useSongStore } from '@/stores/song';
import { storeToRefs } from 'pinia';

const songStore = useSongStore();
const {
  currentSong, seek, duration, playerProgress, isSongPlaying,
} = storeToRefs(songStore);
const { toggleAudio, updateSeek } = songStore;
</script>

<template>
  <div class="fixed bottom-0 left-0 bg-white p-5 pb-4 text-left align-top w-full h-16">
    <div class="relative">
      <div class="float-left w-7 h-7 leading-3">
        <button
          type="button"
          @click.prevent="toggleAudio"
        >
          <i
            class="fa text-gray-500 text-xl"
            :class="{
              'fa-play': !isSongPlaying,
              'fa-pause': isSongPlaying
            }"
          />
        </button>
      </div>
      <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-5 mt-1">
        <span class="player-currenttime">{{ seek }}</span>
      </div>
      <div class="float-left w-7 h-7 leading-3 ml-7 mt-2 player-scrub">
        <div
          v-if="currentSong.modifiedName"
          class="absolute left-0 right-0 text-lg text-center mx-auto player-song-info"
        >
          <span class="song-title">{{ currentSong.modifiedName }}</span>
          <span class="song-artist">
            (由 {{ currentSong.displayName }} 上傳)
          </span>
        </div>
        <span
          class="block w-full h-2 rounded m-1 mt-2 bg-gray-200 relative cursor-pointer"
          @click.prevent="updateSeek"
        >
          <span
            class="absolute top-neg-8 text-gray-800 text-lg"
            :style="{ left: playerProgress }"
          >
            <i class="fas fa-circle" />
          </span>
          <span
            class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{ width: playerProgress }"
          />
        </span>
      </div>
      <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-8 mt-1">
        <span class="player-duration">{{ duration }}</span>
      </div>
    </div>
  </div>
</template>
