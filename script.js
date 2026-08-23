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
GoogleAuthProvider,
signInWithRedirect,
signInWithPopup
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
const app = initializeApp(firebaseConfig);
let messaging;

try {
  messaging = getMessaging(app);
} catch (err) {
  alert("Messaging Error: " + err.message);
}
const auth = getAuth(app); 
const db = getFirestore(app);

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

    ["fajr", "juhar", "asr", "magrib", "esha"].forEach(prayer => {

        const timeEl = document.getElementById(prayer);

        if (timeEl) {
            timeEl.textContent = timeData[prayer] || "--";
        }

        const btn = document.getElementById(
            "book" + prayer.charAt(0).toUpperCase() + prayer.slice(1)
        );

        if (btn) {

            if (isPrayerClosed(timeData[prayer])) {
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
function isPrayerClosed(timeString) {
  if (!timeString || timeString === "--") return false;

  const now = new Date();

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
