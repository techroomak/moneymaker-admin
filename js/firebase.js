import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

apiKey:"YOUR_API_KEY",

authDomain:
"moneymaker-bd.firebaseapp.com",

projectId:
"moneymaker-bd",

storageBucket:
"moneymaker-bd.appspot.com",

messagingSenderId:"",

appId:""

};

const app =
initializeApp(firebaseConfig);

export const auth =
getAuth(app);

export const db =
getFirestore(app);
