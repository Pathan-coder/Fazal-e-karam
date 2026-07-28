import admin from "firebase-admin";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log("✅ Firebase Connected");

const prayers = [
  { name: "fajr", alertBefore: 30 },
  { name: "zuhr", alertBefore: 30 },
  { name: "asr", alertBefore: 30 },
  { name: "maghrib", alertBefore: 15 },
  { name: "esha", alertBefore: 30 }
];

console.log(prayers);
