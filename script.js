import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";
import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword
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
      vapidKey: "BKEDvgUsYPdttpP142-17o_2JCxK6psGtHnpl9aDaFcaySzobGP6SFJOZJWemBU32Fjb_KEQHq2in0B4tw8_odo"
    });

    console.log("FCM Token:", token);
    alert(token);
await addDoc(collection(db, "fcmTokens"), {
  token: token,
  createdAt: new Date().toISOString()
});
  } catch (err) {
    console.error(err);
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
    const timeSnap = await getDoc(timeRef);

    if (timeSnap.exists()) {

        const timeData = timeSnap.data();

   ["fajr", "juhar", "asr", "magrib", "esha"].forEach(prayer => {

  document.getElementById(prayer).textContent = timeData[prayer];
const btn = document.getElementById("book" + prayer.charAt(0).toUpperCase() + prayer.slice(1));

if (btn) {
console.log(timeData[prayer], isPrayerClosed(timeData[prayer]));
    if (isPrayerClosed(timeData[prayer])) {

        btn.disabled = true;
        btn.textContent = "Booking Closed";

    } else {

        btn.disabled = false;
        btn.textContent = "I'm Ready";

    }

}
        });

    }

});
function isPrayerClosed(timeString) {

  const now = new Date();

  const [time, period] = timeString.split(" ");

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
alert(prayer, bookedBy);
    booked.textContent = bookedBy || "None";

    if (bookedBy) {

      btn.style.display = "none";
      cancelBtn.style.display = "inline-block";

    } else {

      btn.style.display = "inline-block";
      cancelBtn.style.display = "none";}

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

{name:"Fajr",time:document.getElementById("fajr").textContent},

{name:"Zuhr",time:document.getElementById("juhar").textContent},

{name:"Asr",time:document.getElementById("asr").textContent},

{name:"Maghrib",time:document.getElementById("magrib").textContent},

{name:"Isha",time:document.getElementById("esha").textContent}

];

const now=new Date();

let next=null;

for(const prayer of prayers){

if(prayer.time==="--") continue;

let t=prayer.time.trim().toLowerCase();

let [clock,ampm]=t.split(" ");

let [h,m]=clock.split(":").map(Number);

if(ampm==="pm" && h!=12) h+=12;

if(ampm==="am" && h==12) h=0;

let d=new Date();

d.setHours(h,m,0,0);

if(d>now){

next={

name:prayer.name,

date:d

};

break;

}

}

if(!next){

document.getElementById("nextPrayerName").innerText="Tomorrow Fajr";

document.getElementById("countdown").innerText="--:--:--";

return;

}

document.getElementById("nextPrayerName").innerText=next.name;

let diff=next.date-now;

let hrs=Math.floor(diff/3600000);

let mins=Math.floor((diff%3600000)/60000);

let sec=Math.floor((diff%60000)/1000);

document.getElementById("countdown").innerText=

String(hrs).padStart(2,"0")+":"+

String(mins).padStart(2,"0")+":"+

String(sec).padStart(2,"0");

}

  setInterval(updateNextPrayer,1000);

updateNextPrayer();
function updatePrayerStatus(prayer,data){

const chip=document.getElementById(prayer+"Status");

if(!chip) return;

const booked=data[prayer+"BookedBy"];

const time=document.getElementById(prayer).textContent;

if(isPrayerClosed(time)){

chip.className="status-chip closed";

chip.innerText="Closed";

return;

}

if(booked){

chip.className="status-chip booked";

chip.innerText="Booked";

}else{

chip.className="status-chip available";

chip.innerText="Available";

}

}
