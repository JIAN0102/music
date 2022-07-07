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

const uploadSong = (document) => {
  const song = {
    ...document.data(),
    docID: document.id,
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
  const snapshots = await getDocs(q);

  snapshots.forEach(uploadSong);
});
</script>

<template>
  <main>
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
  </main>
</template>
