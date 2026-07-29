import admin from "firebase-admin";

/* =========================================================
   MASJID-E-FAZAL — GITHUB ACTIONS NOTIFICATION SCHEDULER
   ========================================================= */

const serviceAccountText = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountText) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT GitHub Secret नहीं मिला।"
  );
}

let serviceAccount;

try {
  serviceAccount = JSON.parse(serviceAccountText);
} catch {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT सही JSON format में नहीं है।"
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const messaging = admin.messaging();

/* =========================================================
   FIRESTORE COLLECTIONS
   ========================================================= */

const PRAYER_TIME_COLLECTION = "prayerTimes";
const PRAYER_TIME_DOCUMENT = "default";
const BOOKING_COLLECTION = "azaanBookings";
const TOKEN_COLLECTION = "fcmTokens";
const SENT_COLLECTION = "notificationsSent";

/* =========================================================
   APP SETTINGS
   ========================================================= */

const APP_URL =
  "https://pathan-coder.github.io/Fazal-e-karam/";

const NOTIFICATION_ICON =
  "https://pathan-coder.github.io/Fazal-e-karam/3859.png";

/*
  alertBefore = Azaan से कितने मिनट पहले notification भेजनी है
*/
const PRAYERS = [
  { key: "fajr", title: "Fajr", alertBefore: 30 },
  { key: "juhar", title: "Zuhr", alertBefore: 30 },
  { key: "asr", title: "Asr", alertBefore: 30 },
  { key: "magrib", title: "Maghrib", alertBefore: 15 },
  { key: "esha", title: "Isha", alertBefore: 30 },
];

/*
  GitHub Actions हर 5 मिनट चलती है, लेकिन कभी-कभी late हो सकती है।
  इसलिए 10 मिनट की सुरक्षित checking window रखी गई है।
*/
const ALERT_WINDOW_MINUTES = 9;
const MAX_MULTICAST_SIZE = 500;

/* =========================================================
   INDIA DATE/TIME HELPERS
   ========================================================= */

function getIndiaDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const values = {};

  for (const part of formatter.formatToParts(date)) {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  }

  return {
    year: values.year,
    month: values.month,
    day: values.day,
  };
}

function getIndiaDateString(date = new Date()) {
  const { year, month, day } = getIndiaDateParts(date);
  return `${year}-${month}-${day}`;
}

function getIndiaCurrentMinutes(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  let hour = 0;
  let minute = 0;

  for (const part of formatter.formatToParts(date)) {
    if (part.type === "hour") {
      hour = Number(part.value);
    }

    if (part.type === "minute") {
      minute = Number(part.value);
    }
  }

  // कुछ environments midnight को 24:00 दिखाते हैं।
  if (hour === 24) {
    hour = 0;
  }

  return hour * 60 + minute;
}

/* =========================================================
   PRAYER TIME PARSER

   Supported formats:
   5:10 am
   05:10 AM
   17:10
   ========================================================= */

function parsePrayerTime(timeValue) {
  if (typeof timeValue !== "string") {
    return null;
  }

  const cleanTime = timeValue
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  if (!cleanTime || cleanTime === "--") {
    return null;
  }

  const match = cleanTime.match(
    /^(\d{1,2}):(\d{2})(?:\s*(am|pm))?$/
  );

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3];

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  if (period) {
    if (hour < 1 || hour > 12) {
      return null;
    }

    if (period === "pm" && hour !== 12) {
      hour += 12;
    }

    if (period === "am" && hour === 12) {
      hour = 0;
    }
  } else if (hour < 0 || hour > 23) {
    return null;
  }

  return hour * 60 + minute;
}

function getMinutesUntilPrayer(timeValue) {
  const prayerMinutes = parsePrayerTime(timeValue);

  if (prayerMinutes === null) {
    return null;
  }

  return prayerMinutes - getIndiaCurrentMinutes();
}

function shouldSendAlert(minutesLeft, alertBefore) {
  const earliestAllowed =
    alertBefore - ALERT_WINDOW_MINUTES;

  return (
    minutesLeft <= alertBefore &&
    minutesLeft >= earliestAllowed
  );
}

/* =========================================================
   TOKEN HELPERS
   ========================================================= */

function extractToken(documentSnapshot) {
  const data = documentSnapshot.data() || {};

  if (
    typeof data.token === "string" &&
    data.token.trim()
  ) {
    return data.token.trim();
  }

  if (
    typeof data.fcmToken === "string" &&
    data.fcmToken.trim()
  ) {
    return data.fcmToken.trim();
  }

  return null;
}

async function getAllTokenRecords() {
  const snapshot = await db
    .collection(TOKEN_COLLECTION)
    .get();

  const records = [];
  const uniqueTokens = new Set();

  snapshot.forEach((documentSnapshot) => {
    const token = extractToken(documentSnapshot);

    if (!token || uniqueTokens.has(token)) {
      return;
    }

    uniqueTokens.add(token);

    records.push({
      id: documentSnapshot.id,
      token,
      ref: documentSnapshot.ref,
    });
  });

  return records;
}

function splitIntoChunks(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function isInvalidTokenError(errorCode) {
  return [
    "messaging/registration-token-not-registered",
    "messaging/invalid-registration-token",
    "messaging/invalid-argument",
  ].includes(errorCode);
}

/* =========================================================
   SEND PUSH NOTIFICATION
   ========================================================= */

async function sendNotificationToTokens({
  prayer,
  minutesLeft,
  tokenRecords,
}) {
  const chunks = splitIntoChunks(
    tokenRecords,
    MAX_MULTICAST_SIZE
  );

  let totalSuccess = 0;
  let totalFailure = 0;
  const invalidTokenRefs = [];

  for (const chunk of chunks) {
    const tokens = chunk.map((record) => record.token);

    const message = {
      notification: {
        title: `🕌 ${prayer.title} Azaan Reminder`,
        body:
          `${prayer.title} की अज़ान लगभग ` +
          `${minutesLeft} मिनट बाद है। ` +
          "अभी तक कोई Volunteer नहीं मिला।",
      },

      data: {
        prayer: prayer.key,
        prayerTitle: prayer.title,
        minutesLeft: String(minutesLeft),
        url: APP_URL,
      },

      webpush: {
        headers: {
          Urgency: "high",
        },

        notification: {
          icon: NOTIFICATION_ICON,
          badge: NOTIFICATION_ICON,
          tag: `azaan-${prayer.key}`,
          renotify: false,
          requireInteraction: true,
        },

        fcmOptions: {
          link: APP_URL,
        },
      },

      tokens,
    };

    const response =
      await messaging.sendEachForMulticast(message);

    totalSuccess += response.successCount;
    totalFailure += response.failureCount;

    response.responses.forEach(
      (itemResponse, responseIndex) => {
        if (itemResponse.success) {
          return;
        }

        const code = itemResponse.error?.code || "unknown";
        const failedRecord = chunk[responseIndex];

        console.error(
          `Token send failed (${failedRecord.id}):`,
          code,
          itemResponse.error?.message || ""
        );

        if (isInvalidTokenError(code)) {
          invalidTokenRefs.push(failedRecord.ref);
        }
      }
    );
  }

  if (invalidTokenRefs.length > 0) {
    const deleteBatches = splitIntoChunks(
      invalidTokenRefs,
      450
    );

    for (const refs of deleteBatches) {
      const batch = db.batch();

      for (const ref of refs) {
        batch.delete(ref);
      }

      await batch.commit();
    }

    console.log(
      `🧹 ${invalidTokenRefs.length} invalid token हटाए गए।`
    );
  }

  return {
    successCount: totalSuccess,
    failureCount: totalFailure,
  };
}

/* =========================================================
   MAIN SCHEDULER
   ========================================================= */

async function run() {
  const today = getIndiaDateString();
  const indiaMinutes = getIndiaCurrentMinutes();

  console.log("====================================");
  console.log("🕌 Masjid-e-Fazal Notification Check");
  console.log("India Date:", today);
  console.log("India Time Minutes:", indiaMinutes);
  console.log("====================================");

  const prayerReference = db
    .collection(PRAYER_TIME_COLLECTION)
    .doc(PRAYER_TIME_DOCUMENT);

  const bookingReference = db
    .collection(BOOKING_COLLECTION)
    .doc(today);

  const [prayerSnapshot, bookingSnapshot] =
    await Promise.all([
      prayerReference.get(),
      bookingReference.get(),
    ]);

  if (!prayerSnapshot.exists) {
    console.log(
      `❌ ${PRAYER_TIME_COLLECTION}/${PRAYER_TIME_DOCUMENT} नहीं मिला।`
    );
    return;
  }

  const prayerTimes = prayerSnapshot.data() || {};

  const bookingData = bookingSnapshot.exists
    ? bookingSnapshot.data() || {}
    : {};

  console.log("Prayer Times:", prayerTimes);
  console.log("Booking Data:", bookingData);

  const tokenRecords = await getAllTokenRecords();

  console.log(
    "Unique FCM Tokens:",
    tokenRecords.length
  );

  if (tokenRecords.length === 0) {
    console.log("❌ कोई FCM token नहीं मिला।");
    return;
  }

  for (const prayer of PRAYERS) {
    console.log("------------------------------------");

    const prayerTime = prayerTimes[prayer.key];

    const bookedValue =
      bookingData[`${prayer.key}BookedBy`];

    const bookedBy =
      typeof bookedValue === "string"
        ? bookedValue.trim()
        : "";

    console.log("Prayer:", prayer.title);
    console.log("Stored Time:", prayerTime || "Missing");
    console.log("Booked By:", bookedBy || "None");

    if (bookedBy) {
      console.log(
        `✅ ${prayer.title} पहले से booked है।`
      );
      continue;
    }

    const minutesLeft =
      getMinutesUntilPrayer(prayerTime);

    if (minutesLeft === null) {
      console.log(
        `❌ ${prayer.title} का time format गलत है।`
      );
      continue;
    }

    console.log(
      `${prayer.title} में ${minutesLeft} मिनट बाकी हैं।`
    );

    if (
      !shouldSendAlert(
        minutesLeft,
        prayer.alertBefore
      )
    ) {
      console.log(
        `ℹ️ Alert window नहीं है। Target: ` +
        `${prayer.alertBefore} मिनट पहले।`
      );
      continue;
    }

    const notificationId =
      `${today}_${prayer.key}_${prayer.alertBefore}`;

    const notificationReference = db
      .collection(SENT_COLLECTION)
      .doc(notificationId);

    const alreadySentSnapshot =
      await notificationReference.get();

    if (alreadySentSnapshot.exists) {
      console.log(
        `⏭️ ${prayer.title} notification पहले भेजी जा चुकी है।`
      );
      continue;
    }

    console.log(
      `🔔 ${prayer.title} notification भेजी जा रही है...`
    );

    const result = await sendNotificationToTokens({
      prayer,
      minutesLeft,
      tokenRecords,
    });

    console.log(
      `✅ Success: ${result.successCount}`
    );

    console.log(
      `❌ Failed: ${result.failureCount}`
    );

    /*
      कम-से-कम एक device पर notification पहुंची,
      तभी duplicate-protection document बनाया जाएगा।
    */
    if (result.successCount > 0) {
      await notificationReference.set({
        prayer: prayer.key,
        prayerTitle: prayer.title,
        prayerTime,
        alertBefore: prayer.alertBefore,
        minutesLeftWhenSent: minutesLeft,
        date: today,
        successCount: result.successCount,
        failureCount: result.failureCount,
        sentAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(
        `💾 ${notificationId} को sent mark किया गया।`
      );
    } else {
      console.log(
        "⚠️ किसी device पर notification नहीं पहुंची; " +
        "इसे sent mark नहीं किया गया।"
      );
    }
  }

  console.log("------------------------------------");
  console.log("✅ Notification check completed.");
}

/* =========================================================
   START
   ========================================================= */

run()
  .then(() => {
    console.log("✅ Script finished successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Scheduler failed:", error);
    process.exit(1);
  });
