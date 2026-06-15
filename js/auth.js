import {
auth,
signInWithEmailAndPassword,
setPersistence,
browserSessionPersistence
}
from "./firebase.js";
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

await setPersistence(
auth,
browserSessionPersistence
);

import {
signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.loginAdmin =
async()=>{

const email =
document.getElementById(
"email"
).value;

const password =
document.getElementById(
"password"
).value;

const status =
document.getElementById(
"loginStatus"
);

if(!email || !password){

status.innerText =
"Fill all fields";

return;

}

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

status.style.color =
"#22c55e";

status.innerText =
"Login Success";

setTimeout(()=>{

window.location.href =
"dashboard.html";

},1000);

}catch(error){

status.innerText =
"Invalid Email or Password";

}

};
