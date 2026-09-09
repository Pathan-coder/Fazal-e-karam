// Save current page state
window.addEventListener("pagehide", () => {
  try {
    sessionStorage.setItem(
      "aazanScrollY",
      window.scrollY.toString()
    );
  } catch (e) {}
});

// Restore page position
window.addEventListener("pageshow", () => {
  try {
    const scrollY = sessionStorage.getItem("aazanScrollY");

    if (scrollY !== null) {
      setTimeout(() => {
        window.scrollTo(0, Number(scrollY));
      }, 100);
    }
  } catch (e) {}
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";
import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
sendPasswordResetEmail,
GoogleAuthProvider,
signInWithRedirect,
signInWithPopup,
EmailAuthProvider,
linkWithCredential
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
  
import {
getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqrrsFXVqgVDGsO-JTZiKa2N8lzDBqkM0",
  authDomain: "fazal-e-karm.firebaseapp.com",
  projectId: "fazal-e-karm",
  storageBucket: "fazal-e-karm.firebasestorage.app",
  messagingSenderId: "768507616623",
  appId: "1:768507616623:web:c0a43a292762d814905c9a"
};
const PRAYERS = [
  "fajr",
  "juhar",
  "asr",
  "magrib",
  "esha"
];
const NAMAZ_DELAY = {
  fajr: 30,
  juhar: 15,
  asr: 15,
  magrib: 4,
  esha: 15
};




// ===============================
// PRAYER TIMETABLE → FIREBASE
// ===============================

const prayerTimetable = {

  // ===============================
// PRAYER TIMETABLE → FIREBASE
// ===============================

const prayerTimetable = {
  // --- JANUARY ---
  "01-01": { fajr: "6:25 AM", juhar: "1:30 PM", asr: "4:30 PM", magrib: "6:05 PM", esha: "7:30 PM" },
  "01-02": { fajr: "6:25 AM", juhar: "1:30 PM", asr: "4:30 PM", magrib: "6:06 PM", esha: "7:30 PM" },
  "01-03": { fajr: "6:25 AM", juhar: "1:30 PM", asr: "4:30 PM", magrib: "6:06 PM", esha: "7:30 PM" },
  "01-04": { fajr: "6:25 AM", juhar: "1:30 PM", asr: "4:31 PM", magrib: "6:07 PM", esha: "7:30 PM" },
  "01-05": { fajr: "6:25 AM", juhar: "1:30 PM", asr: "4:31 PM", magrib: "6:07 PM", esha: "7:31 PM" },
  "01-06": { fajr: "6:24 AM", juhar: "1:30 PM", asr: "4:32 PM", magrib: "6:08 PM", esha: "7:31 PM" },
  "01-07": { fajr: "6:24 AM", juhar: "1:30 PM", asr: "4:32 PM", magrib: "6:08 PM", esha: "7:31 PM" },
  "01-08": { fajr: "6:24 AM", juhar: "1:30 PM", asr: "4:33 PM", magrib: "6:09 PM", esha: "7:32 PM" },
  "01-09": { fajr: "6:24 AM", juhar: "1:30 PM", asr: "4:33 PM", magrib: "6:10 PM", esha: "7:32 PM" },
  "01-10": { fajr: "6:23 AM", juhar: "1:30 PM", asr: "4:34 PM", magrib: "6:10 PM", esha: "7:33 PM" },
  "01-11": { fajr: "6:23 AM", juhar: "1:30 PM", asr: "4:34 PM", magrib: "6:11 PM", esha: "7:33 PM" },
  "01-12": { fajr: "6:23 AM", juhar: "1:30 PM", asr: "4:35 PM", magrib: "6:12 PM", esha: "7:34 PM" },
  "01-13": { fajr: "6:22 AM", juhar: "1:30 PM", asr: "4:35 PM", magrib: "6:12 PM", esha: "7:34 PM" },
  "01-14": { fajr: "6:22 AM", juhar: "1:30 PM", asr: "4:36 PM", magrib: "6:13 PM", esha: "7:35 PM" },
  "01-15": { fajr: "6:21 AM", juhar: "1:30 PM", asr: "4:36 PM", magrib: "6:14 PM", esha: "7:35 PM" },
  "01-16": { fajr: "6:21 AM", juhar: "1:30 PM", asr: "4:37 PM", magrib: "6:14 PM", esha: "7:36 PM" },
  "01-17": { fajr: "6:20 AM", juhar: "1:30 PM", asr: "4:37 PM", magrib: "6:15 PM", esha: "7:36 PM" },
  "01-18": { fajr: "6:20 AM", juhar: "1:30 PM", asr: "4:38 PM", magrib: "6:16 PM", esha: "7:37 PM" },
  "01-19": { fajr: "6:19 AM", juhar: "1:30 PM", asr: "4:38 PM", magrib: "6:16 PM", esha: "7:37 PM" },
  "01-20": { fajr: "6:19 AM", juhar: "1:30 PM", asr: "4:39 PM", magrib: "6:17 PM", esha: "7:38 PM" },
  "01-21": { fajr: "6:18 AM", juhar: "1:30 PM", asr: "4:39 PM", magrib: "6:18 PM", esha: "7:38 PM" },
  "01-22": { fajr: "6:17 AM", juhar: "1:30 PM", asr: "4:40 PM", magrib: "6:18 PM", esha: "7:39 PM" },
  "01-23": { fajr: "6:17 AM", juhar: "1:30 PM", asr: "4:40 PM", magrib: "6:19 PM", esha: "7:39 PM" },
  "01-24": { fajr: "6:16 AM", juhar: "1:30 PM", asr: "4:41 PM", magrib: "6:20 PM", esha: "7:40 PM" },
  "01-25": { fajr: "6:15 AM", juhar: "1:30 PM", asr: "4:41 PM", magrib: "6:20 PM", esha: "7:40 PM" },
  "01-26": { fajr: "6:15 AM", juhar: "1:30 PM", asr: "4:42 PM", magrib: "6:21 PM", esha: "7:41 PM" },
  "01-27": { fajr: "6:14 AM", juhar: "1:30 PM", asr: "4:42 PM", magrib: "6:22 PM", esha: "7:41 PM" },
  "01-28": { fajr: "6:13 AM", juhar: "1:30 PM", asr: "4:43 PM", magrib: "6:22 PM", esha: "7:42 PM" },
  "01-29": { fajr: "6:12 AM", juhar: "1:30 PM", asr: "4:43 PM", magrib: "6:23 PM", esha: "7:42 PM" },
  "01-30": { fajr: "6:11 AM", juhar: "1:30 PM", asr: "4:44 PM", magrib: "6:24 PM", esha: "7:43 PM" },
  "01-31": { fajr: "6:11 AM", juhar: "1:30 PM", asr: "4:44 PM", magrib: "6:24 PM", esha: "7:43 PM" },

  // --- FEBRUARY ---
  "02-01": { fajr: "6:10 AM", juhar: "1:30 PM", asr: "4:45 PM", magrib: "6:25 PM", esha: "7:44 PM" },
  "02-02": { fajr: "6:09 AM", juhar: "1:30 PM", asr: "4:45 PM", magrib: "6:26 PM", esha: "7:44 PM" },
  "02-03": { fajr: "6:08 AM", juhar: "1:30 PM", asr: "4:46 PM", magrib: "6:26 PM", esha: "7:45 PM" },
  "02-04": { fajr: "6:07 AM", juhar: "1:30 PM", asr: "4:46 PM", magrib: "6:27 PM", esha: "7:45 PM" },
  "02-05": { fajr: "6:06 AM", juhar: "1:30 PM", asr: "4:47 PM", magrib: "6:28 PM", esha: "7:46 PM" },
  "02-06": { fajr: "6:05 AM", juhar: "1:30 PM", asr: "4:47 PM", magrib: "6:28 PM", esha: "7:46 PM" },
  "02-07": { fajr: "6:04 AM", juhar: "1:30 PM", asr: "4:48 PM", magrib: "6:29 PM", esha: "7:47 PM" },
  "02-08": { fajr: "6:03 AM", juhar: "1:30 PM", asr: "4:48 PM", magrib: "6:30 PM", esha: "7:47 PM" },
  "02-09": { fajr: "6:02 AM", juhar: "1:30 PM", asr: "4:49 PM", magrib: "6:30 PM", esha: "7:48 PM" },
  "02-10": { fajr: "6:01 AM", juhar: "1:30 PM", asr: "4:49 PM", magrib: "6:31 PM", esha: "7:48 PM" },
  "02-11": { fajr: "6:00 AM", juhar: "1:30 PM", asr: "4:50 PM", magrib: "6:31 PM", esha: "7:49 PM" },
  "02-12": { fajr: "5:59 AM", juhar: "1:30 PM", asr: "4:50 PM", magrib: "6:32 PM", esha: "7:49 PM" },
  "02-13": { fajr: "5:58 AM", juhar: "1:30 PM", asr: "4:51 PM", magrib: "6:33 PM", esha: "7:50 PM" },
  "02-14": { fajr: "5:57 AM", juhar: "1:30 PM", asr: "4:51 PM", magrib: "6:33 PM", esha: "7:50 PM" },
  "02-15": { fajr: "5:56 AM", juhar: "1:30 PM", asr: "4:52 PM", magrib: "6:34 PM", esha: "7:51 PM" },
  "02-16": { fajr: "5:55 AM", juhar: "1:30 PM", asr: "4:52 PM", magrib: "6:34 PM", esha: "7:51 PM" },
  "02-17": { fajr: "5:54 AM", juhar: "1:30 PM", asr: "4:53 PM", magrib: "6:35 PM", esha: "7:52 PM" },
  "02-18": { fajr: "5:53 AM", juhar: "1:30 PM", asr: "4:53 PM", magrib: "6:36 PM", esha: "7:52 PM" },
  "02-19": { fajr: "5:52 AM", juhar: "1:30 PM", asr: "4:54 PM", magrib: "6:36 PM", esha: "7:53 PM" },
  "02-20": { fajr: "5:51 AM", juhar: "1:30 PM", asr: "4:54 PM", magrib: "6:37 PM", esha: "7:53 PM" },
  "02-21": { fajr: "5:50 AM", juhar: "1:30 PM", asr: "4:55 PM", magrib: "6:37 PM", esha: "7:54 PM" },
  "02-22": { fajr: "5:49 AM", juhar: "1:30 PM", asr: "4:55 PM", magrib: "6:38 PM", esha: "7:54 PM" },
  "02-23": { fajr: "5:48 AM", juhar: "1:30 PM", asr: "4:56 PM", magrib: "6:39 PM", esha: "7:55 PM" },
  "02-24": { fajr: "5:47 AM", juhar: "1:30 PM", asr: "4:56 PM", magrib: "6:39 PM", esha: "7:55 PM" },
  "02-25": { fajr: "5:46 AM", juhar: "1:30 PM", asr: "4:57 PM", magrib: "6:40 PM", esha: "7:56 PM" },
  "02-26": { fajr: "5:45 AM", juhar: "1:30 PM", asr: "4:57 PM", magrib: "6:40 PM", esha: "7:56 PM" },
  "02-27": { fajr: "5:44 AM", juhar: "1:30 PM", asr: "4:58 PM", magrib: "6:41 PM", esha: "7:57 PM" },
  "02-28": { fajr: "5:43 AM", juhar: "1:30 PM", asr: "4:58 PM", magrib: "6:41 PM", esha: "7:57 PM" },

  // --- MARCH ---
  "03-01": { fajr: "5:42 AM", juhar: "1:30 PM", asr: "4:59 PM", magrib: "6:42 PM", esha: "7:58 PM" },
  "03-02": { fajr: "5:41 AM", juhar: "1:30 PM", asr: "4:59 PM", magrib: "6:43 PM", esha: "7:58 PM" },
  "03-03": { fajr: "5:40 AM", juhar: "1:30 PM", asr: "5:00 PM", magrib: "6:43 PM", esha: "7:59 PM" },
  "03-04": { fajr: "5:38 AM", juhar: "1:30 PM", asr: "5:00 PM", magrib: "6:44 PM", esha: "7:59 PM" },
  "03-05": { fajr: "5:37 AM", juhar: "1:30 PM", asr: "5:01 PM", magrib: "6:44 PM", esha: "8:00 PM" },
  "03-06": { fajr: "5:36 AM", juhar: "1:30 PM", asr: "5:01 PM", magrib: "6:45 PM", esha: "8:00 PM" },
  "03-07": { fajr: "5:35 AM", juhar: "1:30 PM", asr: "5:02 PM", magrib: "6:45 PM", esha: "8:01 PM" },
  "03-08": { fajr: "5:34 AM", juhar: "1:30 PM", asr: "5:02 PM", magrib: "6:46 PM", esha: "8:01 PM" },
  "03-09": { fajr: "5:33 AM", juhar: "1:30 PM", asr: "5:03 PM", magrib: "6:46 PM", esha: "8:02 PM" },
  "03-10": { fajr: "5:31 AM", juhar: "1:30 PM", asr: "5:03 PM", magrib: "6:47 PM", esha: "8:02 PM" },
  "03-11": { fajr: "5:30 AM", juhar: "1:30 PM", asr: "5:04 PM", magrib: "6:48 PM", esha: "8:03 PM" },
  "03-12": { fajr: "5:29 AM", juhar: "1:30 PM", asr: "5:04 PM", magrib: "6:48 PM", esha: "8:03 PM" },
  "03-13": { fajr: "5:28 AM", juhar: "1:30 PM", asr: "5:05 PM", magrib: "6:49 PM", esha: "8:04 PM" },
  "03-14": { fajr: "5:26 AM", juhar: "1:30 PM", asr: "5:05 PM", magrib: "6:49 PM", esha: "8:04 PM" },
  "03-15": { fajr: "5:25 AM", juhar: "1:30 PM", asr: "5:06 PM", magrib: "6:50 PM", esha: "8:05 PM" },
  "03-16": { fajr: "5:24 AM", juhar: "1:30 PM", asr: "5:06 PM", magrib: "6:50 PM", esha: "8:05 PM" },
  "03-17": { fajr: "5:22 AM", juhar: "1:30 PM", asr: "5:07 PM", magrib: "6:51 PM", esha: "8:06 PM" },
  "03-18": { fajr: "5:21 AM", juhar: "1:30 PM", asr: "5:07 PM", magrib: "6:51 PM", esha: "8:06 PM" },
  "03-19": { fajr: "5:20 AM", juhar: "1:30 PM", asr: "5:08 PM", magrib: "6:52 PM", esha: "8:07 PM" },
  "03-20": { fajr: "5:18 AM", juhar: "1:30 PM", asr: "5:08 PM", magrib: "6:52 PM", esha: "8:07 PM" },
  "03-21": { fajr: "5:17 AM", juhar: "1:30 PM", asr: "5:09 PM", magrib: "6:53 PM", esha: "8:08 PM" },
  "03-22": { fajr: "5:16 AM", juhar: "1:30 PM", asr: "5:09 PM", magrib: "6:54 PM", esha: "8:08 PM" },
  "03-23": { fajr: "5:14 AM", juhar: "1:30 PM", asr: "5:10 PM", magrib: "6:54 PM", esha: "8:09 PM" },
  "03-24": { fajr: "5:13 AM", juhar: "1:30 PM", asr: "5:10 PM", magrib: "6:55 PM", esha: "8:09 PM" },
  "03-25": { fajr: "5:12 AM", juhar: "1:30 PM", asr: "5:11 PM", magrib: "6:55 PM", esha: "8:10 PM" },
  "03-26": { fajr: "5:10 AM", juhar: "1:30 PM", asr: "5:11 PM", magrib: "6:56 PM", esha: "8:10 PM" },
  "03-27": { fajr: "5:09 AM", juhar: "1:30 PM", asr: "5:12 PM", magrib: "6:56 PM", esha: "8:11 PM" },
  "03-28": { fajr: "5:08 AM", juhar: "1:30 PM", asr: "5:12 PM", magrib: "6:57 PM", esha: "8:11 PM" },
  "03-29": { fajr: "5:06 AM", juhar: "1:30 PM", asr: "5:13 PM", magrib: "6:57 PM", esha: "8:12 PM" },
  "03-30": { fajr: "5:05 AM", juhar: "1:30 PM", asr: "5:13 PM", magrib: "6:58 PM", esha: "8:12 PM" },
  "03-31": { fajr: "5:04 AM", juhar: "1:30 PM", asr: "5:14 PM", magrib: "6:58 PM", esha: "8:13 PM" },

  // --- APRIL ---
  "04-01": { fajr: "5:02 AM", juhar: "1:30 PM", asr: "5:14 PM", magrib: "6:59 PM", esha: "8:13 PM" },
  "04-02": { fajr: "5:01 AM", juhar: "1:30 PM", asr: "5:15 PM", magrib: "6:59 PM", esha: "8:14 PM" },
  "04-03": { fajr: "5:00 AM", juhar: "1:30 PM", asr: "5:15 PM", magrib: "7:00 PM", esha: "8:14 PM" },
  "04-04": { fajr: "4:58 AM", juhar: "1:30 PM", asr: "5:16 PM", magrib: "7:01 PM", esha: "8:15 PM" },
  "04-05": { fajr: "4:57 AM", juhar: "1:30 PM", asr: "5:16 PM", magrib: "7:01 PM", esha: "8:15 PM" },
  "04-06": { fajr: "4:56 AM", juhar: "1:30 PM", asr: "5:17 PM", magrib: "7:02 PM", esha: "8:16 PM" },
  "04-07": { fajr: "4:54 AM", juhar: "1:30 PM", asr: "5:17 PM", magrib: "7:02 PM", esha: "8:16 PM" },
  "04-08": { fajr: "4:53 AM", juhar: "1:30 PM", asr: "5:18 PM", magrib: "7:03 PM", esha: "8:17 PM" },
  "04-09": { fajr: "4:52 AM", juhar: "1:30 PM", asr: "5:18 PM", magrib: "7:03 PM", esha: "8:17 PM" },
  "04-10": { fajr: "4:50 AM", juhar: "1:30 PM", asr: "5:19 PM", magrib: "7:04 PM", esha: "8:18 PM" },
  "04-11": { fajr: "4:49 AM", juhar: "1:30 PM", asr: "5:19 PM", magrib: "7:04 PM", esha: "8:18 PM" },
  "04-12": { fajr: "4:48 AM", juhar: "1:30 PM", asr: "5:20 PM", magrib: "7:05 PM", esha: "8:19 PM" },
  "04-13": { fajr: "4:46 AM", juhar: "1:30 PM", asr: "5:20 PM", magrib: "7:06 PM", esha: "8:19 PM" },
  "04-14": { fajr: "4:45 AM", juhar: "1:30 PM", asr: "5:21 PM", magrib: "7:06 PM", esha: "8:20 PM" },
  "04-15": { fajr: "4:44 AM", juhar: "1:30 PM", asr: "5:21 PM", magrib: "7:07 PM", esha: "8:20 PM" },
  "04-16": { fajr: "4:43 AM", juhar: "1:30 PM", asr: "5:22 PM", magrib: "7:07 PM", esha: "8:21 PM" },
  "04-17": { fajr: "4:41 AM", juhar: "1:30 PM", asr: "5:22 PM", magrib: "7:08 PM", esha: "8:21 PM" },
  "04-18": { fajr: "4:40 AM", juhar: "1:30 PM", asr: "5:23 PM", magrib: "7:08 PM", esha: "8:22 PM" },
  "04-19": { fajr: "4:39 AM", juhar: "1:30 PM", asr: "5:23 PM", magrib: "7:09 PM", esha: "8:22 PM" },
  "04-20": { fajr: "4:38 AM", juhar: "1:30 PM", asr: "5:24 PM", magrib: "7:09 PM", esha: "8:23 PM" },
  "04-21": { fajr: "4:36 AM", juhar: "1:30 PM", asr: "5:24 PM", magrib: "7:10 PM", esha: "8:24 PM" },
  "04-22": { fajr: "4:35 AM", juhar: "1:30 PM", asr: "5:25 PM", magrib: "7:11 PM", esha: "8:24 PM" },
  "04-23": { fajr: "4:34 AM", juhar: "1:30 PM", asr: "5:25 PM", magrib: "7:11 PM", esha: "8:25 PM" },
  "04-24": { fajr: "4:33 AM", juhar: "1:30 PM", asr: "5:26 PM", magrib: "7:12 PM", esha: "8:25 PM" },
  "04-25": { fajr: "4:32 AM", juhar: "1:30 PM", asr: "5:26 PM", magrib: "7:12 PM", esha: "8:26 PM" },
  "04-26": { fajr: "4:31 AM", juhar: "1:30 PM", asr: "5:27 PM", magrib: "7:13 PM", esha: "8:26 PM" },
  "04-27": { fajr: "4:30 AM", juhar: "1:30 PM", asr: "5:27 PM", magrib: "7:13 PM", esha: "8:27 PM" },
  "04-28": { fajr: "4:28 AM", juhar: "1:30 PM", asr: "5:28 PM", magrib: "7:14 PM", esha: "8:27 PM" },
  "04-29": { fajr: "4:27 AM", juhar: "1:30 PM", asr: "5:28 PM", magrib: "7:15 PM", esha: "8:28 PM" },
  "04-30": { fajr: "4:26 AM", juhar: "1:30 PM", asr: "5:29 PM", magrib: "7:15 PM", esha: "8:29 PM" },

  // --- MAY ---
  "05-01": { fajr: "4:25 AM", juhar: "1:30 PM", asr: "5:29 PM", magrib: "7:16 PM", esha: "8:29 PM" },
  "05-02": { fajr: "4:24 AM", juhar: "1:30 PM", asr: "5:30 PM", magrib: "7:16 PM", esha: "8:30 PM" },
  "05-03": { fajr: "4:23 AM", juhar: "1:30 PM", asr: "5:30 PM", magrib: "7:17 PM", esha: "8:30 PM" },
  "05-04": { fajr: "4:22 AM", juhar: "1:30 PM", asr: "5:31 PM", magrib: "7:17 PM", esha: "8:31 PM" },
  "05-05": { fajr: "4:21 AM", juhar: "1:30 PM", asr: "5:31 PM", magrib: "7:18 PM", esha: "8:32 PM" },
  "05-06": { fajr: "4:20 AM", juhar: "1:30 PM", asr: "5:32 PM", magrib: "7:19 PM", esha: "8:32 PM" },
  "05-07": { fajr: "4:19 AM", juhar: "1:30 PM", asr: "5:32 PM", magrib: "7:19 PM", esha: "8:33 PM" },
  "05-08": { fajr: "4:18 AM", juhar: "1:30 PM", asr: "5:33 PM", magrib: "7:20 PM", esha: "8:33 PM" },
  "05-09": { fajr: "4:17 AM", juhar: "1:30 PM", asr: "5:33 PM", magrib: "7:20 PM", esha: "8:34 PM" },
  "05-10": { fajr: "4:16 AM", juhar: "1:30 PM", asr: "5:34 PM", magrib: "7:21 PM", esha: "8:35 PM" },
  "05-11": { fajr: "4:16 AM", juhar: "1:30 PM", asr: "5:34 PM", magrib: "7:21 PM", esha: "8:35 PM" },
  "05-12": { fajr: "4:15 AM", juhar: "1:30 PM", asr: "5:35 PM", magrib: "7:22 PM", esha: "8:36 PM" },
  "05-13": { fajr: "4:14 AM", juhar: "1:30 PM", asr: "5:35 PM", magrib: "7:23 PM", esha: "8:36 PM" },
  "05-14": { fajr: "4:13 AM", juhar: "1:30 PM", asr: "5:36 PM", magrib: "7:23 PM", esha: "8:37 PM" },
  "05-15": { fajr: "4:12 AM", juhar: "1:30 PM", asr: "5:36 PM", magrib: "7:24 PM", esha: "8:38 PM" },
  "05-16": { fajr: "4:12 AM", juhar: "1:30 PM", asr: "5:37 PM", magrib: "7:24 PM", esha: "8:38 PM" },
  "05-17": { fajr: "4:11 AM", juhar: "1:30 PM", asr: "5:37 PM", magrib: "7:25 PM", esha: "8:39 PM" },
  "05-18": { fajr: "4:10 AM", juhar: "1:30 PM", asr: "5:38 PM", magrib: "7:25 PM", esha: "8:40 PM" },
  "05-19": { fajr: "4:10 AM", juhar: "1:30 PM", asr: "5:38 PM", magrib: "7:26 PM", esha: "8:40 PM" },
  "05-20": { fajr: "4:09 AM", juhar: "1:30 PM", asr: "5:39 PM", magrib: "7:26 PM", esha: "8:41 PM" },
  "05-21": { fajr: "4:08 AM", juhar: "1:30 PM", asr: "5:39 PM", magrib: "7:27 PM", esha: "8:42 PM" },
  "05-22": { fajr: "4:08 AM", juhar: "1:30 PM", asr: "5:40 PM", magrib: "7:28 PM", esha: "8:42 PM" },
  "05-23": { fajr: "4:07 AM", juhar: "1:30 PM", asr: "5:40 PM", magrib: "7:28 PM", esha: "8:43 PM" },
  "05-24": { fajr: "4:07 AM", juhar: "1:30 PM", asr: "5:41 PM", magrib: "7:29 PM", esha: "8:43 PM" },
  "05-25": { fajr: "4:06 AM", juhar: "1:30 PM", asr: "5:41 PM", magrib: "7:29 PM", esha: "8:44 PM" },
  "05-26": { fajr: "4:06 AM", juhar: "1:30 PM", asr: "5:42 PM", magrib: "7:30 PM", esha: "8:45 PM" },
  "05-27": { fajr: "4:05 AM", juhar: "1:30 PM", asr: "5:42 PM", magrib: "7:30 PM", esha: "8:45 PM" },
  "05-28": { fajr: "4:05 AM", juhar: "1:30 PM", asr: "5:43 PM", magrib: "7:31 PM", esha: "8:46 PM" },
  "05-29": { fajr: "4:05 AM", juhar: "1:30 PM", asr: "5:43 PM", magrib: "7:31 PM", esha: "8:46 PM" },
  "05-30": { fajr: "4:04 AM", juhar: "1:30 PM", asr: "5:44 PM", magrib: "7:32 PM", esha: "8:47 PM" },
  "05-31": { fajr: "4:04 AM", juhar: "1:30 PM", asr: "5:44 PM", magrib: "7:32 PM", esha: "8:48 PM" },

  // --- JUNE ---
  "06-01": { fajr: "4:04 AM", juhar: "1:30 PM", asr: "5:45 PM", magrib: "7:33 PM", esha: "8:48 PM" },
  "06-02": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:45 PM", magrib: "7:33 PM", esha: "8:49 PM" },
  "06-03": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:45 PM", magrib: "7:34 PM", esha: "8:49 PM" },
  "06-04": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:46 PM", magrib: "7:34 PM", esha: "8:50 PM" },
  "06-05": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:46 PM", magrib: "7:35 PM", esha: "8:50 PM" },
  "06-06": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:47 PM", magrib: "7:35 PM", esha: "8:51 PM" },
  "06-07": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:47 PM", magrib: "7:35 PM", esha: "8:51 PM" },
  "06-08": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:47 PM", magrib: "7:36 PM", esha: "8:52 PM" },
  "06-09": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:48 PM", magrib: "7:36 PM", esha: "8:52 PM" },
  "06-10": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:48 PM", magrib: "7:37 PM", esha: "8:53 PM" },
  "06-11": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:48 PM", magrib: "7:37 PM", esha: "8:53 PM" },
  "06-12": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:49 PM", magrib: "7:37 PM", esha: "8:54 PM" },
  "06-13": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:49 PM", magrib: "7:38 PM", esha: "8:54 PM" },
  "06-14": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:49 PM", magrib: "7:38 PM", esha: "8:54 PM" },
  "06-15": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:50 PM", magrib: "7:38 PM", esha: "8:55 PM" },
  "06-16": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:50 PM", magrib: "7:39 PM", esha: "8:55 PM" },
  "06-17": { fajr: "4:03 AM", juhar: "1:30 PM", asr: "5:50 PM", magrib: "7:39 PM", esha: "8:55 PM" },
  "06-18": { fajr: "4:04 AM", juhar: "1:30 PM", asr: "5:50 PM", magrib: "7:39 PM", esha: "8:55 PM" },
  "06-19": { fajr: "4:04 AM", juhar: "1:30 PM", asr: "5:51 PM", magrib: "7:39 PM", esha: "8:56 PM" },
  "06-20": { fajr: "4:04 AM", juhar: "1:30 PM", asr: "5:51 PM", magrib: "7:40 PM", esha: "8:56 PM" },
  "06-21": { fajr: "4:04 AM", juhar: "1:30 PM", asr: "5:51 PM", magrib: "7:40 PM", esha: "8:56 PM" },
  "06-22": { fajr: "4:05 AM", juhar: "1:30 PM", asr: "5:51 PM", magrib: "7:40 PM", esha: "8:56 PM" },
  "06-23": { fajr: "4:05 AM", juhar: "1:30 PM", asr: "5:51 PM", magrib: "7:40 PM", esha: "8:56 PM" },
  "06-24": { fajr: "4:05 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:40 PM", esha: "8:56 PM" },
  "06-25": { fajr: "4:06 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:40 PM", esha: "8:56 PM" },
  "06-26": { fajr: "4:06 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:40 PM", esha: "8:56 PM" },
  "06-27": { fajr: "4:07 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:40 PM", esha: "8:56 PM" },
  "06-28": { fajr: "4:07 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:40 PM", esha: "8:56 PM" },
  "06-29": { fajr: "4:08 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:40 PM", esha: "8:56 PM" },
  "06-30": { fajr: "4:08 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:40 PM", esha: "8:56 PM" },

  // --- JULY ---
  "07-01": { fajr: "4:09 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:40 PM", esha: "8:55 PM" },
  "07-02": { fajr: "4:09 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:40 PM", esha: "8:55 PM" },
  "07-03": { fajr: "4:10 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:40 PM", esha: "8:55 PM" },
  "07-04": { fajr: "4:11 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:40 PM", esha: "8:55 PM" },
  "07-05": { fajr: "4:11 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:40 PM", esha: "8:54 PM" },
  "07-06": { fajr: "4:12 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:40 PM", esha: "8:54 PM" },
  "07-07": { fajr: "4:13 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:39 PM", esha: "8:54 PM" },
  "07-08": { fajr: "4:13 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:39 PM", esha: "8:53 PM" },
  "07-09": { fajr: "4:14 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:39 PM", esha: "8:53 PM" },
  "07-10": { fajr: "4:15 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:39 PM", esha: "8:52 PM" },
  "07-11": { fajr: "4:16 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:38 PM", esha: "8:52 PM" },
  "07-12": { fajr: "4:16 AM", juhar: "1:30 PM", asr: "5:52 PM", magrib: "7:38 PM", esha: "8:51 PM" },
  "07-13": { fajr: "4:17 AM", juhar: "1:30 PM", asr: "5:51 PM", magrib: "7:38 PM", esha: "8:51 PM" },
  "07-14": { fajr: "4:18 AM", juhar: "1:30 PM", asr: "5:51 PM", magrib: "7:37 PM", esha: "8:50 PM" },
  "07-15": { fajr: "4:19 AM", juhar: "1:30 PM", asr: "5:51 PM", magrib: "7:37 PM", esha: "8:49 PM" },
  "07-16": { fajr: "4:20 AM", juhar: "1:30 PM", asr: "5:51 PM", magrib: "7:36 PM", esha: "8:49 PM" },
  "07-17": { fajr: "4:21 AM", juhar: "1:30 PM", asr: "5:50 PM", magrib: "7:36 PM", esha: "8:48 PM" },
  "07-18": { fajr: "4:21 AM", juhar: "1:30 PM", asr: "5:50 PM", magrib: "7:35 PM", esha: "8:47 PM" },
  "07-19": { fajr: "4:22 AM", juhar: "1:30 PM", asr: "5:50 PM", magrib: "7:35 PM", esha: "8:47 PM" },
  "07-20": { fajr: "4:23 AM", juhar: "1:30 PM", asr: "5:49 PM", magrib: "7:34 PM", esha: "8:46 PM" },
  "07-21": { fajr: "4:24 AM", juhar: "1:30 PM", asr: "5:49 PM", magrib: "7:34 PM", esha: "8:45 PM" },
  "07-22": { fajr: "4:25 AM", juhar: "1:30 PM", asr: "5:48 PM", magrib: "7:33 PM", esha: "8:44 PM" },
  "07-23": { fajr: "4:26 AM", juhar: "1:30 PM", asr: "5:48 PM", magrib: "7:33 PM", esha: "8:43 PM" },
  "07-24": { fajr: "4:27 AM", juhar: "1:30 PM", asr: "5:47 PM", magrib: "7:32 PM", esha: "8:42 PM" },
  "07-25": { fajr: "4:28 AM", juhar: "1:30 PM", asr: "5:47 PM", magrib: "7:31 PM", esha: "8:41 PM" },
  "07-26": { fajr: "4:29 AM", juhar: "1:30 PM", asr: "5:46 PM", magrib: "7:31 PM", esha: "8:40 PM" },
  "07-27": { fajr: "4:29 AM", juhar: "1:30 PM", asr: "5:46 PM", magrib: "7:30 PM", esha: "8:39 PM" },
  "07-28": { fajr: "4:30 AM", juhar: "1:30 PM", asr: "5:45 PM", magrib: "7:29 PM", esha: "8:38 PM" },
  "07-29": { fajr: "4:31 AM", juhar: "1:30 PM", asr: "5:45 PM", magrib: "7:28 PM", esha: "8:37 PM" },
  "07-30": { fajr: "4:32 AM", juhar: "1:30 PM", asr: "5:44 PM", magrib: "7:28 PM", esha: "8:36 PM" },
  "07-31": { fajr: "4:33 AM", juhar: "1:30 PM", asr: "5:43 PM", magrib: "7:27 PM", esha: "8:35 PM" },

  // --- AUGUST ---
  "08-01": { fajr: "4:34 AM", juhar: "1:30 PM", asr: "5:43 PM", magrib: "7:26 PM", esha: "8:34 PM" },
  "08-02": { fajr: "4:35 AM", juhar: "1:30 PM", asr: "5:42 PM", magrib: "7:25 PM", esha: "8:33 PM" },
  "08-03": { fajr: "4:36 AM", juhar: "1:30 PM", asr: "5:41 PM", magrib: "7:24 PM", esha: "8:32 PM" },
  "08-04": { fajr: "4:36 AM", juhar: "1:30 PM", asr: "5:41 PM", magrib: "7:23 PM", esha: "8:31 PM" },
  "08-05": { fajr: "4:37 AM", juhar: "1:30 PM", asr: "5:40 PM", magrib: "7:22 PM", esha: "8:30 PM" },
  "08-06": { fajr: "4:38 AM", juhar: "1:30 PM", asr: "5:39 PM", magrib: "7:21 PM", esha: "8:29 PM" },
  "08-07": { fajr: "4:39 AM", juhar: "1:30 PM", asr: "5:38 PM", magrib: "7:20 PM", esha: "8:28 PM" },
  "08-08": { fajr: "4:40 AM", juhar: "1:30 PM", asr: "5:38 PM", magrib: "7:19 PM", esha: "8:26 PM" },
  "08-09": { fajr: "4:41 AM", juhar: "1:30 PM", asr: "5:37 PM", magrib: "7:18 PM", esha: "8:25 PM" },
  "08-10": { fajr: "4:42 AM", juhar: "1:30 PM", asr: "5:36 PM", magrib: "7:17 PM", esha: "8:24 PM" },
  "08-11": { fajr: "4:42 AM", juhar: "1:30 PM", asr: "5:35 PM", magrib: "7:16 PM", esha: "8:23 PM" },
  "08-12": { fajr: "4:43 AM", juhar: "1:30 PM", asr: "5:34 PM", magrib: "7:15 PM", esha: "8:22 PM" },
  "08-13": { fajr: "4:44 AM", juhar: "1:30 PM", asr: "5:34 PM", magrib: "7:14 PM", esha: "8:21 PM" },
  "08-14": { fajr: "4:45 AM", juhar: "1:30 PM", asr: "5:33 PM", magrib: "7:13 PM", esha: "8:19 PM" },
  "08-15": { fajr: "4:46 AM", juhar: "1:30 PM", asr: "5:32 PM", magrib: "7:12 PM", esha: "8:18 PM" },
  "08-16": { fajr: "4:47 AM", juhar: "1:30 PM", asr: "5:31 PM", magrib: "7:11 PM", esha: "8:17 PM" },
  "08-17": { fajr: "4:47 AM", juhar: "1:30 PM", asr: "5:30 PM", magrib: "7:10 PM", esha: "8:15 PM" },
  "08-18": { fajr: "4:48 AM", juhar: "1:30 PM", asr: "5:29 PM", magrib: "7:09 PM", esha: "8:14 PM" },
  "08-19": { fajr: "4:49 AM", juhar: "1:30 PM", asr: "5:28 PM", magrib: "7:07 PM", esha: "8:13 PM" },
  "08-20": { fajr: "4:50 AM", juhar: "1:30 PM", asr: "5:27 PM", magrib: "7:06 PM", esha: "8:11 PM" },
  "08-21": { fajr: "4:50 AM", juhar: "1:30 PM", asr: "5:26 PM", magrib: "7:05 PM", esha: "8:10 PM" },
  "08-22": { fajr: "4:51 AM", juhar: "1:30 PM", asr: "5:25 PM", magrib: "7:04 PM", esha: "8:09 PM" },
  "08-23": { fajr: "4:52 AM", juhar: "1:30 PM", asr: "5:24 PM", magrib: "7:03 PM", esha: "8:07 PM" },
  "08-24": { fajr: "4:53 AM", juhar: "1:30 PM", asr: "5:23 PM", magrib: "7:01 PM", esha: "8:06 PM" },
  "08-25": { fajr: "4:53 AM", juhar: "1:30 PM", asr: "5:22 PM", magrib: "7:00 PM", esha: "8:04 PM" },
  "08-26": { fajr: "4:54 AM", juhar: "1:30 PM", asr: "5:21 PM", magrib: "6:59 PM", esha: "8:03 PM" },
  "08-27": { fajr: "4:55 AM", juhar: "1:30 PM", asr: "5:20 PM", magrib: "6:58 PM", esha: "8:02 PM" },
  "08-28": { fajr: "4:56 AM", juhar: "1:30 PM", asr: "5:19 PM", magrib: "6:56 PM", esha: "8:00 PM" },
  "08-29": { fajr: "4:56 AM", juhar: "1:30 PM", asr: "5:18 PM", magrib: "6:55 PM", esha: "7:59 PM" },
  "08-30": { fajr: "4:57 AM", juhar: "1:30 PM", asr: "5:17 PM", magrib: "6:54 PM", esha: "7:57 PM" },
  "08-31": { fajr: "4:58 AM", juhar: "1:30 PM", asr: "5:16 PM", magrib: "6:53 PM", esha: "7:56 PM" },

  // --- SEPTEMBER ---
  "09-01": { fajr: "4:58 AM", juhar: "1:30 PM", asr: "5:15 PM", magrib: "6:51 PM", esha: "7:54 PM" },
  "09-02": { fajr: "4:59 AM", juhar: "1:30 PM", asr: "5:14 PM", magrib: "6:50 PM", esha: "7:53 PM" },
  "09-03": { fajr: "5:00 AM", juhar: "1:30 PM", asr: "5:13 PM", magrib: "6:49 PM", esha: "7:51 PM" },
  "09-04": { fajr: "5:00 AM", juhar: "1:30 PM", asr: "5:11 PM", magrib: "6:47 PM", esha: "7:50 PM" },
  "09-05": { fajr: "5:01 AM", juhar: "1:30 PM", asr: "5:10 PM", magrib: "6:46 PM", esha: "7:48 PM" },
  "09-06": { fajr: "5:02 AM", juhar: "1:30 PM", asr: "5:09 PM", magrib: "6:45 PM", esha: "7:47 PM" },
  "09-07": { fajr: "5:02 AM", juhar: "1:30 PM", asr: "5:08 PM", magrib: "6:43 PM", esha: "7:45 PM" },
  "09-08": { fajr: "5:03 AM", juhar: "1:30 PM", asr: "5:07 PM", magrib: "6:42 PM", esha: "7:44 PM" },
  "09-09": { fajr: "5:04 AM", juhar: "1:30 PM", asr: "5:06 PM", magrib: "6:41 PM", esha: "7:42 PM" },
  "09-10": { fajr: "5:04 AM", juhar: "1:30 PM", asr: "5:04 PM", magrib: "6:39 PM", esha: "7:41 PM" },
  "09-11": { fajr: "5:05 AM", juhar: "1:30 PM", asr: "5:03 PM", magrib: "6:38 PM", esha: "7:39 PM" },
  "09-12": { fajr: "5:06 AM", juhar: "1:30 PM", asr: "5:02 PM", magrib: "6:37 PM", esha: "7:38 PM" },
  "09-13": { fajr: "5:06 AM", juhar: "1:30 PM", asr: "5:01 PM", magrib: "6:35 PM", esha: "7:36 PM" },
  "09-14": { fajr: "5:07 AM", juhar: "1:30 PM", asr: "5:00 PM", magrib: "6:34 PM", esha: "7:35 PM" },
  "09-15": { fajr: "5:07 AM", juhar: "1:30 PM", asr: "4:58 PM", magrib: "6:33 PM", esha: "7:33 PM" },
  "09-16": { fajr: "5:08 AM", juhar: "1:30 PM", asr: "4:57 PM", magrib: "6:31 PM", esha: "7:32 PM" },
  "09-17": { fajr: "5:09 AM", juhar: "1:30 PM", asr: "4:56 PM", magrib: "6:30 PM", esha: "7:30 PM" },
  "09-18": { fajr: "5:09 AM", juhar: "1:30 PM", asr: "4:55 PM", magrib: "6:29 PM", esha: "7:29 PM" },
  "09-19": { fajr: "5:10 AM", juhar: "1:30 PM", asr: "4:53 PM", magrib: "6:27 PM", esha: "7:28 PM" },
  "09-20": { fajr: "5:10 AM", juhar: "1:30 PM", asr: "4:52 PM", magrib: "6:26 PM", esha: "7:26 PM" },
  "09-21": { fajr: "5:11 AM", juhar: "1:30 PM", asr: "4:51 PM", magrib: "6:25 PM", esha: "7:25 PM" },
  "09-22": { fajr: "5:12 AM", juhar: "1:30 PM", asr: "4:50 PM", magrib: "6:23 PM", esha: "7:23 PM" },
  "09-23": { fajr: "5:12 AM", juhar: "1:30 PM", asr: "4:48 PM", magrib: "6:22 PM", esha: "7:22 PM" },
  "09-24": { fajr: "5:13 AM", juhar: "1:30 PM", asr: "4:47 PM", magrib: "6:21 PM", esha: "7:20 PM" },
  "09-25": { fajr: "5:13 AM", juhar: "1:30 PM", asr: "4:46 PM", magrib: "6:19 PM", esha: "7:19 PM" },
  "09-26": { fajr: "5:14 AM", juhar: "1:30 PM", asr: "4:45 PM", magrib: "6:18 PM", esha: "7:18 PM" },
  "09-27": { fajr: "5:14 AM", juhar: "1:30 PM", asr: "4:43 PM", magrib: "6:17 PM", esha: "7:16 PM" },
  "09-28": { fajr: "5:15 AM", juhar: "1:30 PM", asr: "4:42 PM", magrib: "6:15 PM", esha: "7:15 PM" },
  "09-29": { fajr: "5:16 AM", juhar: "1:30 PM", asr: "4:41 PM", magrib: "6:14 PM", esha: "7:14 PM" },
  "09-30": { fajr: "5:16 AM", juhar: "1:30 PM", asr: "4:40 PM", magrib: "6:13 PM", esha: "7:12 PM" },

  // --- OCTOBER ---
  "10-01": { fajr: "5:17 AM", juhar: "1:30 PM", asr: "4:38 PM", magrib: "6:12 PM", esha: "7:11 PM" },
  "10-02": { fajr: "5:17 AM", juhar: "1:30 PM", asr: "4:37 PM", magrib: "6:10 PM", esha: "7:10 PM" },
  "10-03": { fajr: "5:18 AM", juhar: "1:30 PM", asr: "4:36 PM", magrib: "6:09 PM", esha: "7:08 PM" },
  "10-04": { fajr: "5:18 AM", juhar: "1:30 PM", asr: "4:35 PM", magrib: "6:08 PM", esha: "7:07 PM" },
  "10-05": { fajr: "5:19 AM", juhar: "1:30 PM", asr: "4:34 PM", magrib: "6:07 PM", esha: "7:06 PM" },
  "10-06": { fajr: "5:19 AM", juhar: "1:30 PM", asr: "4:32 PM", magrib: "6:05 PM", esha: "7:05 PM" },
  "10-07": { fajr: "5:20 AM", juhar: "1:30 PM", asr: "4:31 PM", magrib: "6:04 PM", esha: "7:03 PM" },
  "10-08": { fajr: "5:21 AM", juhar: "1:30 PM", asr: "4:30 PM", magrib: "6:03 PM", esha: "7:02 PM" },
  "10-09": { fajr: "5:21 AM", juhar: "1:30 PM", asr: "4:29 PM", magrib: "6:02 PM", esha: "7:01 PM" },
  "10-10": { fajr: "5:22 AM", juhar: "1:30 PM", asr: "4:28 PM", magrib: "6:01 PM", esha: "7:00 PM" },
  "10-11": { fajr: "5:22 AM", juhar: "1:30 PM", asr: "4:27 PM", magrib: "6:00 PM", esha: "6:59 PM" },
  "10-12": { fajr: "5:23 AM", juhar: "1:30 PM", asr: "4:26 PM", magrib: "5:58 PM", esha: "6:58 PM" },
  "10-13": { fajr: "5:24 AM", juhar: "1:30 PM", asr: "4:25 PM", magrib: "5:57 PM", esha: "6:57 PM" },
  "10-14": { fajr: "5:24 AM", juhar: "1:30 PM", asr: "4:24 PM", magrib: "5:56 PM", esha: "6:56 PM" },
  "10-15": { fajr: "5:25 AM", juhar: "1:30 PM", asr: "4:23 PM", magrib: "5:55 PM", esha: "6:55 PM" },
  "10-16": { fajr: "5:25 AM", juhar: "1:30 PM", asr: "4:22 PM", magrib: "5:54 PM", esha: "6:54 PM" },
  "10-17": { fajr: "5:26 AM", juhar: "1:30 PM", asr: "4:21 PM", magrib: "5:53 PM", esha: "6:53 PM" },
  "10-18": { fajr: "5:27 AM", juhar: "1:30 PM", asr: "4:20 PM", magrib: "5:52 PM", esha: "6:52 PM" },
  "10-19": { fajr: "5:27 AM", juhar: "1:30 PM", asr: "4:19 PM", magrib: "5:51 PM", esha: "6:51 PM" },
  "10-20": { fajr: "5:28 AM", juhar: "1:30 PM", asr: "4:18 PM", magrib: "5:50 PM", esha: "6:50 PM" },
  "10-21": { fajr: "5:28 AM", juhar: "1:30 PM", asr: "4:17 PM", magrib: "5:49 PM", esha: "6:49 PM" },
  "10-22": { fajr: "5:29 AM", juhar: "1:30 PM", asr: "4:16 PM", magrib: "5:48 PM", esha: "6:48 PM" },
  "10-23": { fajr: "5:30 AM", juhar: "1:30 PM", asr: "4:15 PM", magrib: "5:47 PM", esha: "6:47 PM" },
  "10-24": { fajr: "5:30 AM", juhar: "1:30 PM", asr: "4:14 PM", magrib: "5:46 PM", esha: "6:47 PM" },
  "10-25": { fajr: "5:31 AM", juhar: "1:30 PM", asr: "4:13 PM", magrib: "5:45 PM", esha: "6:46 PM" },
  "10-26": { fajr: "5:32 AM", juhar: "1:30 PM", asr: "4:12 PM", magrib: "5:44 PM", esha: "6:45 PM" },
  "10-27": { fajr: "5:32 AM", juhar: "1:30 PM", asr: "4:11 PM", magrib: "5:43 PM", esha: "6:44 PM" },
  "10-28": { fajr: "5:33 AM", juhar: "1:30 PM", asr: "4:11 PM", magrib: "5:42 PM", esha: "6:44 PM" },
  "10-29": { fajr: "5:34 AM", juhar: "1:30 PM", asr: "4:10 PM", magrib: "5:42 PM", esha: "6:43 PM" },
  "10-30": { fajr: "5:34 AM", juhar: "1:30 PM", asr: "4:09 PM", magrib: "5:41 PM", esha: "6:42 PM" },
  "10-31": { fajr: "5:35 AM", juhar: "1:30 PM", asr: "4:08 PM", magrib: "5:40 PM", esha: "6:42 PM" },

  // --- NOVEMBER ---
  "11-01": { fajr: "5:36 AM", juhar: "1:30 PM", asr: "4:07 PM", magrib: "5:39 PM", esha: "6:41 PM" },
  "11-02": { fajr: "5:36 AM", juhar: "1:30 PM", asr: "4:07 PM", magrib: "5:39 PM", esha: "6:41 PM" },
  "11-03": { fajr: "5:37 AM", juhar: "1:30 PM", asr: "4:06 PM", magrib: "5:38 PM", esha: "6:40 PM" },
  "11-04": { fajr: "5:38 AM", juhar: "1:30 PM", asr: "4:05 PM", magrib: "5:37 PM", esha: "6:40 PM" },
  "11-05": { fajr: "5:38 AM", juhar: "1:30 PM", asr: "4:05 PM", magrib: "5:37 PM", esha: "6:39 PM" },
  "11-06": { fajr: "5:39 AM", juhar: "1:30 PM", asr: "4:04 PM", magrib: "5:36 PM", esha: "6:39 PM" },
  "11-07": { fajr: "5:40 AM", juhar: "1:30 PM", asr: "4:03 PM", magrib: "5:35 PM", esha: "6:38 PM" },
  "11-08": { fajr: "5:41 AM", juhar: "1:30 PM", asr: "4:03 PM", magrib: "5:35 PM", esha: "6:38 PM" },
  "11-09": { fajr: "5:41 AM", juhar: "1:30 PM", asr: "4:02 PM", magrib: "5:34 PM", esha: "6:37 PM" },
  "11-10": { fajr: "5:42 AM", juhar: "1:30 PM", asr: "4:02 PM", magrib: "5:34 PM", esha: "6:37 PM" },
  "11-11": { fajr: "5:43 AM", juhar: "1:30 PM", asr: "4:01 PM", magrib: "5:33 PM", esha: "6:37 PM" },
  "11-12": { fajr: "5:43 AM", juhar: "1:30 PM", asr: "4:01 PM", magrib: "5:33 PM", esha: "6:36 PM" },
  "11-13": { fajr: "5:44 AM", juhar: "1:30 PM", asr: "4:00 PM", magrib: "5:32 PM", esha: "6:36 PM" },
  "11-14": { fajr: "5:45 AM", juhar: "1:30 PM", asr: "4:00 PM", magrib: "5:32 PM", esha: "6:36 PM" },
  "11-15": { fajr: "5:46 AM", juhar: "1:30 PM", asr: "3:59 PM", magrib: "5:31 PM", esha: "6:35 PM" },
  "11-16": { fajr: "5:46 AM", juhar: "1:30 PM", asr: "3:59 PM", magrib: "5:31 PM", esha: "6:35 PM" },
  "11-17": { fajr: "5:47 AM", juhar: "1:30 PM", asr: "3:58 PM", magrib: "5:31 PM", esha: "6:35 PM" },
  "11-18": { fajr: "5:48 AM", juhar: "1:30 PM", asr: "3:58 PM", magrib: "5:30 PM", esha: "6:35 PM" },
  "11-19": { fajr: "5:49 AM", juhar: "1:30 PM", asr: "3:58 PM", magrib: "5:30 PM", esha: "6:35 PM" },
  "11-20": { fajr: "5:49 AM", juhar: "1:30 PM", asr: "3:57 PM", magrib: "5:30 PM", esha: "6:35 PM" },
  "11-21": { fajr: "5:50 AM", juhar: "1:30 PM", asr: "3:57 PM", magrib: "5:29 PM", esha: "6:34 PM" },
  "11-22": { fajr: "5:51 AM", juhar: "1:30 PM", asr: "3:57 PM", magrib: "5:29 PM", esha: "6:34 PM" },
  "11-23": { fajr: "5:52 AM", juhar: "1:30 PM", asr: "3:57 PM", magrib: "5:29 PM", esha: "6:34 PM" },
  "11-24": { fajr: "5:52 AM", juhar: "1:30 PM", asr: "3:56 PM", magrib: "5:29 PM", esha: "6:34 PM" },
  "11-25": { fajr: "5:53 AM", juhar: "1:30 PM", asr: "3:56 PM", magrib: "5:29 PM", esha: "6:34 PM" },
  "11-26": { fajr: "5:54 AM", juhar: "1:30 PM", asr: "3:56 PM", magrib: "5:29 PM", esha: "6:34 PM" },
  "11-27": { fajr: "5:55 AM", juhar: "1:30 PM", asr: "3:56 PM", magrib: "5:29 PM", esha: "6:34 PM" },
  "11-28": { fajr: "5:56 AM", juhar: "1:30 PM", asr: "3:56 PM", magrib: "5:29 PM", esha: "6:34 PM" },
  "11-29": { fajr: "5:56 AM", juhar: "1:30 PM", asr: "3:56 PM", magrib: "5:29 PM", esha: "6:34 PM" },
  "11-30": { fajr: "5:57 AM", juhar: "1:30 PM", asr: "3:56 PM", magrib: "5:29 PM", esha: "6:34 PM" },

  // --- DECEMBER ---
  "12-01": { fajr: "5:58 AM", juhar: "1:30 PM", asr: "3:56 PM", magrib: "5:29 PM", esha: "6:34 PM" },
  "12-02": { fajr: "5:58 AM", juhar: "1:30 PM", asr: "3:56 PM", magrib: "5:29 PM", esha: "6:34 PM" },
  "12-03": { fajr: "5:59 AM", juhar: "1:30 PM", asr: "3:56 PM", magrib: "5:29 PM", esha: "6:35 PM" },
  "12-04": { fajr: "6:00 AM", juhar: "1:30 PM", asr: "3:56 PM", magrib: "5:29 PM", esha: "6:35 PM" },
  "12-05": { fajr: "6:01 AM", juhar: "1:30 PM", asr: "3:56 PM", magrib: "5:29 PM", esha: "6:35 PM" },
  "12-06": { fajr: "6:01 AM", juhar: "1:30 PM", asr: "3:56 PM", magrib: "5:29 PM", esha: "6:35 PM" },
  "12-07": { fajr: "6:02 AM", juhar: "1:30 PM", asr: "3:57 PM", magrib: "5:29 PM", esha: "6:35 PM" },
  "12-08": { fajr: "6:03 AM", juhar: "1:30 PM", asr: "3:57 PM", magrib: "5:30 PM", esha: "6:36 PM" },
  "12-09": { fajr: "6:03 AM", juhar: "1:30 PM", asr: "3:57 PM", magrib: "5:30 PM", esha: "6:36 PM" },
  "12-10": { fajr: "6:04 AM", juhar: "1:30 PM", asr: "3:57 PM", magrib: "5:30 PM", esha: "6:36 PM" },
  "12-11": { fajr: "6:05 AM", juhar: "1:30 PM", asr: "3:58 PM", magrib: "5:30 PM", esha: "6:36 PM" },
  "12-12": { fajr: "6:05 AM", juhar: "1:30 PM", asr: "3:58 PM", magrib: "5:31 PM", esha: "6:37 PM" },
  "12-13": { fajr: "6:06 AM", juhar: "1:30 PM", asr: "3:58 PM", magrib: "5:31 PM", esha: "6:37 PM" },
  "12-14": { fajr: "6:07 AM", juhar: "1:30 PM", asr: "3:59 PM", magrib: "5:31 PM", esha: "6:37 PM" },
  "12-15": { fajr: "6:07 AM", juhar: "1:30 PM", asr: "3:59 PM", magrib: "5:32 PM", esha: "6:38 PM" },
  "12-16": { fajr: "6:08 AM", juhar: "1:30 PM", asr: "3:59 PM", magrib: "5:32 PM", esha: "6:38 PM" },
  "12-17": { fajr: "6:09 AM", juhar: "1:30 PM", asr: "4:00 PM", magrib: "5:33 PM", esha: "6:39 PM" },
  "12-18": { fajr: "6:09 AM", juhar: "1:30 PM", asr: "4:00 PM", magrib: "5:33 PM", esha: "6:39 PM" },
  "12-19": { fajr: "6:10 AM", juhar: "1:30 PM", asr: "4:01 PM", magrib: "5:33 PM", esha: "6:39 PM" },
  "12-20": { fajr: "6:10 AM", juhar: "1:30 PM", asr: "4:01 PM", magrib: "5:34 PM", esha: "6:40 PM" },
  "12-21": { fajr: "6:11 AM", juhar: "1:30 PM", asr: "4:02 PM", magrib: "5:34 PM", esha: "6:40 PM" },
  "12-22": { fajr: "6:11 AM", juhar: "1:30 PM", asr: "4:02 PM", magrib: "5:35 PM", esha: "6:41 PM" },
  "12-23": { fajr: "6:12 AM", juhar: "1:30 PM", asr: "4:03 PM", magrib: "5:35 PM", esha: "6:41 PM" },
  "12-24": { fajr: "6:12 AM", juhar: "1:30 PM", asr: "4:03 PM", magrib: "5:36 PM", esha: "6:42 PM" },
  "12-25": { fajr: "6:13 AM", juhar: "1:30 PM", asr: "4:04 PM", magrib: "5:36 PM", esha: "6:42 PM" },
  "12-26": { fajr: "6:13 AM", juhar: "1:30 PM", asr: "4:05 PM", magrib: "5:37 PM", esha: "6:43 PM" },
  "12-27": { fajr: "6:14 AM", juhar: "1:30 PM", asr: "4:05 PM", magrib: "5:38 PM", esha: "6:43 PM" },
  "12-28": { fajr: "6:14 AM", juhar: "1:30 PM", asr: "4:06 PM", magrib: "5:38 PM", esha: "6:44 PM" },
  "12-29": { fajr: "6:15 AM", juhar: "1:30 PM", asr: "4:07 PM", magrib: "5:39 PM", esha: "6:45 PM" },
  "12-30": { fajr: "6:15 AM", juhar: "1:30 PM", asr: "4:07 PM", magrib: "5:40 PM", esha: "6:45 PM" },
  "12-31": { fajr: "6:15 AM", juhar: "1:30 PM", asr: "4:08 PM", magrib: "5:40 PM", esha: "6:46 PM" }
  
};


// Firebase में सभी dates save करने का function
async function savePrayerTimetable() {

  try {

    for (const [date, times] of Object.entries(prayerTimetable)) {

      await setDoc(
        doc(db, "prayerTimes", date),
        times
      );

      console.log("✅ Saved:", date);
    }

    console.log("🎉 Prayer timetable Firebase में save हो गया");

  } catch (error) {

    console.error("❌ Firebase error:", error);

  }
}


// इसे सिर्फ एक बार चलाना है
savePrayerTimetable();










const app = initializeApp(firebaseConfig);
let messaging;

try {
  messaging = getMessaging(app);
} catch (err) {
  alert("Messaging Error: " + err.message);
}
const auth = getAuth(app); 
const db = getFirestore(app);
onMessage(messaging, (payload) => {
  console.log("Foreground notification:", payload);

  const title =
    payload.notification?.title || "🕌 Azaan Booking";

  const body =
    payload.notification?.body || "Azaan booking available hai.";

  alert(`${title}\n\n${body}`);
});
async function initNotifications() {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: "BKEDvgUsYPdttpP142-17o_2JCxK6psGtHnpl9aDaFcaySzobGP6SFJOZJWemBU32Fjb_KEQHq2in0B4tw8_odo",
   serviceWorkerRegistration: await navigator.serviceWorker.register('/Fazal-e-karam/firebase-messaging-sw.js')
    });

    console.log("TOKEN =", token);

if (!token) {
  alert("Token NULL mila");
} else {
  alert(token);
}
await addDoc(collection(db, "fcmTokens"), {
  token: token,
  createdAt: new Date().toISOString()
});
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

initNotifications();
function updateClock(){
  
const now=new Date();

const date=now.toLocaleDateString("en-IN",{

weekday:"long",

day:"numeric",

month:"long",

year:"numeric"

});

const time=now.toLocaleTimeString("en-IN",{

hour:"2-digit",

minute:"2-digit",

second:"2-digit"

});

document.getElementById("today").innerHTML=date;

document.getElementById("clock").innerHTML=time;

}

updateClock();

setInterval(updateClock,1000);

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

registerBtn.onclick = async () => {

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if(name==="" || email==="" || password===""){
    alert("Please fill all fields");
    return;
  }

  try{

    const user = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db,"users",user.user.uid),{

      uid:user.user.uid,
      name:name,
      email:email,
      createdAt:Date.now()

    });

    await signInWithEmailAndPassword(auth, email, password);

document.getElementById("loginPage").style.display = "none";
document.getElementById("mainPage").style.display = "block";
  }catch(error){

    alert(error.message);
  }
};
const forgotPasswordBtn =
  document.getElementById("forgotPasswordBtn");

forgotPasswordBtn.onclick = async () => {
  const email = emailInput.value.trim();

  if (!email) {
    alert("पहले अपना Email लिखें।");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset करने का link आपके email पर भेज दिया गया है।");
  } catch (error) {
    console.error("Password Reset Error:", error);
    alert("Password reset नहीं हो सका: " + error.message);
  }
};
loginBtn.onclick = async ()=>{

  const email=emailInput.value.trim();
 const password=passwordInput.value;

  try{

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
document.getElementById("loginPage").style.display = "none";
document.getElementById("mainPage").style.display = "block";
    

  }catch(error){

    alert(error.message);

  }

};
const googleBtn = document.getElementById("Google");

googleBtn.onclick = async () => {
  try {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);

  } catch (error) {
    console.error("Google Login Error:", error);
    alert("Google Login Error: " + error.message);
  }
};

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.onclick = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
    alert(error.message);
  }
};
  onAuthStateChanged(auth, async (user) => {

    if (!user) {

        document.getElementById("loginPage").style.display = "block";
        document.getElementById("mainPage").style.display = "none";
        document.getElementById("adminPanel").style.display = "none";
        return;

    }
const hasPassword = user?.providerData?.some(
  p => p.providerId === "password"
);

//const setPasswordBtn = document.getElementById("setPasswordBtn");

if (setPasswordBtn) {
  setPasswordBtn.style.display = hasPassword ? "none" : "block";
}

setPasswordBtn.onclick = async () => {
 // const user = auth.currentUser;

  if (!user) {
    alert("Pehle Google se login karein.");
    return;
  }

  const email = prompt("Apna email enter karein:", user.email || "");
  if (!email) return;

  const password = prompt("Naya password enter karein:");
  if (!password) return;

  if (password.length < 6) {
    alert("Password kam se kam 6 characters ka hona chahiye.");
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(email, password);

    await linkWithCredential(user, credential);
const updatedUser = auth.currentUser;

const hasPassword = updatedUser.providerData.some(
  p => p.providerId === "password"
);

if (hasPassword) {
  setPasswordBtn.style.display = "none";
}
    alert("Email + Password successfully add ho gaya.");
  } catch (error) {
    console.error("Set Password Error:", error);
    alert("Password add nahi hua: " + error.message);
  }
};
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";

    // Admin Check
    const adminRef = doc(db, "Admins", user.uid);
    const adminSnap = await getDoc(adminRef);

    document.getElementById("adminPanel").style.display =
        adminSnap.exists() ? "block" : "none";

    // Prayer Times
   const timeRef = doc(db, "prayerTimes", "default");

onSnapshot(timeRef, (timeSnap) => {

    if (!timeSnap.exists()) return;

    const timeData = timeSnap.data();

    PRAYERS.forEach(prayer => {

  const timeEl = document.getElementById(prayer);
  const namazEl = document.getElementById(prayer + "Namaz");

  if (timeEl) {
    timeEl.textContent = timeData[prayer] || "--";
  }

  if (namazEl) {
    namazEl.textContent =
      getNamazTime(timeData[prayer], NAMAZ_DELAY[prayer]);
  }

  const btn = document.getElementById(
    "book" + prayer.charAt(0).toUpperCase() + prayer.slice(1)
  );

  if (btn) {
    if (isPrayerClosed(
  timeData[prayer],
  prayer,
  timeData.esha
)) {
      btn.disabled = true;
      btn.textContent = "Booking Closed";
    } else {
      btn.disabled = false;
      btn.textContent = "I'm Ready";
    }
  }
});

    // Next prayer और status भी तुरंत update
    updateNextPrayer();
});
   // const adminInputs = {
 // fajr: document.getElementById("fajrInput"),
//  juhar: document.getElementById("juharInput"),
//  asr: document.getElementById("asrInput"),
 // magrib: document.getElementById("magribInput"),
 // esha: document.getElementById("eshaInput")
//};

onSnapshot(doc(db, "prayerTimes", "default"), (snap) => {
  if (!snap.exists()) return;

  const data = snap.data();

  PRAYERS.forEach(prayer => {
    const input = document.getElementById(prayer + "Input");
    const firebaseTime = data[prayer];

    if (!input || !firebaseTime) return;

    const [time, period] = firebaseTime
      .trim()
      .toLowerCase()
      .split(" ");

    let [hour, minute] = time.split(":").map(Number);

    if (period === "pm" && hour !== 12) {
      hour += 12;
    }

    if (period === "am" && hour === 12) {
      hour = 0;
    }

    input.value =
      String(hour).padStart(2, "0") +
      ":" +
      String(minute).padStart(2, "0");
  });
});
    function getNamazTime(timeString, delayMinutes) {
  if (!timeString || timeString === "--") {
    return "--";
  }

  const parts = timeString.trim().toLowerCase().split(" ");
  const clock = parts[0];
  const ampm = parts[1];

  let [hour, minute] = clock.split(":").map(Number);

  if (ampm === "pm" && hour !== 12) {
    hour += 12;
  }

  if (ampm === "am" && hour === 12) {
    hour = 0;
  }

  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  date.setMinutes(date.getMinutes() + delayMinutes);

  let newHour = date.getHours();
  const newMinute = String(date.getMinutes()).padStart(2, "0");
  const newAmPm = newHour >= 12 ? "PM" : "AM";

  newHour = newHour % 12;

  if (newHour === 0) {
    newHour = 12;
  }

  return `${newHour}:${newMinute} ${newAmPm}`;
    }
function isPrayerClosed(timeString, prayer, eshaTimeString) {
  if (!timeString || timeString === "--") return false;

  const now = new Date();

  // सिर्फ Fajr के लिए:
  // Esha के बाद Fajr booking ON रहेगी
  if (prayer === "fajr") {

    if (!eshaTimeString || eshaTimeString === "--") {
      return false;
    }

    const parseTime = (str) => {
      const [time, period] = str.trim().toLowerCase().split(" ");
      let [hour, minute] = time.split(":").map(Number);

      if (period === "pm" && hour !== 12) hour += 12;
      if (period === "am" && hour === 12) hour = 0;

      const d = new Date();
      d.setHours(hour, minute, 0, 0);
      return d;
    };

    const fajrTime = parseTime(timeString);
    const eshaTime = parseTime(eshaTimeString);

    // Esha से पहले Fajr बंद
    // Fajr के बाद Fajr बंद
    // बीच में Fajr खुली
    return !(now >= eshaTime && now < fajrTime);
  }

  // बाकी prayers की पुरानी logic
  const [time, period] = timeString.trim().toLowerCase().split(" ");

  let [hour, minute] = time.split(":").map(Number);

  if (period === "pm" && hour !== 12) hour += 12;
  if (period === "am" && hour === 12) hour = 0;

  const prayerTime = new Date();
  prayerTime.setHours(hour, minute, 0, 0);

  return now >= prayerTime;
    }
  //console.count("PRAYERS LOOP");
 PRAYERS.forEach(prayer => {

  const btn = document.getElementById(
    "book" + prayer.charAt(0).toUpperCase() + prayer.slice(1)
  );
  if (!btn) return;
//console.count("BUTTON CLICK");
  btn.onclick = async () => {

    if (!auth.currentUser) {
      alert("Please Login");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
  const bookingRef = doc(db, "azaanBookings", today);
const bookingSnap = await getDoc(bookingRef);
    const bookingData = bookingSnap.exists()
      ? bookingSnap.data()
      : {};

    if (bookingData[prayer + "BookedBy"]) {
      alert("Already Booked");
      return;
    }

    const userSnap = await getDoc(
      doc(db, "users", auth.currentUser.uid)
    );

    const userName = userSnap.exists()
      ? userSnap.data().name
      : auth.currentUser.email;
    await setDoc(
      bookingRef,
      {
        [prayer + "BookedBy"]: userName
      },
      { merge: true }
    );
    alert("Booking Successful");

  };




   

  const cancelBtn = document.getElementById(
  "cancel" + prayer.charAt(0).toUpperCase() + prayer.slice(1)
);

cancelBtn.onclick = async () => {

  const today = new Date().toISOString().split("T")[0];

  const userSnap = await getDoc(
    doc(db, "users", auth.currentUser.uid)
  );

  const userName = userSnap.data().name;

  const bookingRef = doc(db, "azaanBookings", today);
  const bookingSnap = await getDoc(bookingRef);

  if (!bookingSnap.exists()) return;

  const data = bookingSnap.data();

  if (data[prayer + "BookedBy"] !== userName) {
    alert("You can cancel only your own booking.");
    return;
  }

  await setDoc(
    bookingRef,
    {
      [prayer + "BookedBy"]: ""
    },
    { merge: true }
  );

  document.getElementById(prayer + "Booked").textContent = "None";


  alert("Booking Cancelled");

};});
  
const today = new Date().toISOString().split("T")[0];

onSnapshot(doc(db, "azaanBookings", today), (snap) => {
  const data = snap.exists() ? snap.data() : {};
  updateVolunteerCount(data);

  // Update status chips for all prayers in one call
  updatePrayerStatus(data);

  PRAYERS.forEach(prayer => {
    updatePrayerStatus(prayer,data);
    
    const booked = document.getElementById(prayer + "Booked");
    const btn = document.getElementById(
      "book" + prayer.charAt(0).toUpperCase() + prayer.slice(1)
    );
    const cancelBtn = document.getElementById(
      "cancel" + prayer.charAt(0).toUpperCase() + prayer.slice(1)
    );
    const bookedBy = data[prayer + "BookedBy"] || "";

    if (!booked) {
      console.log("Missing:", prayer + "Booked");
      return;
    }
    booked.textContent = bookedBy || "None";

    if (bookedBy) {
      if (btn) btn.style.display = "none";
      if (cancelBtn) cancelBtn.style.display = "inline-block";
    } else {
      if (btn) btn.style.display = "inline-block";
      if (cancelBtn) cancelBtn.style.display = "none";
    }
  });
});
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/Fazal-e-karam/sw.js")
      .then(() => console.log("Service Worker Registered"))
      .catch(err => console.log("SW Error:", err));
  });
}




function updateNextPrayer() {
  const prayers = [
    {
      name: "Fajr",
      time: document.getElementById("fajr").textContent
    },
    {
      name: "Juhar",
      time: document.getElementById("juhar").textContent
    },
    {
      name: "Asr",
      time: document.getElementById("asr").textContent
    },
    {
      name: "Maghrib",
      time: document.getElementById("magrib").textContent
    },
    {
      name: "Isha",
      time: document.getElementById("esha").textContent
    }
  ];

  const now = new Date();
  let next = null;

  for (const prayer of prayers) {
    if (!prayer.time || prayer.time === "--") {
      continue;
    }

    const parts = prayer.time.trim().toLowerCase().split(" ");
    const clock = parts[0];
    const ampm = parts[1];

    let [hour, minute] = clock.split(":").map(Number);

    if (ampm === "pm" && hour !== 12) {
      hour += 12;
    }

    if (ampm === "am" && hour === 12) {
      hour = 0;
    }

    const prayerDate = new Date();
    prayerDate.setHours(hour, minute, 0, 0);

    if (prayerDate > now) {
      next = {
        name: prayer.name,
        date: prayerDate
      };
      break;
    }
  }

  if (!next) {
    const fajrTime = prayers[0].time;

    if (!fajrTime || fajrTime === "--") {
      document.getElementById("nextPrayerName").innerText =
        "Tomorrow Fajr";
      document.getElementById("countdown").innerText =
        "--:--:--";
      return;
    }

    const parts = fajrTime.trim().toLowerCase().split(" ");
    const clock = parts[0];
    const ampm = parts[1];

    let [hour, minute] = clock.split(":").map(Number);

    if (ampm === "pm" && hour !== 12) {
      hour += 12;
    }

    if (ampm === "am" && hour === 12) {
      hour = 0;
    }

    const tomorrowFajr = new Date();
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    tomorrowFajr.setHours(hour, minute, 0, 0);

    next = {
      name: "Tomorrow Fajr",
      date: tomorrowFajr
    };
  }

  document.getElementById("nextPrayerName").innerText =
    next.name;

  const diff = next.date - now;

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById("countdown").innerText =
    String(hours).padStart(2, "0") + ":" +
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0");

}

  setInterval(updateNextPrayer,1000);

updateNextPrayer();
function updateVolunteerCount(data){

let total = 0;

PRAYERS.forEach(prayer=>{

if(data[prayer+"BookedBy"] && data[prayer+"BookedBy"]!=""){

total++;

}

});

document.getElementById("totalBooked").textContent =
total + "/5";

}
function updatePrayerStatus(data) {
  PRAYERS.forEach(prayer => {
    const chip = document.getElementById(prayer + "Status");
    if (!chip) return;
    const booked = data?.[prayer + "BookedBy"] || "";
    const timeEl = document.getElementById(prayer);
    const time = timeEl ? timeEl.textContent : "--";
    if (isPrayerClosed(time)) {
      chip.className = "status-chip closed";
      chip.innerText = "Closed";
    } else if (booked) {
      chip.className = "status-chip booked";
      chip.innerText = "Booked";
    } else {
      chip.className = "status-chip available";
      chip.innerText = "Available";
    }
  });
}
const saveBtn = document.getElementById("saveBtn");

if (saveBtn) {
  saveBtn.onclick = async () => {
    try {
      if (!auth.currentUser) {
        alert("Please Login");
        return;
      }
      function formatTime12(time) {
  if (!time) return "";

  let [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${String(minute).padStart(2, "0")} ${period}`;
      }
const times = {
  fajr: formatTime12(document.getElementById("fajrInput").value),
  juhar: formatTime12(document.getElementById("juharInput").value),
  asr: formatTime12(document.getElementById("asrInput").value),
  magrib: formatTime12(document.getElementById("magribInput").value),
  esha: formatTime12(document.getElementById("eshaInput").value)
};
      

      await setDoc(
        doc(db, "prayerTimes", "default"),
        times,
        { merge: true }
      );

      alert("Prayer Times Saved Successfully");

      location.reload();

    } catch (error) {
      console.error("Prayer time save error:", error);
      alert("Save failed: " + error.message);
      }
  };
}
  });
