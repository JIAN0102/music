<script setup>
import { ref, reactive } from 'vue';
import { storage, songsCollection } from '@/includes/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';

const props = defineProps({
  song: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['edit-song', 'delete-song']);

const showEditForm = ref(false);
const schema = reactive({
  modifiedName: 'required',
  genre: 'alpha_spaces',
});
const editSongInSubmission = ref(false);
const editSongShowAlert = ref(false);
const editSongAlertVariant = ref('bg-blue-500');
const editSongAlertMessage = ref('更新資料中，請燒等');

const editSong = async (values) => {
  editSongInSubmission.value = true;
  editSongShowAlert.value = true;
  editSongAlertVariant.value = 'bg-blue-500';
  editSongAlertMessage.value = '更新資料中，請燒等';

  const docSongsCollection = doc(songsCollection, props.song.docID);

  try {
    await updateDoc(docSongsCollection, values);
  } catch (error) {
    console.log(error);
    editSongInSubmission.value = false;
    editSongAlertVariant.value = 'bg-red-500';
    editSongAlertMessage.value = '發生錯誤，請稍後再試';
  }

  emit('edit-song', props.index, values);

  editSongInSubmission.value = false;
  editSongAlertVariant.value = 'bg-green-500';
  editSongAlertMessage.value = '修改完成';
};

const deleteSong = async () => {
  const songRef = storageRef(storage, `songs/${props.song.originalName}`);

  await deleteObject(songRef);

  await deleteDoc(doc(songsCollection, props.song.docID));

  emit('delete-song', props.index);
};
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showEditForm">
      <h4 class="inline-block text-2xl font-bold">
        {{ song.modifiedName }}
      </h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times" />
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showEditForm = !showEditForm"
      >
        <i class="fa fa-pencil-alt" />
      </button>
    </div>
    <div v-show="showEditForm">
      <div
        v-if="editSongShowAlert"
        class="mb-4 p-5 font-bold text-white text-center"
        :class="editSongAlertVariant"
      >
        {{ editSongAlertMessage }}
      </div>
      <VForm
        :validation-schema="schema"
        :initial-values="song"
        @submit="editSong"
      >
        <div class="mb-3">
          <label
            class="inline-block mb-2"
            for="modifiedName"
          >Song Title</label>
          <VField
            id="modifiedName"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300transition duration-500 focus:outline-none focus:border-black rounded"
            type="text"
            placeholder="Enter Song Title"
            name="modifiedName"
          />
          <ErrorMessage
            class="text-red-600"
            name="modifiedName"
          />
        </div>
        <div class="mb-3">
          <label
            class="inline-block mb-2"
            for="genre"
          >Genre</label>
          <VField
            id="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300transition duration-500 focus:outline-none focus:border-black rounded"
            type="text"
            placeholder="Enter Genre"
            name="genre"
          />
          <ErrorMessage
            class="text-red-600"
            name="genre"
          />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="editSongInSubmission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 ml-2 rounded text-white bg-gray-600"
          :disabled="editSongInSubmission"
          @click.prevent="showEditForm = false"
        >
          Go Back
        </button>
      </VForm>
    </div>
  </div>
</template>
