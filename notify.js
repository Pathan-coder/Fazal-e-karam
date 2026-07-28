import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const ALERT_TIME = {
  fajr: 30,
  juhar: 30,
  asr: 30,
  magrib: 15,
  esha: 30
};

const today = new Date().toISOString().split("T")[0];

async function run() {

  console.log("Checking Prayer Time...");

  const prayerSnap = await db.collection("prayerTimes").doc("default").get();

  if (!prayerSnap.exists) {
    console.log("Prayer Time Not Found");
    return;
  }

  const bookingSnap = await db.collection("azaanBookings").doc(today).get();

  const booking = bookingSnap.exists ? bookingSnap.data() : {};

  const prayer = prayerSnap.data();

  console.log(prayer);

  console.log(booking);

}

run();
