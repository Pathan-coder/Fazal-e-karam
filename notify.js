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

function getIndianDate() {

  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata"
  });

}

const today = getIndianDate();

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


}

run();
// Get FCM Tokens
const tokenSnap = await db.collection("fcmTokens").get();

const tokens = [];

tokenSnap.forEach(doc => {
  const data = doc.data();

  if (data.token) {
    tokens.push(data.token);
  }
});

console.log("Total Tokens:", tokens.length);

if (tokens.length === 0) {
  console.log("No Tokens Found");
  return;
}

// Prayer Alert Minutes
const ALERT_TIME = {
  fajr: 30,
  juhar: 30,
  asr: 30,
  magrib: 15,
  esha: 30
};

function getMinutesLeft(timeString){

  const now = new Date();

  const [time, period] = timeString.split(" ");

  let [hour, minute] = time.split(":").map(Number);

  if(period==="pm" && hour!==12) hour+=12;
  if(period==="am" && hour===12) hour=0;

  const prayer=new Date();

  prayer.setHours(hour,minute,0,0);

  return Math.floor((prayer-now)/60000);

}
// Check Every Prayer

for (const prayerName of Object.keys(ALERT_TIME)) {

  const bookedBy = booking[prayerName + "BookedBy"];

  if (bookedBy && bookedBy !== "") {
    console.log(prayerName + " already booked");
    continue;
  }

  const minutesLeft = getMinutesLeft(prayer[prayerName]);

  console.log(prayerName, minutesLeft);

  if (minutesLeft === ALERT_TIME[prayerName]) {
    
const notifyId = `${today}_${prayerName}`;

const notifyRef = db.collection("notificationsSent").doc(notifyId);

const notifySnap = await notifyRef.get();

if (notifySnap.exists) {

  console.log("Already Sent");

  continue;

    }
    
    console.log("Sending Notification For", prayerName);

    const message = {
      notification: {
        title: "🕌 Masjid-e-Fazal",
        body: `${prayerName.toUpperCase()} ki Azaan ${minutesLeft} minute baad hai.\nAbhi tak koi volunteer nahi mila.`
      },

      webpush: {
        notification: {
          icon: "/icon-192.png",
          badge: "/icon-192.png"
        }
      },

      tokens: tokens
    };

    try {

      const response =
      await admin.messaging().sendEachForMulticast(message);
await notifyRef.set({

  prayer: prayerName,

  date: today,

  sentAt: admin.firestore.FieldValue.serverTimestamp()

});
      console.log(
        "Success:",
        response.successCount,
        "Failed:",
        response.failureCount
      );

    } catch (err) {

      console.error(err);

    }

  }

}

console.log("Notification Check Completed");
