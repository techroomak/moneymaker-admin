import { db }
from "./firebase.js";

import {
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadUsers(){

const userList =
document.getElementById(
"userList"
);

const totalUsers =
document.getElementById(
"totalUsers"
);

const totalCoin =
document.getElementById(
"totalCoin"
);

const snap =
await getDocs(
collection(db,"users")
);

let html = "";

let total = 0;

let coin = 0;

snap.forEach((doc)=>{

const data =
doc.data();

total++;

coin +=
data.coin || 0;

html += `

<div class="user-card">

<img
class="user-photo"
src="${data.photo}"
>

<div>

<h3>
${data.username}
</h3>

<p>
UID: ${data.id}
</p>

<p>
Coin: ${data.coin || 0}
</p>

</div>

</div>

`;

});

userList.innerHTML =
html;

totalUsers.innerText =
total;

totalCoin.innerText =
coin;

}

loadUsers();
