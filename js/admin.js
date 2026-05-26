import { db }
from "./firebase.js";

import {
collection,
doc,
updateDoc,
onSnapshot,
increment
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ========================= */
/* ELEMENTS */
/* ========================= */

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

const pendingWithdraw =
document.getElementById(
"pendingWithdraw"
);

const activeUsers =
document.getElementById(
"activeUsers"
);

const inactiveUsers =
document.getElementById(
"inactiveUsers"
);

const onlineUsers =
document.getElementById(
"onlineUsers"
);

const withdrawList =
document.getElementById(
"withdrawList"
);

/* ========================= */
/* SECTION SYSTEM */
/* ========================= */

window.showSection =(sectionId)=>{

const sections =
document.querySelectorAll(
".content-section"
);

sections.forEach((section)=>{

section.classList.remove(
"active-section"
);

});

document.getElementById(
sectionId
).classList.add(
"active-section"
);

/* ACTIVE BUTTON */

const buttons =
document.querySelectorAll(
".menu-btn"
);

buttons.forEach((btn)=>{

btn.classList.remove(
"active-btn"
);

});

event.target.classList.add(
"active-btn"
);

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
/* MENU */
/* ========================= */

window.toggleMenu =(id)=>{

const menus =
document.querySelectorAll(
".action-menu"
);

menus.forEach((menu)=>{

if(menu.id !== `menu-${id}`){

menu.style.display =
"none";

}

});

const current =
document.getElementById(
`menu-${id}`
);

current.style.display =
current.style.display === "flex"
?
"none"
:
"flex";

};

/* ========================= */
/* LOAD USERS */
/* ========================= */

onSnapshot(
collection(db,"users"),
(snapshot)=>{

let html = "";

let total = 0;

let coin = 0;

let withdraw = 0;

let active = 0;

let inactive = 0;

let online = 0;

snapshot.forEach((docSnap)=>{

const data =
docSnap.data();

total++;

coin +=
data.coin || 0;

withdraw +=
data.withdraw || 0;

const lastActive =
data.lastActive || 0;

/* INACTIVE */

const isInactive =
(Date.now() - lastActive)
>
(30 * 60 * 60 * 1000);

/* ONLINE */

const isOnline =
(Date.now() - lastActive)
<
(60 * 1000);

if(isInactive){

inactive++;

}else{

active++;

}

if(isOnline){

online++;

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

<div class="stat-box
${

isOnline
?
"active-status"
:
isInactive
?
"inactive-status"
:
"offline-status"

}
">

${

isOnline
?
"Online"
:
isInactive
?
"Inactive"
:
"Offline"

}

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
class="${data.banned ? "unban-user" : "ban-user"}"
onclick="
${data.banned
?
`unbanUser('${data.id}')`
:
`banUser('${data.id}')`
}
"
>

${data.banned ? "Unban User" : "Ban User"}

</button>

</div>

</div>

</div>

`;

});

/* UPDATE DASHBOARD */

userList.innerHTML =
html;

totalUsers.innerText =
total;

totalCoin.innerText =
coin;

totalWithdraw.innerText =
withdraw;

activeUsers.innerText =
active;

inactiveUsers.innerText =
inactive;

onlineUsers.innerText =
online;

}
);

/* ========================= */
/* SEARCH */
/* ========================= */

window.searchUser =()=>{

const value =
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
text.includes(value)
?
"grid"
:
"none";

});

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

};

/* ========================= */
/* LOAD WITHDRAWS */
/* ========================= */

onSnapshot(
collection(db,"withdraws"),
(snapshot)=>{

if(!withdrawList) return;

let html = "";

let pending = 0;

snapshot.forEach((docSnap)=>{

const data =
docSnap.data();

if(data.status === "Pending"){

pending++;

}

html += `

<div class="withdraw-card">

<div class="withdraw-user">

<img
class="withdraw-photo"
src="https://telegram.org/img/t_logo.png"
>

<div>

<div class="withdraw-name">
${data.username}
</div>

<div class="withdraw-uid">
UID: ${data.userId}
</div>

</div>

</div>

<div>
${data.coin} Coin
</div>

<div>
${data.amount} Tk
</div>

<div>
${data.accountNumber}
</div>

<div>
${data.method}
</div>

<div>

<div class="withdraw-badge
${

data.status === "Success"
?
"success-badge"

:

data.status === "Cancelled"
?
"cancel-badge"

:

data.status === "Hold"
?
"hold-badge"

:

"pending-badge"

}
">

${data.status}

</div>

</div>

<div class="user-actions">

<div
class="menu-dot"
onclick="toggleMenu('withdraw-${docSnap.id}')"
>
⋮
</div>

<div
id="menu-withdraw-${docSnap.id}"
class="action-menu"
>

<button
class="approve-btn"
onclick="
approveWithdraw(
'${docSnap.id}',
'${data.userId}',
${data.coin},
${data.amount}
)
"
>
Approve
</button>

<button
class="cancel-btn"
onclick="
cancelWithdraw(
'${docSnap.id}',
'${data.userId}',
${data.coin}
)
"
>
Cancel
</button>

<button
class="hold-btn"
onclick="
holdWithdraw(
'${docSnap.id}'
)
"
>
Hold
</button>

</div>

</div>

</div>

`;

});

withdrawList.innerHTML =
html;

pendingWithdraw.innerText =
pending;

}
);

/* ========================= */
/* APPROVE */
/* ========================= */

window.approveWithdraw =
async(id,userId,coin,amount)=>{

await updateDoc(
doc(db,"withdraws",id),
{
status:"Success"
}
);

await updateDoc(
doc(db,"users",String(userId)),
{
withdraw:increment(amount)
}
);

};

/* ========================= */
/* CANCEL */
/* ========================= */

window.cancelWithdraw =
async(id,userId,coin)=>{

await updateDoc(
doc(db,"withdraws",id),
{
status:"Cancelled"
}
);

await updateDoc(
doc(db,"users",String(userId)),
{
coin:increment(coin)
}
);

};

/* ========================= */
/* HOLD */
/* ========================= */

window.holdWithdraw =
async(id)=>{

await updateDoc(
doc(db,"withdraws",id),
{
status:"Hold"
}
);

};
