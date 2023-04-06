// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_GOOGLE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_GOOGLE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_GOOGLE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_GOOGLE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_GOOGLE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_GOOGLE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_GOOGLE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)

// 匯出google登入程式 & 登入環境
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
