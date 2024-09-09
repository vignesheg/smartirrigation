// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDymuoSQrB855PmttCpUbiOlp6Ag4iraIA",
    authDomain: "irrigo-dfb76.firebaseapp.com",
    databaseURL: "https://irrigo-dfb76-default-rtdb.firebaseio.com",
    projectId: "irrigo-dfb76",
    storageBucket: "irrigo-dfb76.appspot.com",
    messagingSenderId: "962205265859",
    appId: "1:962205265859:web:4bd3bdc9336d24d9c19776",
    measurementId: "G-743R2SL793"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// Get button elements
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const manualBtn = document.getElementById("mannual");
const autoBtn = document.getElementById("auto");
const statusElement = document.getElementById('status-text');
let humid = document.getElementById("humid");
const temp = document.getElementById("temp");
const soilmoist = document.getElementById("soilmoist");

// Check if buttons are found
if (startBtn && stopBtn && manualBtn && autoBtn) {
    startBtn.addEventListener("click", timeset);
    stopBtn.addEventListener("click", () => {
        // Add your stop button functionality here if needed
        console.log("Stop button clicked");
    });
    manualBtn.addEventListener("click", manualset);
    autoBtn.addEventListener("click", autoset);
    stopBtn.addEventListener("click",stpmt);
} else {
    console.error("One or more button elements are missing from the DOM.");
}

function timeset() {
    // Get the start and end times from the form
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    // Check if the times are valid
    if (startTime && endTime) {
        update(ref(db, "statuses"), {
            starttime: startTime,
            endtime: endTime,
            mtstatus:1
        });

        // Display the times in the result div
        
    } else {
        // Display an error message if times are not valid
        document.getElementById('result').innerHTML = '<p style="color: red;">Please enter both start and end times.</p>';
    }
}

function manualset() {
    update(ref(db, "/statuses/"), {
        mode: 1
    });
}

function autoset() {
    update(ref(db, "/statuses/"), {
        mode: 2,
        mtstatus:1
    });
}

// Listen for changes to the database
onValue(ref(db, '/statuses/'), (snapshot) => {
    let data = snapshot.val();
    console.log(data);

    if(data.mode == 2){
       console.log(data.mode);
       startBtn.setAttribute("disabled",true);
    }else if(data.mode == 1){
        startBtn.removeAttribute("disabled");
    }

    if(data.mtstatus == 1 && data.mode == 1){
        statusElement.textContent = 'Motor is ON';
    }else if(data.mtstatus == 1 && data.mode == 2){
        statusElement.textContent = 'Motor will be on on time';
    }else if(data.mtstatus == 0 && data.mode == 1){
        statusElement.textContent = 'Motor is OFF';
    }
  
    document.getElementById('result').innerHTML = `
            <p><strong>Start Time:</strong> ${data.starttime}</p>
            <p><strong>End Time:</strong> ${data.endtime}</p>
        `;
});

onValue(ref(db,'/sensors/'),(snapshot)=>{
    const data = snapshot.val();
    if (data) {
      const keys = Object.keys(data); // Get the keys of the object
      const lastKey = keys[keys.length - 1]; // Get the last key
      const lastValue = data[lastKey]; // Get the last value

      console.log("Last Key:", lastKey);
      console.log("Last Value:", lastValue);}

     humid.innerHTML = lastValue.waterlevel;
      
})
function stpmt(){
    update(ref(db,"/statuses/"),{
        mtstatus:0
    })
}