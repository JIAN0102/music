<script setup>
import { ref, reactive, onUnmounted } from 'vue';
import { auth, storage, songsCollection } from '@/includes/firebase';
import { addDoc } from 'firebase/firestore';
import {
  ref as storageRef, uploadBytesResumable, getDownloadURL,
} from 'firebase/storage';

const isDragOver = ref(false);
const uploads = reactive([]);

const uploadFile = ($event) => {
  isDragOver.value = false;

  const files = $event.dataTransfer
    ? [...$event.dataTransfer.files]
    : [...$event.target.files];

  files.forEach((file) => {
    if (file.type !== 'audio/mpeg') return;

    const songsRef = storageRef(storage, `songs/${file.name}`);
    const uploadTask = uploadBytesResumable(songsRef, file);

    const uploadIndex = uploads.push({
      uploadTask,
      currentProgress: 0,
      name: file.name,
      variant: 'bg-blue-400',
      icon: 'fas fa-spinner fa-spin',
      textClass: '',
    }) - 1;

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploads[uploadIndex].currentProgress = progress;
      },
      (error) => {
        uploads[uploadIndex].variant = 'bg-red-400';
        uploads[uploadIndex].icon = 'fas fa-times';
        uploads[uploadIndex].textClass = 'text-red-400';
        console.log(error);
      },
      async () => {
        const song = {
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName,
          originalName: uploadTask.snapshot.ref.name,
          modifiedName: uploadTask.snapshot.ref.name,
          genre: '',
          commentCount: 0,
        };

        song.url = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(songsCollection, song);
        // await getDoc()

        uploads[uploadIndex].variant = 'bg-green-400';
        uploads[uploadIndex].icon = 'fas fa-check';
        uploads[uploadIndex].textClass = 'text-green-400';
      },
    );
  });
};

onUnmounted(() => {
  uploads.forEach((upload) => {
    upload.uploadTask.cancel();
  });
});
</script>

<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl" />
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'text-white bg-green-400 border-green-400 border-solid': isDragOver }"
        @dragend.prevent.stop="isDragOver = false"
        @dragover.prevent.stop="isDragOver = true"
        @dragenter.prevent.stop="isDragOver = true"
        @dragleave.prevent.stop="isDragOver = false"
        @drop.prevent.stop="uploadFile($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input
        type="file"
        multiple
        @change="uploadFile($event)"
      >
      <hr class="my-6">
      <!-- Progess Bars -->
      <div
        v-for="upload in uploads"
        :key="upload.name"
        class="mb-4"
      >
        <!-- File Name -->
        <div
          class="font-bold text-sm"
          :class="upload.textClass"
        >
          <i :class="upload.icon" /> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: `${upload.currentProgress}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
