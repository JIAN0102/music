<script setup>
import {
  reactive, onMounted, onUnmounted, ref,
} from 'vue';
import { songsCollection } from '@/includes/firebase';
import {
  query, orderBy, startAfter, limit, doc, getDoc, getDocs,
} from 'firebase/firestore';
import SongItem from '@/components/SongItem.vue';

const songs = reactive([]);
const maxPerPage = ref(10);
const pendingRequest = ref(false);

const getSongs = async () => {
  if (pendingRequest.value) return;

  pendingRequest.value = true;

  let snapshots;

  if (songs.length) {
    const lastDoc = await getDoc(doc(songsCollection, songs[songs.length - 1].docID));
    const q = query(
      songsCollection,
      orderBy('modifiedName'),
      startAfter(lastDoc),
      limit(maxPerPage.value),
    );
    snapshots = await getDocs(q);
  } else {
    const q = query(
      songsCollection,
      orderBy('modifiedName'),
      limit(maxPerPage.value),
    );
    snapshots = await getDocs(q);
  }

  snapshots.forEach((document) => {
    songs.push({
      ...document.data(),
      docID: document.id,
    });
  });

  pendingRequest.value = false;
};

const handleScroll = () => {
  const { scrollTop, offsetHeight } = document.documentElement;
  const { innerHeight } = window;
  const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

  if (bottomOfWindow) {
    getSongs();
  }
};

onMounted(() => {
  getSongs();

  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <main>
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      />
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">
            Listen to Great Music!
          </h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Phasellus et dolor mollis, congue augue non, venenatis elit.
            Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
            sapien. Duis sed magna pulvinar, fringilla lorem eget,
            ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="assets/img/introduction-music.png"
        alt=""
      >
    </section>

    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">Songs</span>
          <i class="fa fa-headphones-alt float-right text-green-400 text-xl" />
        </div>
        <ol id="playlist">
          <SongItem
            v-for="song in songs"
            :key="song.docID"
            :song="song"
          />
        </ol>
      </div>
    </section>
  </main>
</template>
