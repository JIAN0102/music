import { defineStore } from 'pinia';
import { Howl } from 'howler';
import { formatTime } from '@/includes/helper';

export const useSongStore = defineStore('song', {
  state: () => ({
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
    volume: '100%',
  }),
  getters: {
    isSongPlaying: (state) => (state.sound.playing
      ? state.sound.playing()
      : false
    ),
  },
  actions: {
    createSong(payload) {
      if (this.sound instanceof Howl) {
        this.sound.unload();
      }

      this.currentSong = payload;
      this.sound = new Howl({
        src: [payload.url],
        html5: true,
        volume: 1,
      });

      this.sound.play();

      this.sound.on('play', () => {
        requestAnimationFrame(() => {
          this.updateProgress();
        });
      });
    },
    toggleAudio() {
      if (!this.sound.playing) return;

      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },
    updateProgress() {
      this.updatePosition();

      if (this.sound.playing()) {
        requestAnimationFrame(() => {
          this.updateProgress();
        });
      }
    },
    updatePosition() {
      this.seek = formatTime(this.sound.seek());
      this.duration = formatTime(this.sound.duration());
      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`;
    },
    updateSeek(payload) {
      if (!this.sound.playing) return;

      const { x, width } = payload.currentTarget.getBoundingClientRect();

      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;

      this.sound.seek(seconds);

      this.sound.once('seek', () => {
        this.updateProgress();
      });
    },
  },
});
