import { db }
from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc
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

const totalWithdraw =
document.getElementById(
"totalWithdraw"
);

const totalRefer =
document.getElementById(
"totalRefer"
);

const totalEarn =
document.getElementById(
"totalEarn"
);

const activeUsers =
document.getElementById(
"activeUsers"
);

const inactiveUsers =
document.getElementById(
"inactiveUsers"
);

const snap =
await getDocs(
collection(db,"users")
);

let html = "";

let total = 0;

let coin = 0;

let withdraw = 0;

let refer = 0;

let earn = 0;

let activeCount = 0;

let inactiveCount = 0;

snap.forEach((docSnap)=>{

const data =
docSnap.data();

total++;

coin +=
data.coin || 0;

withdraw +=
data.withdraw || 0;

refer +=
data.refer || 0;

earn +=
data.dailyEarn || 0;

const lastActive =
data.lastActive || 0;

const inactive =
(Date.now() - lastActive)
>
(30 * 60 * 60 * 1000);

if(inactive){

inactiveCount++;

}else{

activeCount++;

}

html += `

<div class="user-card">

<div class="user-left">

<img
onclick="openPreview('${data.photo}')"
class="user-photo"
src="${data.photo}"
>

<div>

<div class="user-name">
${data.username || "Unknown"}
</div>

<div class="user-uid">
UID: ${data.id}
</div>

</div>

</div>

<div class="user-stats">

<div class="stat-box">
Coin: ${data.coin || 0}
</div>

<div class="stat-box">
Refer: ${data.refer || 0}
</div>

<div class="stat-box">
Withdraw: ${data.withdraw || 0}
</div>

<div class="stat-box">
${inactive ? "Inactive" : "Active"}
</div>

</div>

<div class="user-actions">

<div
class="menu-dot"
onclick="toggleMenu('${data.id}')"
>
⋮
</div>

<div
id="menu-${data.id}"
class="action-menu"
>

<button
class="ban-user"
onclick="banUser('${data.id}')"
>
Ban
</button>

<button
class="unban-user"
onclick="unbanUser('${data.id}')"
>
Unban
</button>

</div>

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

totalWithdraw.innerText =
withdraw;

totalRefer.innerText =
refer;

totalEarn.innerText =
earn;

activeUsers.innerText =
activeCount;

inactiveUsers.innerText =
inactiveCount;

}

loadUsers();

/* ========================= */
/* SEARCH USER */
/* ========================= */

window.searchUser =()=>{

const input =
document.getElementById(
"searchInput"
).value.toLowerCase();

const cards =
document.querySelectorAll(
".user-card"
);

cards.forEach((card)=>{

const text =
card.innerText.toLowerCase();

card.style.display =
text.includes(input)
?
"flex"
:
"none";

});

};

/* ========================= */
/* TOGGLE MENU */
/* ========================= */

window.toggleMenu =(id)=>{

const menu =
document.getElementById(
`menu-${id}`
);

menu.style.display =
menu.style.display === "flex"
?
"none"
:
"flex";

};

/* ========================= */
/* IMAGE PREVIEW */
/* ========================= */

window.openPreview =(src)=>{

document.getElementById(
"imagePreview"
).style.display = "flex";

document.getElementById(
"previewImg"
).src = src;

};

window.closePreview =()=>{

document.getElementById(
"imagePreview"
).style.display = "none";

};

/* ========================= */
/* BAN USER */
/* ========================= */

window.banUser =
async(id)=>{

await updateDoc(
doc(db,"users",id),
{
banned:true
}
);

alert("User Banned");

loadUsers();

};

/* ========================= */
/* UNBAN USER */
/* ========================= */

window.unbanUser =
async(id)=>{

await updateDoc(
doc(db,"users",id),
{
banned:false
}
);

alert("User Unbanned");

loadUsers();

};
