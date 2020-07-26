// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
// Add the Firebase products that you want to use
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth'
import { firebaseKey } from './keys';


// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: firebaseKey,
    authDomain: "windsurfnorge.firebaseapp.com",
    databaseURL: "https://windsurfnorge.firebaseio.com",
    projectId: "windsurfnorge",
    storageBucket: "windsurfnorge.appspot.com",
    messagingSenderId: "40570796100",
    appId: "1:40570796100:web:1fef46f02638fc9264a411",
    measurementId: "G-2398SRG5XT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();