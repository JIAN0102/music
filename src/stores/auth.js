import { defineStore } from 'pinia';
import { auth, usersCollection } from '@/includes/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authModalShow: false,
    isLoggedIn: false,
  }),
  actions: {
    toggleAuthModal() {
      this.authModalShow = !this.authModalShow;
    },
    toggleAuth() {
      this.isLoggedIn = !this.isLoggedIn;
    },
    async login({ email, password }) {
      await signInWithEmailAndPassword(auth, email, password);

      this.toggleAuth();
    },
    async logout() {
      await signOut(auth);

      this.toggleAuth();
    },
    initLogin() {
      const user = auth.currentUser;

      if (user) {
        this.toggleAuth();
      }
    },
    async register({
      name, email, password, age, country,
    }) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const docUsersCollection = doc(usersCollection, userCredential.user.uid);

      await setDoc(docUsersCollection, {
        name, email, age, country,
      });

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      this.toggleAuth();
    },
  },
});
