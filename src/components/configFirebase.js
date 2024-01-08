import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyD2ndMmu7SWHXMvVpr_hvbHa0MJNyc0BrY",
    authDomain: "voterapp-9e0d1.firebaseapp.com",
    databaseURL: "https://voterapp-9e0d1-default-rtdb.firebaseio.com",
    projectId: "voterapp-9e0d1",
    storageBucket: "voterapp-9e0d1.appspot.com",
    messagingSenderId: "447351384372",
    appId: "1:447351384372:web:6f34496b3b230f25e75d61",
    measurementId: "G-V01T2H1M52"
}
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export var firestore = getFirestore(app)
export var firebase = getDatabase(app)
export var storage = getStorage(app)
export var auth = getAuth(app)