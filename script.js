  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

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
  onSnapshot 
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

const auth = getAuth(app);
 const db = getFirestore(app);

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

  PRAYERS.forEach(prayer => {

    const booked = document.getElementById(prayer + "Booked");

    const btn = document.getElementById(
      "book" + prayer.charAt(0).toUpperCase() + prayer.slice(1)
    );

    const cancelBtn = document.getElementById(
      "cancel" + prayer.charAt(0).toUpperCase() + prayer.slice(1)
    );

    const bookedBy = data[prayer + "BookedBy"] || "";

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
    navigator.serviceWorker.register("./sw.js")
      .then(() => console.log("SW Registered"))
      .catch(err => console.log(err));
  });
}
