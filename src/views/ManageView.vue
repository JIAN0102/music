<script setup>
import { ref, reactive, onMounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { auth, songsCollection } from '@/includes/firebase';
import { query, where, getDocs } from 'firebase/firestore';
import UploadSong from '@/components/UploadSong.vue';
import SongModify from '@/components/SongModify.vue';

const songs = reactive([]);
const unsavedFlag = ref(false);

onBeforeRouteLeave((to, from, next) => {
  if (!unsavedFlag.value) {
    next();
  } else {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const leave = confirm('有未修改的資料，確定要離開嗎?');
    next(leave);
  }
});

const uploadSong = (doc) => {
  const song = {
    ...doc.data(),
    docID: doc.id,
  };

  songs.push(song);
};

const editSong = (index, { modifiedName, genre }) => {
  songs[index].modifiedName = modifiedName;
  songs[index].genre = genre;
};

const deleteSong = (index) => {
  songs.splice(index, 1);
};

const updateUnsavedFlag = (value) => {
  unsavedFlag.value = value;
};

onMounted(async () => {
  const q = query(
    songsCollection,
    where('uid', '==', auth.currentUser.uid),
  );
  const snapshot = await getDocs(q);

  snapshot.forEach(uploadSong);
});
</script>

<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <UploadSong @upload-song="uploadSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl" />
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <SongModify
              v-for="(song, index) in songs"
              :key="song.docID"
              :song="song"
              :index="index"
              @edit-song="editSong"
              @delete-song="deleteSong"
              @update-unsaved-flag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Player -->
  <div class="fixed bottom-0 left-0 bg-white p-5 pb-4 text-left align-top w-full h-16">
    <div class="relative">
      <!-- Play/Pause Button -->
      <div class="float-left w-7 h-7 leading-3">
        <button type="button">
          <i class="fa fa-play text-gray-500 text-xl" />
        </button>
      </div>
      <!-- Current Position -->
      <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-5 mt-1">
        <span class="player-currenttime">00:00</span>
      </div>
      <!-- Scrub -->
      <div class="float-left w-7 h-7 leading-3 ml-7 mt-2 player-scrub">
        <div class="absolute left-0 right-0 text-lg text-center mx-auto player-song-info">
          <span class="song-title">Song Title</span> by
          <span class="song-artist">Artist</span>
        </div>
        <span class="block w-full h-2 rounded m-1 mt-2 bg-gray-200 relative cursor-pointer">
          <span
            class="absolute top-neg-8 text-gray-800 text-lg"
            style="left: 50%;"
          >
            <i class="fas fa-circle" />
          </span>
          <span
            class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            style="width: 50%;"
          />
        </span>
      </div>
      <!-- Duration -->
      <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-8 mt-1">
        <span class="player-duration">03:06</span>
      </div>
    </div>
  </div>
</template>
