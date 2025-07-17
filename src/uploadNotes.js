// uploadNotes.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

// ✅ Firebase Config (same as your app)
const firebaseConfig = {
  apiKey: "AIzaSyAifbfN9x6f70RnH02InYAu1xCGc8pni4k",
  authDomain: "prachaar-d29cf.firebaseapp.com",
  projectId: "prachaar-d29cf",
  storageBucket: "prachaar-d29cf.appspot.com",
  messagingSenderId: "213791810337",
  appId: "1:213791810337:web:2ab94bbe11824b34819460",
  measurementId: "G-NEX7135DG7"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);

// ✅ Sample Notes Data (add more if needed)
const notes = [
  {
    title: "Redox Reaction Full Notes",
    price: 49,
    productImageUrl: "https://your-preview-image-link",
    description: "Includes oxidation number, equivalent concept, and balancing.",
    notesPDFUrl: "https://firebasestorage.googleapis.com/v0/b/prachaar-d29cf.appspot.com/o/Redox.pdf?alt=media",
    youtubeURLs: [
      "https://youtu.be/bvEisHctBvs",
      "https://youtu.be/sXEigQEmLJk"
    ],
    subject: "Chemistry",
    grade: "JEE / Class 12",
    keywords: ["redox", "oxidation", "equivalent", "oxynumber"],
    time: Timestamp.now()
  }
];

async function uploadNotes() {
  console.log("📤 Uploading notes to Firestore...");

  try {
    for (const note of notes) {
      const docRef = await addDoc(collection(fireDB, "notes"), note);
      console.log(`✅ Uploaded "${note.title}" with ID: ${docRef.id}`);
    }
    console.log("🎉 All notes uploaded successfully.");
  } catch (err) {
    console.error("❌ Error uploading notes:", err);
  }
}

uploadNotes();
