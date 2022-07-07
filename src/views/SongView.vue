<script setup>
import {
  ref, reactive, computed, watch, onMounted,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { auth, songsCollection, commentsCollection } from '@/includes/firebase';
import {
  query, where, doc, addDoc, getDoc, getDocs, updateDoc,
} from 'firebase/firestore';
import { useAuthStore } from '@/stores/auth';
import { useSongStore } from '@/stores/song';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const songStore = useSongStore();
const { isLoggedIn } = storeToRefs(authStore);
const { currentSong, isSongPlaying } = storeToRefs(songStore);
const { createSong } = songStore;

const song = ref({});
const schema = reactive({
  comment: 'required|min:3',
});
const comments = ref([]);
const commentInSubmission = ref(false);
const commentShowAlert = ref(false);
const commentAlertVariant = ref('bg-blue-500');
const commentAlertMessage = ref('發送評論中，請稍後');
const commentsSort = ref('1');

const sortedComments = computed(() => comments.value.slice().sort((a, b) => {
  if (commentsSort.value === '1') {
    return new Date(b.datePosted) - new Date(a.datePosted);
  }
  return new Date(a.datePosted) - new Date(b.datePosted);
}));

const getComments = async () => {
  const q = query(commentsCollection, where('songID', '==', route.params.id));
  const snapshots = await getDocs(q);

  comments.value = [];

  snapshots.forEach((document) => {
    comments.value.push({
      docID: document.id,
      ...document.data(),
    });
  });
};

const sendComment = async (values, { resetForm }) => {
  commentInSubmission.value = true;
  commentShowAlert.value = true;
  commentAlertVariant.value = 'bg-blue-500';
  commentAlertMessage.value = ref('發送評論中，請稍後');

  const comment = {
    content: values.comment,
    datePosted: new Date().toString(),
    songID: route.params.id,
    name: auth.currentUser.displayName,
    uid: auth.currentUser.uid,
  };

  await addDoc(commentsCollection, comment);

  song.value.commentCount += 1;

  await updateDoc(doc(songsCollection, route.params.id), {
    commentCount: song.value.commentCount,
  });

  getComments();

  commentInSubmission.value = false;
  commentAlertVariant.value = 'bg-green-500';
  commentAlertMessage.value = ref('評論發送成功');

  resetForm();
};

watch(commentsSort, (newVal) => {
  if (newVal === route.query.sort) return;

  router.push({
    query: {
      sort: newVal,
    },
  });
});

onMounted(async () => {
  const snapshot = await getDoc(doc(songsCollection, route.params.id));

  if (!snapshot.exists()) {
    router.push({
      name: 'home',
    });
    return;
  }

  const { sort } = route.query;
  commentsSort.value = sort === '1' || sort === '2' ? sort : '1';

  song.value = snapshot.data();
  getComments();
});
</script>

<template>
  <main>
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      />
      <div class="container mx-auto flex items-center">
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none"
          :class="{
            'animate-spin': isSongPlaying && song.url === currentSong.url
          }"
          @click.prevent="createSong(song)"
        >
          <i class="fas fa-play" />
        </button>
        <div class="z-50 text-left ml-8">
          <div class="text-3xl font-bold">
            {{ song.modifiedName }}
          </div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <section
      id="comments"
      class="container mx-auto mt-6"
    >
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">Comments ({{ song.commentCount }})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl" />
        </div>
        <div class="p-6">
          <div
            v-if="commentShowAlert"
            class="mb-4 p-5 font-bold text-white text-center"
            :class="commentAlertVariant"
          >
            {{ commentAlertMessage }}
          </div>
          <VForm
            v-if="isLoggedIn"
            :validation-schema="schema"
            @submit="sendComment"
          >
            <VField
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
              as="textarea"
              name="comment"
            />
            <ErrorMessage
              class="text-red-600"
              name="comment"
            />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="commentInSubmission"
            >
              Submit
            </button>
          </VForm>
          <p v-else>
            登入會員發送評論吧
          </p>
          <select
            v-model="commentsSort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">
              Latest
            </option>
            <option value="2">
              Oldest
            </option>
          </select>
        </div>
      </div>
    </section>
    <ul class="container mx-auto">
      <li
        v-for="comment in sortedComments"
        :key="comment.docID"
        class="p-6 bg-gray-50 border border-gray-200"
      >
        <div class="mb-5">
          <div class="font-bold">
            {{ comment.name }}
          </div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>
