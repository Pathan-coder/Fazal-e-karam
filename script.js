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
  query,
  where,
  getDocs,
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
  "isha"
];
const NAMAZ_DELAY = {
  fajr: 30,
  juhar: 15,
  asr: 15,
  magrib: 4,
  isha: 15
};




// ===============================
// PRAYER TIMETABLE → FIREBASE
// ===============================

const prayerTimetable = {
  // --- JANUARY --
  "01-01": { day: "Thursday", fajr: "06:25", asr: "16:30", magrib: "17:34", isha: "19:15" },
  "02-01": { day: "Friday", fajr: "06:30", asr: "16:30", magrib: "17:34", isha: "19:15" },
  "03-01": { day: "Saturday", fajr: "06:30", asr: "16:30", magrib: "17:35", isha: "19:15" },
  "04-01": { day: "Sunday", fajr: "06:30", asr: "16:30", magrib: "17:35", isha: "19:15" },
  "05-01": { day: "Monday", fajr: "06:30", asr: "16:30", magrib: "17:36", isha: "19:15" },
  "06-01": { day: "Tuesday", fajr: "06:30", asr: "16:30", magrib: "17:36", isha: "19:15" },
  "07-01": { day: "Wednesday", fajr: "06:30", asr: "16:30", magrib: "17:37", isha: "19:15" },
  "08-01": { day: "Thursday", fajr: "06:30", asr: "16:30", magrib: "17:38", isha: "19:15" },
  "09-01": { day: "Friday", fajr: "06:30", asr: "16:30", magrib: "17:39", isha: "19:15" },
  "10-01": { day: "Saturday", fajr: "06:30", asr: "16:30", magrib: "17:39", isha: "19:15" },
  "11-01": { day: "Sunday", fajr: "06:30", asr: "16:30", magrib: "17:40", isha: "19:15" },
  "12-01": { day: "Monday", fajr: "06:30", asr: "16:30", magrib: "17:41", isha: "19:15" },
  "13-01": { day: "Tuesday", fajr: "06:30", asr: "16:30", magrib: "17:42", isha: "19:15" },
  "14-01": { day: "Wednesday", fajr: "06:30", asr: "16:30", magrib: "17:42", isha: "19:15" },
  "15-01": { day: "Thursday", fajr: "06:30", asr: "16:30", magrib: "17:43", isha: "19:15" },
  "16-01": { day: "Friday", fajr: "06:30", asr: "16:30", magrib: "17:44", isha: "19:15" },
  "17-01": { day: "Saturday", fajr: "06:30", asr: "16:30", magrib: "17:45", isha: "19:15" },
  "18-01": { day: "Sunday", fajr: "06:30", asr: "16:30", magrib: "17:45", isha: "19:15" },
  "19-01": { day: "Monday", fajr: "06:30", asr: "16:30", magrib: "17:46", isha: "19:15" },
  "20-01": { day: "Tuesday", fajr: "06:30", asr: "16:30", magrib: "17:47", isha: "19:15" },
  "21-01": { day: "Wednesday", fajr: "06:30", asr: "16:30", magrib: "17:48", isha: "19:15" },
  "22-01": { day: "Thursday", fajr: "06:30", asr: "16:30", magrib: "17:48", isha: "19:15" },
  "23-01": { day: "Friday", fajr: "06:30", asr: "16:30", magrib: "17:49", isha: "19:15" },
  "24-01": { day: "Saturday", fajr: "06:30", asr: "16:30", magrib: "17:50", isha: "19:15" },
  "25-01": { day: "Sunday", fajr: "06:30", asr: "16:30", magrib: "17:51", isha: "19:15" },
  "26-01": { day: "Monday", fajr: "06:30", asr: "16:30", magrib: "17:51", isha: "19:15" },
  "27-01": { day: "Tuesday", fajr: "06:30", asr: "16:30", magrib: "17:52", isha: "19:15" },
  "28-01": { day: "Wednesday", fajr: "06:30", asr: "16:30", magrib: "17:53", isha: "19:15" },
  "29-01": { day: "Thursday", fajr: "06:30", asr: "16:30", magrib: "17:54", isha: "19:15" },
  "30-01": { day: "Friday", fajr: "06:30", asr: "16:30", magrib: "17:54", isha: "19:15" },
  "31-01": { day: "Saturday", fajr: "06:30", asr: "16:30", magrib: "17:55", isha: "19:15" },
  "01-02": { day: "Sunday", fajr: "06:25", asr: "16:45", magrib: "17:56", isha: "19:15" },
  "02-02": { day: "Monday", fajr: "06:25", asr: "16:45", magrib: "17:57", isha: "19:15" },
  "03-02": { day: "Tuesday", fajr: "06:25", asr: "16:45", magrib: "17:57", isha: "19:15" },
  "04-02": { day: "Wednesday", fajr: "06:25", asr: "16:45", magrib: "17:58", isha: "19:15" },
  "05-02": { day: "Thursday", fajr: "06:25", asr: "16:45", magrib: "17:59", isha: "19:15" },
  "06-02": { day: "Friday", fajr: "06:25", asr: "16:45", magrib: "17:59", isha: "19:15" },
  "07-02": { day: "Saturday", fajr: "06:25", asr: "16:45", magrib: "18:00", isha: "19:15" },
  "08-02": { day: "Sunday", fajr: "06:25", asr: "16:45", magrib: "18:01", isha: "19:15" },
  "09-02": { day: "Monday", fajr: "06:25", asr: "16:45", magrib: "18:01", isha: "19:15" },
  "10-02": { day: "Tuesday", fajr: "06:25", asr: "16:45", magrib: "18:02", isha: "19:15" },
  "11-02": { day: "Wednesday", fajr: "06:25", asr: "16:45", magrib: "18:03", isha: "19:15" },
  "12-02": { day: "Thursday", fajr: "06:25", asr: "16:45", magrib: "18:03", isha: "19:15" },
  "13-02": { day: "Friday", fajr: "06:25", asr: "16:45", magrib: "18:04", isha: "19:15" },
  "14-02": { day: "Saturday", fajr: "06:25", asr: "16:45", magrib: "18:05", isha: "19:15" },
  "15-02": { day: "Sunday", fajr: "06:25", asr: "16:45", magrib: "18:05", isha: "19:15" },
  "16-02": { day: "Monday", fajr: "06:15", asr: "16:45", magrib: "18:06", isha: "19:30" },
  "17-02": { day: "Tuesday", fajr: "06:15", asr: "16:45", magrib: "18:07", isha: "19:30" },
  "18-02": { day: "Wednesday", fajr: "06:15", asr: "16:45", magrib: "18:07", isha: "19:30" },
  "19-02": { day: "Thursday", fajr: "06:15", asr: "16:45", magrib: "18:08", isha: "19:30" },
  "20-02": { day: "Friday", fajr: "06:15", asr: "16:45", magrib: "18:08", isha: "19:30" },
  "21-02": { day: "Saturday", fajr: "06:15", asr: "16:45", magrib: "18:09", isha: "19:30" },
  "22-02": { day: "Sunday", fajr: "06:15", asr: "16:45", magrib: "18:09", isha: "19:30" },
  "23-02": { day: "Monday", fajr: "06:15", asr: "16:45", magrib: "18:10", isha: "19:30" },
  "24-02": { day: "Tuesday", fajr: "06:15", asr: "16:45", magrib: "18:11", isha: "19:30" },
  "25-02": { day: "Wednesday", fajr: "06:15", asr: "16:45", magrib: "18:11", isha: "19:30" },
  "26-02": { day: "Thursday", fajr: "06:15", asr: "16:45", magrib: "18:12", isha: "19:30" },
  "27-02": { day: "Friday", fajr: "06:15", asr: "16:45", magrib: "18:12", isha: "19:30" },
  "28-02": { day: "Saturday", fajr: "06:15", asr: "16:45", magrib: "18:13", isha: "19:30" },
  "01-03": { day: "Sunday", fajr: "06:05", asr: "16:45", magrib: "18:13", isha: "19:30" },
  "02-03": { day: "Monday", fajr: "06:05", asr: "16:45", magrib: "18:14", isha: "19:30" },
  "03-03": { day: "Tuesday", fajr: "06:05", asr: "16:45", magrib: "18:14", isha: "19:30" },
  "04-03": { day: "Wednesday", fajr: "06:05", asr: "16:45", magrib: "18:15", isha: "19:30" },
  "05-03": { day: "Thursday", fajr: "06:05", asr: "16:45", magrib: "18:15", isha: "19:30" },
  "06-03": { day: "Friday", fajr: "06:05", asr: "16:45", magrib: "18:16", isha: "19:30" },
  "07-03": { day: "Saturday", fajr: "06:05", asr: "16:45", magrib: "18:16", isha: "19:30" },
  "08-03": { day: "Sunday", fajr: "06:05", asr: "16:45", magrib: "18:17", isha: "19:30" },
  "09-03": { day: "Monday", fajr: "06:05", asr: "16:45", magrib: "18:17", isha: "19:30" },
  "10-03": { day: "Tuesday", fajr: "06:05", asr: "16:45", magrib: "18:18", isha: "19:30" },
  "11-03": { day: "Wednesday", fajr: "06:05", asr: "16:45", magrib: "18:18", isha: "19:30" },
  "12-03": { day: "Thursday", fajr: "06:05", asr: "16:45", magrib: "18:19", isha: "19:30" },
  "13-03": { day: "Friday", fajr: "06:05", asr: "16:45", magrib: "18:19", isha: "19:30" },
  "14-03": { day: "Saturday", fajr: "06:05", asr: "16:45", magrib: "18:20", isha: "19:30" },
  "15-03": { day: "Sunday", fajr: "06:05", asr: "16:45", magrib: "18:20", isha: "19:30" },
  "16-03": { day: "Monday", fajr: "05:45", asr: "17:00", magrib: "18:21", isha: "19:45" },
  "17-03": { day: "Tuesday", fajr: "05:45", asr: "17:00", magrib: "18:21", isha: "19:45" },
  "18-03": { day: "Wednesday", fajr: "05:45", asr: "17:00", magrib: "18:22", isha: "19:45" },
  "19-03": { day: "Thursday", fajr: "05:45", asr: "17:00", magrib: "18:22", isha: "19:45" },
  "20-03": { day: "Friday", fajr: "05:45", asr: "17:00", magrib: "18:23", isha: "19:45" },
  "21-03": { day: "Saturday", fajr: "05:45", asr: "17:00", magrib: "18:23", isha: "19:45" },
  "22-03": { day: "Sunday", fajr: "05:45", asr: "17:00", magrib: "18:24", isha: "19:45" },
  "23-03": { day: "Monday", fajr: "05:45", asr: "17:00", magrib: "18:24", isha: "19:45" },
  "24-03": { day: "Tuesday", fajr: "05:45", asr: "17:00", magrib: "18:24", isha: "19:45" },
  "25-03": { day: "Wednesday", fajr: "05:45", asr: "17:00", magrib: "18:25", isha: "19:45" },
  "26-03": { day: "Thursday", fajr: "05:45", asr: "17:00", magrib: "18:25", isha: "19:45" },
  "27-03": { day: "Friday", fajr: "05:45", asr: "17:00", magrib: "18:26", isha: "19:45" },
  "28-03": { day: "Saturday", fajr: "05:45", asr: "17:00", magrib: "18:26", isha: "19:45" },
  "29-03": { day: "Sunday", fajr: "05:45", asr: "17:00", magrib: "18:27", isha: "19:45" },
  "30-03": { day: "Monday", fajr: "05:45", asr: "17:00", magrib: "18:27", isha: "19:45" },
  "31-03": { day: "Tuesday", fajr: "05:45", asr: "17:00", magrib: "18:28", isha: "19:45" },
  "01-04": { day: "Wednesday", fajr: "05:30", asr: "17:00", magrib: "18:28", isha: "19:45" },
  "02-04": { day: "Thursday", fajr: "05:30", asr: "17:00", magrib: "18:29", isha: "19:45" },
  "03-04": { day: "Friday", fajr: "05:30", asr: "17:00", magrib: "18:29", isha: "19:45" },
  "04-04": { day: "Saturday", fajr: "05:30", asr: "17:00", magrib: "18:30", isha: "19:45" },
  "05-04": { day: "Sunday", fajr: "05:30", asr: "17:00", magrib: "18:30", isha: "19:45" },
  "06-04": { day: "Monday", fajr: "05:30", asr: "17:00", magrib: "18:30", isha: "19:45" },
  "07-04": { day: "Tuesday", fajr: "05:30", asr: "17:00", magrib: "18:31", isha: "19:45" },
  "08-04": { day: "Wednesday", fajr: "05:30", asr: "17:00", magrib: "18:31", isha: "19:45" },
  "09-04": { day: "Thursday", fajr: "05:30", asr: "17:00", magrib: "18:32", isha: "19:45" },
  "10-04": { day: "Friday", fajr: "05:30", asr: "17:00", magrib: "18:32", isha: "19:45" },
  "11-04": { day: "Saturday", fajr: "05:30", asr: "17:00", magrib: "18:33", isha: "19:45" },
  "12-04": { day: "Sunday", fajr: "05:30", asr: "17:00", magrib: "18:33", isha: "19:45" },
  "13-04": { day: "Monday", fajr: "05:30", asr: "17:00", magrib: "18:34", isha: "19:45" },
  "14-04": { day: "Tuesday", fajr: "05:30", asr: "17:00", magrib: "18:34", isha: "19:45" },
  "15-04": { day: "Wednesday", fajr: "05:30", asr: "17:00", magrib: "18:35", isha: "19:45" },
  "16-04": { day: "Thursday", fajr: "05:15", asr: "17:15", magrib: "18:35", isha: "20:00" },
  "17-04": { day: "Friday", fajr: "05:15", asr: "17:15", magrib: "18:36", isha: "20:00" },
  "18-04": { day: "Saturday", fajr: "05:15", asr: "17:15", magrib: "18:36", isha: "20:00" },
  "19-04": { day: "Sunday", fajr: "05:15", asr: "17:15", magrib: "18:37", isha: "20:00" },
  "20-04": { day: "Monday", fajr: "05:15", asr: "17:15", magrib: "18:37", isha: "20:00" },
  "21-04": { day: "Tuesday", fajr: "05:15", asr: "17:15", magrib: "18:38", isha: "20:00" },
  "22-04": { day: "Wednesday", fajr: "05:15", asr: "17:15", magrib: "18:38", isha: "20:00" },
  "23-04": { day: "Thursday", fajr: "05:15", asr: "17:15", magrib: "18:39", isha: "20:00" },
  "24-04": { day: "Friday", fajr: "05:15", asr: "17:15", magrib: "18:39", isha: "20:00" },
  "25-04": { day: "Saturday", fajr: "05:15", asr: "17:15", magrib: "18:40", isha: "20:00" },
  "26-04": { day: "Sunday", fajr: "05:15", asr: "17:15", magrib: "18:40", isha: "20:00" },
  "27-04": { day: "Monday", fajr: "05:15", asr: "17:15", magrib: "18:41", isha: "20:00" },
  "28-04": { day: "Tuesday", fajr: "05:15", asr: "17:15", magrib: "18:41", isha: "20:00" },
  "29-04": { day: "Wednesday", fajr: "05:15", asr: "17:15", magrib: "18:42", isha: "20:00" },
  "30-04": { day: "Thursday", fajr: "05:15", asr: "17:15", magrib: "18:42", isha: "20:00" },
  "01-05": { day: "Friday", fajr: "05:05", asr: "17:15", magrib: "18:43", isha: "20:00" },
  "02-05": { day: "Saturday", fajr: "05:05", asr: "17:15", magrib: "18:43", isha: "20:00" },
  "03-05": { day: "Sunday", fajr: "05:05", asr: "17:15", magrib: "18:44", isha: "20:00" },
  "04-05": { day: "Monday", fajr: "05:05", asr: "17:15", magrib: "18:44", isha: "20:00" },
  "05-05": { day: "Tuesday", fajr: "05:05", asr: "17:15", magrib: "18:45", isha: "20:00" },
  "06-05": { day: "Wednesday", fajr: "05:05", asr: "17:15", magrib: "18:45", isha: "20:00" },
  "07-05": { day: "Thursday", fajr: "05:05", asr: "17:15", magrib: "18:46", isha: "20:00" },
  "08-05": { day: "Friday", fajr: "05:05", asr: "17:15", magrib: "18:46", isha: "20:00" },
  "09-05": { day: "Saturday", fajr: "05:05", asr: "17:15", magrib: "18:47", isha: "20:00" },
  "10-05": { day: "Sunday", fajr: "05:05", asr: "17:15", magrib: "18:47", isha: "20:00" },
  "11-05": { day: "Monday", fajr: "05:05", asr: "17:15", magrib: "18:48", isha: "20:00" },
  "12-05": { day: "Tuesday", fajr: "05:05", asr: "17:15", magrib: "18:48", isha: "20:00" },
  "13-05": { day: "Wednesday", fajr: "05:05", asr: "17:15", magrib: "18:49", isha: "20:00" },
  "14-05": { day: "Thursday", fajr: "05:05", asr: "17:15", magrib: "18:49", isha: "20:00" },
  "15-05": { day: "Friday", fajr: "05:05", asr: "17:15", magrib: "18:50", isha: "20:00" },
  "16-05": { day: "Saturday", fajr: "04:55", asr: "17:30", magrib: "18:50", isha: "20:15" },
  "17-05": { day: "Sunday", fajr: "04:55", asr: "17:30", magrib: "18:51", isha: "20:15" },
  "18-05": { day: "Monday", fajr: "04:55", asr: "17:30", magrib: "18:51", isha: "20:15" },
  "19-05": { day: "Tuesday", fajr: "04:55", asr: "17:30", magrib: "18:52", isha: "20:15" },
  "20-05": { day: "Wednesday", fajr: "04:55", asr: "17:30", magrib: "18:52", isha: "20:15" },
  "21-05": { day: "Thursday", fajr: "04:55", asr: "17:30", magrib: "18:53", isha: "20:15" },
  "22-05": { day: "Friday", fajr: "04:55", asr: "17:30", magrib: "18:53", isha: "20:15" },
  "23-05": { day: "Saturday", fajr: "04:55", asr: "17:30", magrib: "18:54", isha: "20:15" },
  "24-05": { day: "Sunday", fajr: "04:55", asr: "17:30", magrib: "18:54", isha: "20:15" },
  "25-05": { day: "Monday", fajr: "04:55", asr: "17:30", magrib: "18:55", isha: "20:15" },
  "26-05": { day: "Tuesday", fajr: "04:55", asr: "17:30", magrib: "18:55", isha: "20:15" },
  "27-05": { day: "Wednesday", fajr: "04:55", asr: "17:30", magrib: "18:55", isha: "20:15" },
  "28-05": { day: "Thursday", fajr: "04:55", asr: "17:30", magrib: "18:56", isha: "20:15" },
  "29-05": { day: "Friday", fajr: "04:55", asr: "17:30", magrib: "18:56", isha: "20:15" },
  "30-05": { day: "Saturday", fajr: "04:55", asr: "17:30", magrib: "18:57", isha: "20:15" },
  "31-05": { day: "Sunday", fajr: "04:55", asr: "17:30", magrib: "18:57", isha: "20:15" },
  "01-06": { day: "Monday", fajr: "04:45", asr: "17:30", magrib: "18:58", isha: "20:15" },
  "02-06": { day: "Tuesday", fajr: "04:45", asr: "17:30", magrib: "18:58", isha: "20:15" },
  "03-06": { day: "Wednesday", fajr: "04:45", asr: "17:30", magrib: "18:59", isha: "20:15" },
  "04-06": { day: "Thursday", fajr: "04:45", asr: "17:30", magrib: "18:59", isha: "20:15" },
  "05-06": { day: "Friday", fajr: "04:45", asr: "17:30", magrib: "18:59", isha: "20:15" },
  "06-06": { day: "Saturday", fajr: "04:45", asr: "17:30", magrib: "19:00", isha: "20:15" },
  "07-06": { day: "Sunday", fajr: "04:45", asr: "17:30", magrib: "19:00", isha: "20:15" },
  "08-06": { day: "Monday", fajr: "04:45", asr: "17:30", magrib: "19:00", isha: "20:15" },
  "09-06": { day: "Tuesday", fajr: "04:45", asr: "17:30", magrib: "19:01", isha: "20:15" },
  "10-06": { day: "Wednesday", fajr: "04:45", asr: "17:30", magrib: "19:01", isha: "20:15" },
  "11-06": { day: "Thursday", fajr: "04:45", asr: "17:30", magrib: "19:01", isha: "20:15" },
  "12-06": { day: "Friday", fajr: "04:45", asr: "17:30", magrib: "19:02", isha: "20:15" },
  "13-06": { day: "Saturday", fajr: "04:45", asr: "17:30", magrib: "19:02", isha: "20:15" },
  "14-06": { day: "Sunday", fajr: "04:45", asr: "17:30", magrib: "19:02", isha: "20:15" },
  "15-06": { day: "Monday", fajr: "04:45", asr: "17:30", magrib: "19:03", isha: "20:15" },
  "16-06": { day: "Tuesday", fajr: "04:45", asr: "17:30", magrib: "19:03", isha: "20:15" },
  "17-06": { day: "Wednesday", fajr: "04:45", asr: "17:30", magrib: "19:03", isha: "20:15" },
  "18-06": { day: "Thursday", fajr: "04:45", asr: "17:30", magrib: "19:03", isha: "20:15" },
  "19-06": { day: "Friday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "20-06": { day: "Saturday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "21-06": { day: "Sunday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "22-06": { day: "Monday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "23-06": { day: "Tuesday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "24-06": { day: "Wednesday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "25-06": { day: "Thursday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "26-06": { day: "Friday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "27-06": { day: "Saturday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "28-06": { day: "Sunday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "29-06": { day: "Monday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "30-06": { day: "Tuesday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "01-07": { day: "Wednesday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "02-07": { day: "Thursday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "03-07": { day: "Friday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "04-07": { day: "Saturday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "05-07": { day: "Sunday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "06-07": { day: "Monday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "07-07": { day: "Tuesday", fajr: "04:45", asr: "17:30", magrib: "19:04", isha: "20:15" },
  "08-07": { day: "Wednesday", fajr: "04:45", asr: "17:30", magrib: "19:03", isha: "20:15" },
  "09-07": { day: "Thursday", fajr: "04:45", asr: "17:30", magrib: "19:03", isha: "20:15" },
  "10-07": { day: "Friday", fajr: "04:45", asr: "17:30", magrib: "19:03", isha: "20:15" },
  "11-07": { day: "Saturday", fajr: "04:45", asr: "17:30", magrib: "19:03", isha: "20:15" },
  "12-07": { day: "Sunday", fajr: "04:45", asr: "17:30", magrib: "19:02", isha: "20:15" },
  "13-07": { day: "Monday", fajr: "04:45", asr: "17:30", magrib: "19:02", isha: "20:15" },
  "14-07": { day: "Tuesday", fajr: "04:45", asr: "17:30", magrib: "19:02", isha: "20:15" },
  "15-07": { day: "Wednesday", fajr: "04:45", asr: "17:30", magrib: "19:01", isha: "20:15" },
  "16-07": { day: "Thursday", fajr: "05:00", asr: "17:30", magrib: "19:01", isha: "20:15" },
  "17-07": { day: "Friday", fajr: "05:00", asr: "17:30", magrib: "19:00", isha: "20:15" },
  "18-07": { day: "Saturday", fajr: "05:00", asr: "17:30", magrib: "19:00", isha: "20:15" },
  "19-07": { day: "Sunday", fajr: "05:00", asr: "17:30", magrib: "18:59", isha: "20:15" },
  "20-07": { day: "Monday", fajr: "05:00", asr: "17:30", magrib: "18:59", isha: "20:15" },
  "21-07": { day: "Tuesday", fajr: "05:00", asr: "17:30", magrib: "18:58", isha: "20:15" },
  "22-07": { day: "Wednesday", fajr: "05:00", asr: "17:30", magrib: "18:58", isha: "20:15" },
  "23-07": { day: "Thursday", fajr: "05:00", asr: "17:30", magrib: "18:57", isha: "20:15" },
  "24-07": { day: "Friday", fajr: "05:00", asr: "17:30", magrib: "18:57", isha: "20:15" },
  "25-07": { day: "Saturday", fajr: "05:00", asr: "17:30", magrib: "18:56", isha: "20:15" },
  "26-07": { day: "Sunday", fajr: "05:00", asr: "17:30", magrib: "18:55", isha: "20:15" },
  "27-07": { day: "Monday", fajr: "05:00", asr: "17:30", magrib: "18:55", isha: "20:15" },
  "28-07": { day: "Tuesday", fajr: "05:00", asr: "17:30", magrib: "18:54", isha: "20:15" },
  "29-07": { day: "Wednesday", fajr: "05:00", asr: "17:30", magrib: "18:53", isha: "20:15" },
  "30-07": { day: "Thursday", fajr: "05:00", asr: "17:30", magrib: "18:53", isha: "20:15" },
  "31-07": { day: "Friday", fajr: "05:00", asr: "17:30", magrib: "18:52", isha: "20:15" },
  "01-08": { day: "Saturday", fajr: "05:15", asr: "17:15", magrib: "18:51", isha: "20:15" },
  "02-08": { day: "Sunday", fajr: "05:15", asr: "17:15", magrib: "18:50", isha: "20:15" },
  "03-08": { day: "Monday", fajr: "05:15", asr: "17:15", magrib: "18:50", isha: "20:15" },
  "04-08": { day: "Tuesday", fajr: "05:15", asr: "17:15", magrib: "18:49", isha: "20:15" },
  "05-08": { day: "Wednesday", fajr: "05:15", asr: "17:15", magrib: "18:48", isha: "20:15" },
  "06-08": { day: "Thursday", fajr: "05:15", asr: "17:15", magrib: "18:47", isha: "20:15" },
  "07-08": { day: "Friday", fajr: "05:15", asr: "17:15", magrib: "18:46", isha: "20:15" },
  "08-08": { day: "Saturday", fajr: "05:15", asr: "17:15", magrib: "18:46", isha: "20:15" },
  "09-08": { day: "Sunday", fajr: "05:15", asr: "17:15", magrib: "18:45", isha: "20:15" },
  "10-08": { day: "Monday", fajr: "05:15", asr: "17:15", magrib: "18:44", isha: "20:15" },
  "11-08": { day: "Tuesday", fajr: "05:15", asr: "17:15", magrib: "18:43", isha: "20:15" },
  "12-08": { day: "Wednesday", fajr: "05:15", asr: "17:15", magrib: "18:42", isha: "20:15" },
  "13-08": { day: "Thursday", fajr: "05:15", asr: "17:15", magrib: "18:41", isha: "20:15" },
  "14-08": { day: "Friday", fajr: "05:15", asr: "17:15", magrib: "18:40", isha: "20:15" },
  "15-08": { day: "Saturday", fajr: "05:15", asr: "17:15", magrib: "18:39", isha: "20:15" },
  "16-08": { day: "Sunday", fajr: "05:25", asr: "17:00", magrib: "18:38", isha: "20:00" },
  "17-08": { day: "Monday", fajr: "05:25", asr: "17:00", magrib: "18:37", isha: "20:00" },
  "18-08": { day: "Tuesday", fajr: "05:25", asr: "17:00", magrib: "18:36", isha: "20:00" },
  "19-08": { day: "Wednesday", fajr: "05:25", asr: "17:00", magrib: "18:35", isha: "20:00" },
  "20-08": { day: "Thursday", fajr: "05:25", asr: "17:00", magrib: "18:34", isha: "20:00" },
  "21-08": { day: "Friday", fajr: "05:25", asr: "17:00", magrib: "18:33", isha: "20:00" },
  "22-08": { day: "Saturday", fajr: "05:25", asr: "17:00", magrib: "18:32", isha: "20:00" },
  "23-08": { day: "Sunday", fajr: "05:25", asr: "17:00", magrib: "18:31", isha: "20:00" },
  "24-08": { day: "Monday", fajr: "05:25", asr: "17:00", magrib: "18:30", isha: "20:00" },
  "25-08": { day: "Tuesday", fajr: "05:25", asr: "17:00", magrib: "18:29", isha: "20:00" },
  "26-08": { day: "Wednesday", fajr: "05:25", asr: "17:00", magrib: "18:28", isha: "20:00" },
  "27-08": { day: "Thursday", fajr: "05:25", asr: "17:00", magrib: "18:27", isha: "20:00" },
  "28-08": { day: "Friday", fajr: "05:25", asr: "17:00", magrib: "18:26", isha: "20:00" },
  "29-08": { day: "Saturday", fajr: "05:25", asr: "17:00", magrib: "18:24", isha: "20:00" },
  "30-08": { day: "Sunday", fajr: "05:25", asr: "17:00", magrib: "18:23", isha: "20:00" },
  "31-08": { day: "Monday", fajr: "05:25", asr: "17:00", magrib: "18:22", isha: "20:00" },
  "01-09": { day: "Tuesday", fajr: "05:35", asr: "16:45", magrib: "18:21", isha: "19:45" },
  "02-09": { day: "Wednesday", fajr: "05:35", asr: "16:45", magrib: "18:20", isha: "19:45" },
  "03-09": { day: "Thursday", fajr: "05:35", asr: "16:45", magrib: "18:18", isha: "19:45" },
  "04-09": { day: "Friday", fajr: "05:35", asr: "16:45", magrib: "18:17", isha: "19:45" },
  "05-09": { day: "Saturday", fajr: "05:35", asr: "16:45", magrib: "18:16", isha: "19:45" },
  "06-09": { day: "Sunday", fajr: "05:35", asr: "16:45", magrib: "18:15", isha: "19:45" },
  "07-09": { day: "Monday", fajr: "05:35", asr: "16:45", magrib: "18:13", isha: "19:45" },
  "08-09": { day: "Tuesday", fajr: "05:35", asr: "16:45", magrib: "18:12", isha: "19:45" },
  "09-09": { day: "Wednesday", fajr: "05:35", asr: "16:45", magrib: "18:11", isha: "19:45" },
  "10-09": { day: "Thursday", fajr: "05:35", asr: "16:45", magrib: "18:10", isha: "19:45" },
  "11-09": { day: "Friday", fajr: "05:35", asr: "16:45", magrib: "18:08", isha: "19:45" },
  "12-09": { day: "Saturday", fajr: "05:35", asr: "16:45", magrib: "18:07", isha: "19:45" },
  "13-09": { day: "Sunday", fajr: "05:35", asr: "16:45", magrib: "18:06", isha: "19:45" },
  "14-09": { day: "Monday", fajr: "05:35", asr: "16:45", magrib: "18:05", isha: "19:45" },
  "15-09": { day: "Tuesday", fajr: "05:35", asr: "16:45", magrib: "18:03", isha: "19:45" },
  "16-09": { day: "Wednesday", fajr: "05:45", asr: "16:30", magrib: "18:02", isha: "19:30" },
  "17-09": { day: "Thursday", fajr: "05:45", asr: "16:30", magrib: "18:01", isha: "19:30" },
  "18-09": { day: "Friday", fajr: "05:45", asr: "16:30", magrib: "17:59", isha: "19:30" },
  "19-09": { day: "Saturday", fajr: "05:45", asr: "16:30", magrib: "17:58", isha: "19:30" },
  "20-09": { day: "Sunday", fajr: "05:45", asr: "16:30", magrib: "17:57", isha: "19:30" },
  "21-09": { day: "Monday", fajr: "05:45", asr: "16:30", magrib: "17:56", isha: "19:30" },
  "22-09": { day: "Tuesday", fajr: "05:45", asr: "16:30", magrib: "17:54", isha: "19:30" },
  "23-09": { day: "Wednesday", fajr: "05:45", asr: "16:30", magrib: "17:53", isha: "19:30" },
  "24-09": { day: "Thursday", fajr: "05:45", asr: "16:30", magrib: "17:52", isha: "19:30" },
  "25-09": { day: "Friday", fajr: "05:45", asr: "16:30", magrib: "17:51", isha: "19:30" },
  "26-09": { day: "Saturday", fajr: "05:45", asr: "16:30", magrib: "17:49", isha: "19:30" },
  "27-09": { day: "Sunday", fajr: "05:45", asr: "16:30", magrib: "17:48", isha: "19:30" },
  "28-09": { day: "Monday", fajr: "05:45", asr: "16:30", magrib: "17:47", isha: "19:30" },
  "29-09": { day: "Tuesday", fajr: "05:45", asr: "16:30", magrib: "17:46", isha: "19:30" },
  "30-09": { day: "Wednesday", fajr: "05:45", asr: "16:30", magrib: "17:44", isha: "19:30" },
  "01-10": { day: "Thursday", fajr: "05:55", asr: "16:30", magrib: "17:43", isha: "19:15" },
  "02-10": { day: "Friday", fajr: "05:55", asr: "16:30", magrib: "17:42", isha: "19:15" },
  "03-10": { day: "Saturday", fajr: "05:55", asr: "16:30", magrib: "17:41", isha: "19:15" },
  "04-10": { day: "Sunday", fajr: "05:55", asr: "16:30", magrib: "17:40", isha: "19:15" },
  "05-10": { day: "Monday", fajr: "05:55", asr: "16:30", magrib: "17:39", isha: "19:15" },
  "06-10": { day: "Tuesday", fajr: "05:55", asr: "16:30", magrib: "17:37", isha: "19:15" },
  "07-10": { day: "Wednesday", fajr: "05:55", asr: "16:30", magrib: "17:36", isha: "19:15" },
  "08-10": { day: "Thursday", fajr: "05:55", asr: "16:30", magrib: "17:35", isha: "19:15" },
  "09-10": { day: "Friday", fajr: "05:55", asr: "16:30", magrib: "17:34", isha: "19:15" },
  "10-10": { day: "Saturday", fajr: "05:55", asr: "16:30", magrib: "17:33", isha: "19:15" },
  "11-10": { day: "Sunday", fajr: "05:55", asr: "16:30", magrib: "17:32", isha: "19:15" },
  "12-10": { day: "Monday", fajr: "05:55", asr: "16:30", magrib: "17:31", isha: "19:15" },
  "13-10": { day: "Tuesday", fajr: "05:55", asr: "16:30", magrib: "17:30", isha: "19:15" },
  "14-10": { day: "Wednesday", fajr: "05:55", asr: "16:30", magrib: "17:29", isha: "19:15" },
  "15-10": { day: "Thursday", fajr: "05:55", asr: "16:30", magrib: "17:28", isha: "19:15" },
  "16-10": { day: "Friday", fajr: "06:05", asr: "16:15", magrib: "17:27", isha: "19:15" },
  "17-10": { day: "Saturday", fajr: "06:05", asr: "16:15", magrib: "17:26", isha: "19:15" },
  "18-10": { day: "Sunday", fajr: "06:05", asr: "16:15", magrib: "17:25", isha: "19:15" },
  "19-10": { day: "Monday", fajr: "06:05", asr: "16:15", magrib: "17:24", isha: "19:15" },
  "20-10": { day: "Tuesday", fajr: "06:05", asr: "16:15", magrib: "17:23", isha: "19:15" },
  "21-10": { day: "Wednesday", fajr: "06:05", asr: "16:15", magrib: "17:22", isha: "19:15" },
  "22-10": { day: "Thursday", fajr: "06:05", asr: "16:15", magrib: "17:21", isha: "19:15" },
  "23-10": { day: "Friday", fajr: "06:05", asr: "16:15", magrib: "17:21", isha: "19:15" },
  "24-10": { day: "Saturday", fajr: "06:05", asr: "16:15", magrib: "17:20", isha: "19:15" },
  "25-10": { day: "Sunday", fajr: "06:05", asr: "16:15", magrib: "17:19", isha: "19:15" },
  "26-10": { day: "Monday", fajr: "06:05", asr: "16:15", magrib: "17:18", isha: "19:15" },
  "27-10": { day: "Tuesday", fajr: "06:05", asr: "16:15", magrib: "17:18", isha: "19:15" },
  "28-10": { day: "Wednesday", fajr: "06:05", asr: "16:15", magrib: "17:17", isha: "19:15" },
  "29-10": { day: "Thursday", fajr: "06:05", asr: "16:15", magrib: "17:16", isha: "19:15" },
  "30-10": { day: "Friday", fajr: "06:05", asr: "16:15", magrib: "17:16", isha: "19:15" },
  "31-10": { day: "Saturday", fajr: "06:05", asr: "16:15", magrib: "17:15", isha: "19:15" },
  "01-11": { day: "Sunday", fajr: "06:15", asr: "16:15", magrib: "17:15", isha: "19:15" },
  "02-11": { day: "Monday", fajr: "06:15", asr: "16:15", magrib: "17:14", isha: "19:15" },
  "03-11": { day: "Tuesday", fajr: "06:15", asr: "16:15", magrib: "17:13", isha: "19:15" },
  "04-11": { day: "Wednesday", fajr: "06:15", asr: "16:15", magrib: "17:13", isha: "19:15" },
  "05-11": { day: "Thursday", fajr: "06:15", asr: "16:15", magrib: "17:12", isha: "19:15" },
  "06-11": { day: "Friday", fajr: "06:15", asr: "16:15", magrib: "17:12", isha: "19:15" },
  "07-11": { day: "Saturday", fajr: "06:15", asr: "16:15", magrib: "17:12", isha: "19:15" },
  "08-11": { day: "Sunday", fajr: "06:15", asr: "16:15", magrib: "17:11", isha: "19:15" },
  "09-11": { day: "Monday", fajr: "06:15", asr: "16:15", magrib: "17:11", isha: "19:15" },
  "10-11": { day: "Tuesday", fajr: "06:15", asr: "16:15", magrib: "17:10", isha: "19:15" },
  "11-11": { day: "Wednesday", fajr: "06:15", asr: "16:15", magrib: "17:10", isha: "19:15" },
  "12-11": { day: "Thursday", fajr: "06:15", asr: "16:15", magrib: "17:10", isha: "19:15" },
  "13-11": { day: "Friday", fajr: "06:15", asr: "16:15", magrib: "17:09", isha: "19:15" },
  "14-11": { day: "Saturday", fajr: "06:15", asr: "16:15", magrib: "17:09", isha: "19:15" },
  "15-11": { day: "Sunday", fajr: "06:15", asr: "16:15", magrib: "17:09", isha: "19:15" },
  "16-11": { day: "Monday", fajr: "06:25", asr: "16:15", magrib: "17:09", isha: "19:15" },
  "17-11": { day: "Tuesday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "18-11": { day: "Wednesday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "19-11": { day: "Thursday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "20-11": { day: "Friday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "21-11": { day: "Saturday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "22-11": { day: "Sunday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "23-11": { day: "Monday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "24-11": { day: "Tuesday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "25-11": { day: "Wednesday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "26-11": { day: "Thursday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "27-11": { day: "Friday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "28-11": { day: "Saturday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "29-11": { day: "Sunday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "30-11": { day: "Monday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "01-12": { day: "Tuesday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "02-12": { day: "Wednesday", fajr: "06:25", asr: "16:15", magrib: "17:08", isha: "19:15" },
  "03-12": { day: "Thursday", fajr: "06:25", asr: "16:15", magrib: "17:09", isha: "19:15" },
  "04-12": { day: "Friday", fajr: "06:25", asr: "16:15", magrib: "17:09", isha: "19:15" },
  "05-12": { day: "Saturday", fajr: "06:25", asr: "16:15", magrib: "17:09", isha: "19:15" },
  "06-12": { day: "Sunday", fajr: "06:25", asr: "16:15", magrib: "17:09", isha: "19:15" },
  "07-12": { day: "Monday", fajr: "06:25", asr: "16:15", magrib: "17:10", isha: "19:15" },
  "08-12": { day: "Tuesday", fajr: "06:25", asr: "16:15", magrib: "17:10", isha: "19:15" },
  "09-12": { day: "Wednesday", fajr: "06:25", asr: "16:15", magrib: "17:10", isha: "19:15" },
  "10-12": { day: "Thursday", fajr: "06:25", asr: "16:15", magrib: "17:11", isha: "19:15" },
  "11-12": { day: "Friday", fajr: "06:25", asr: "16:15", magrib: "17:11", isha: "19:15" },
  "12-12": { day: "Saturday", fajr: "06:25", asr: "16:15", magrib: "17:12", isha: "19:15" },
  "13-12": { day: "Sunday", fajr: "06:25", asr: "16:15", magrib: "17:12", isha: "19:15" },
  "14-12": { day: "Monday", fajr: "06:25", asr: "16:15", magrib: "17:13", isha: "19:15" },
  "15-12": { day: "Tuesday", fajr: "06:25", asr: "16:15", magrib: "17:13", isha: "19:15" },
  "16-12": { day: "Wednesday", fajr: "06:25", asr: "16:15", magrib: "17:14", isha: "19:15" },
  "17-12": { day: "Thursday", fajr: "06:25", asr: "16:15", magrib: "17:14", isha: "19:15" },
  "18-12": { day: "Friday", fajr: "06:25", asr: "16:15", magrib: "17:15", isha: "19:15" },
  "19-12": { day: "Saturday", fajr: "06:25", asr: "16:15", magrib: "17:15", isha: "19:15" },
  "20-12": { day: "Sunday", fajr: "06:25", asr: "16:15", magrib: "17:16", isha: "19:15" },
  "21-12": { day: "Monday", fajr: "06:25", asr: "16:15", magrib: "17:17", isha: "19:15" },
  "22-12": { day: "Tuesday", fajr: "06:25", asr: "16:15", magrib: "17:17", isha: "19:15" },
  "23-12": { day: "Wednesday", fajr: "06:25", asr: "16:15", magrib: "17:18", isha: "19:15" },
  "24-12": { day: "Thursday", fajr: "06:25", asr: "16:15", magrib: "17:18", isha: "19:15" },
  "25-12": { day: "Friday", fajr: "06:25", asr: "16:15", magrib: "17:19", isha: "19:15" },
  "26-12": { day: "Saturday", fajr: "06:25", asr: "16:15", magrib: "17:20", isha: "19:15" },
  "27-12": { day: "Sunday", fajr: "06:25", asr: "16:15", magrib: "17:30", isha: "19:15" },
  "28-12": { day: "Monday", fajr: "06:25", asr: "16:15", magrib: "17:31", isha: "19:15" },
  "29-12": { day: "Tuesday", fajr: "06:25", asr: "16:15", magrib: "17:31", isha: "19:15" },
  "30-12": { day: "Wednesday", fajr: "06:25", asr: "16:15", magrib: "17:31", isha: "19:15" },
  "31-12": { day: "Thursday", fajr: "06:25", asr: "16:15", magrib: "17:31", isha: "19:15" }
};

// Firebase में सभी dates save करने का function











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
const tokenQuery = query(
  collection(db, "fcmTokens"),
  where("token", "==", token)
);

const snapshot = await getDocs(tokenQuery);

if (snapshot.empty) {
  await addDoc(collection(db, "fcmTokens"), {
    token: token,
    createdAt: new Date().toISOString()
  });

  console.log("New FCM token saved");
} else {
  console.log("Token already exists");
}
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

initNotifications();









/*async function savePrayerTimetable() {

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

*/











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
function getTodayDateKey() {
  const now = new Date();

  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${month}-${day}`;
}
    
    // Prayer Times
    const todayKey = getTodayDateKey();
   const timeRef = doc(db, "prayerTimes", todayKey);

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

onSnapshot(doc(db, "prayerTimes", todayKey ), (snap) => {
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
