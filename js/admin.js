import { db }
from "./firebase.js";

import {
collection,
doc,
updateDoc,
onSnapshot,
increment,
getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ELEMENTS */

const userList =
document.getElementById("userList");

const withdrawList =
document.getElementById("withdrawList");

const totalUsers =
document.getElementById("totalUsers");

const totalCoin =
document.getElementById("totalCoin");

const totalWithdraw =
document.getElementById("totalWithdraw");

const pendingWithdraw =
document.getElementById("pendingWithdraw");

const activeUsers =
document.getElementById("activeUsers");

const inactiveUsers =
document.getElementById("inactiveUsers");

const onlineUsers =
document.getElementById("onlineUsers");

/* SECTION */

window.showSection =(sectionId)=>{

document
.querySelectorAll(".content-section")
.forEach((section)=>{

section.classList.remove(
"active-section"
);

});

document
.getElementById(sectionId)
.classList.add(
"active-section"
);

document
.querySelectorAll(".menu-btn")
.forEach((btn)=>{

btn.classList.remove(
"active-btn"
);

});

if(sectionId==="dashboardSection"){
document.querySelectorAll(".menu-btn")[0].classList.add("active-btn");
}

if(sectionId==="usersSection"){
document.querySelectorAll(".menu-btn")[1].classList.add("active-btn");
}

if(sectionId==="withdrawSection"){
document.querySelectorAll(".menu-btn")[2].classList.add("active-btn");
}

};

/* IMAGE */

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

/* MENU */

window.toggleMenu =(id)=>{

document
.querySelectorAll(".action-menu")
.forEach((menu)=>{

if(menu.id !== `menu-${id}`){

menu.style.display = "none";

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

/* USERS */

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

coin += data.coin || 0;

withdraw += data.withdraw || 0;

const lastActive =
data.lastActive || 0;

const isInactive =
(Date.now() - lastActive)
>
(30 * 60 * 60 * 1000);

const isOnline =
(Date.now() - lastActive)
<
10000;

if(isInactive){

inactive++;

}else{

active++;

}

if(isOnline){

online++;

}

const statusText =

data.banned
?
"Banned"

:

isOnline
?
"Online"

:

isInactive
?
"Inactive"

:
"Offline";

html += `

<div
class="user-card"
data-lastactive="${lastActive}"
>

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
UID: ${docSnap.id}
</div>

</div>

</div>

<div class="stat-box">
${data.coin || 0}
</div>

<div class="stat-box">
${data.withdraw || 0}
</div>

<div class="stat-box">
${data.refer || 0}
</div>

<div class="live-status
${

data.banned
?
"banned-status"

:

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
${statusText}
</div>

<div class="stat-box">

${
lastActive
?
new Date(lastActive)
.toLocaleDateString()

+

"\n"

+

new Date(lastActive)
.toLocaleTimeString()

:
"Never"
}

</div>

<div class="stat-box">
${data.pending || 0}
</div>

<div class="stat-box">
${data.totalAds || 0}
</div>

<div class="stat-box">
${data.dailyAds || 0}
</div>

<div class="stat-box">
${data.socialDone ? "Done" : "Pending"}
</div>

<div class="stat-box">
${data.dailyDone ? "Done" : "Pending"}
</div>

<div class="user-actions">

<div
class="menu-dot"
onclick="toggleMenu('${docSnap.id}')"
>
⋮
</div>

<div
id="menu-${docSnap.id}"
class="action-menu"
>

<button
class="${data.banned ? "unban-user" : "ban-user"}"
onclick="
${data.banned
?
`unbanUser('${docSnap.id}')`
:
`banUser('${docSnap.id}')`
}
"
>

${data.banned ? "Unban User" : "Ban User"}

</button>

<button
class="approve-btn"
onclick="
editCoin(
'${docSnap.id}',
${data.coin || 0}
)
"
>
Edit Coin
</button>

</div>

</div>

</div>

`;

});

userList.innerHTML = html;

totalUsers.innerText = total;

totalCoin.innerText = coin;

totalWithdraw.innerText = withdraw;

activeUsers.innerText = active;

inactiveUsers.innerText = inactive;

onlineUsers.innerText = online;

}
);

/* SEARCH */

window.searchUser =()=>{

const value =
document.getElementById(
"searchInput"
).value.toLowerCase();

document
.querySelectorAll(".user-card")
.forEach((card)=>{

card.style.display =

card.innerText
.toLowerCase()
.includes(value)

?
"grid"

:
"none";

});

};

/* BAN */

window.banUser =
async(id)=>{

await updateDoc(
doc(db,"users",id),
{
banned:true
}
);

};

/* UNBAN */

window.unbanUser =
async(id)=>{

await updateDoc(
doc(db,"users",id),
{
banned:false
}
);

};

/* EDIT COIN */

window.editCoin =
async(id,currentCoin)=>{

const value =
prompt(
"Enter New Coin",
currentCoin
);

if(value===null) return;

await updateDoc(
doc(db,"users",id),
{
coin:Number(value)
}
);

};

/* WITHDRAW */

onSnapshot(
collection(db,"withdraws"),
(snapshot)=>{

if(!withdrawList) return;

let html = "";

let pending = 0;

snapshot.forEach((docSnap)=>{

const data =
docSnap.data();

if(data.status==="Pending"){

pending++;

}

html += `

<div class="withdraw-card">

<div class="withdraw-user">

<img
class="withdraw-photo"
src="${
data.photo ||
'https://telegram.org/img/t_logo.png'
}"
>

<div>

<div class="withdraw-name">
${data.username || "Unknown"}
</div>

<div class="withdraw-uid">
UID: ${data.userId || "Unknown"}
</div>

</div>

</div>

<div>
${data.coin || 0}
</div>

<div>
${data.amount || 0} Tk
</div>

<div>
${data.accountName || "No Name"}
</div>

<div>
${data.accountNumber || "No Number"}
</div>

<div>
${data.method || "N/A"}
</div>

<div>
${
data.createdAt
?
new Date(data.createdAt)
.toLocaleDateString()

+
"<br>"

+
new Date(data.createdAt)
.toLocaleTimeString()

:
""
}
</div>

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

withdrawList.innerHTML = html;

pendingWithdraw.innerText = pending;

}
);

/* APPROVE */

window.approveWithdraw =
async(id,userId,amount)=>{

await updateDoc(
doc(db,"withdraws",id),
{
status:"Success"
}
);

await updateDoc(
doc(db,"users",String(userId)),
{
withdraw:increment(amount),
pending:increment(-1)
}
);

};

/* CANCEL */

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
coin:increment(coin),
pending:increment(-1)
}
);

};

/* HOLD */

window.holdWithdraw =
async(id)=>{

await updateDoc(
doc(db,"withdraws",id),
{
status:"Hold"
}
);

};

setInterval(()=>{

document
.querySelectorAll(".user-card")
.forEach((card)=>{

const lastActive =
Number(card.dataset.lastactive);

const status =
card.querySelector(".live-status");

if(!status) return;

/* BANNED SKIP */

if(
status.classList.contains("banned-status")
){
return;
}

const isInactive =
(Date.now() - lastActive)
>
(30 * 60 * 60 * 1000);

const isOnline =
(Date.now() - lastActive)
<
7000;

/* REMOVE OLD CLASS */

status.classList.remove(
"active-status",
"offline-status",
"inactive-status"
);

/* APPLY */

if(isInactive){

status.innerText =
"Inactive";

status.classList.add(
"inactive-status"
);

}

else if(isOnline){

status.innerText =
"Online";

status.classList.add(
"active-status"
);

}

else{

status.innerText =
"Offline";

status.classList.add(
"offline-status"
);

}

});

},2000);

/* ========================= */
/* SETTINGS */
/* ========================= */

const settingsRef =
doc(db,"settings","app");

async function loadSettings(){

const snap =
await getDoc(settingsRef);

const data =
snap.data();

if(!data) return;

document.getElementById("ad1Reward").value =
data.ad1Reward || 0;

document.getElementById("ad2Reward").value =
data.ad2Reward || 0;

document.getElementById("ad3Reward").value =
data.ad3Reward || 0;

document.getElementById("ad4Reward").value =
data.ad4Reward || 0;

document.getElementById("ad1Limit").value =
data.ad1Limit || 25;

document.getElementById("ad2Limit").value =
data.ad2Limit || 20;

document.getElementById("ad3Limit").value =
data.ad3Limit || 15;

document.getElementById("ad4Limit").value =
data.ad4Limit || 10;

document.getElementById("minWithdrawCoin").value =
data.minWithdrawCoin || 1000;

document.getElementById("minReferForWithdraw").value =
data.minReferForWithdraw || 5;

document.getElementById("minWithdraw").value =
data.minWithdraw || 500;

document.getElementById("maxWithdraw").value =
data.maxWithdraw || 1000;

document.getElementById("notice").value =
data.notice || "";

}

loadSettings();

