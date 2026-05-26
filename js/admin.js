import {
collection,
getDocs,
doc,
updateDoc,
onSnapshot
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

const onlineUsers =
document.getElementById(
"onlineUsers"
);

onSnapshot(
collection(db,"users"),
(snapshot)=>{

let html = "";

let total = 0;

let coin = 0;

let withdraw = 0;

let refer = 0;

let earn = 0;

let activeCount = 0;

let inactiveCount = 0;

let onlineCount = 0;

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
data.lastActive ||
Date.now();

const inactive =
(Date.now() - lastActive)
>
(30 * 60 * 60 * 1000);

if(inactive){

inactiveCount++;

}else{

activeCount++;

}
const online =
(Date.now() - lastActive)
<
(60 * 1000);

if(online){

onlineCount++;

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
${inactive ? "inactive-status" : "active-status"}">

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

<button
class="${inactive ? "unban-user" : "ban-user"}"
>

${inactive ? "Inactive" : "Active"}

</button>

</div>

</div>

</div>

`;

});

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

onlineUsers.innerText =
onlineCount;

}
);

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

wwindow.toggleMenu =(id)=>{

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
/* LOAD WITHDRAWS */
/* ========================= */

async function loadWithdraws(){

const withdrawList =
document.getElementById(
"withdrawList"
);

if(!withdrawList) return;

withdrawList.innerHTML = "";

onSnapshot(
collection(db,"withdraws"),
(snapshot)=>{

withdrawList.innerHTML = "";

let html = "";

let pending = 0;

snapshot.forEach((docSnap)=>{

const data =
docSnap.data();

if(data.status === "Pending"){

pending++;

}

let html = "";

let pending = 0;

snap.forEach((docSnap)=>{

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
src="${
data.photo ||
'https://telegram.org/img/t_logo.png'
}"
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
${data.amount} Tk
</div>

<div>
${data.coin} Coin
</div>

<div>
${data.method}
</div>

<div>
${data.accountNumber}
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

<div class="withdraw-actions">

<button
class="approve-btn"
onclick="
approveWithdraw(
'${docSnap.id}'
)
"
>
Approve
</button>

<button
class="cancel-btn"
onclick="
cancelWithdraw(
'${docSnap.id}'
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

const pendingEl =
document.getElementById(
"pendingWithdraw"
);

if(pendingEl){

pendingEl.innerText =
pending;

}

}

loadWithdraws();

/* ========================= */
/* APPROVE */
/* ========================= */

window.approveWithdraw =
async(id)=>{

await updateDoc(
doc(db,"withdraws",id),
{
status:"Success"
}
);

loadWithdraws();

alert("Withdraw Approved");

};

/* ========================= */
/* CANCEL */
/* ========================= */

window.cancelWithdraw =
async(id)=>{

await updateDoc(
doc(db,"withdraws",id),
{
status:"Cancelled"
}
);

loadWithdraws();

alert("Withdraw Cancelled");

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

loadWithdraws();

alert("Withdraw Hold");

});

withdrawList.innerHTML =
html;

const pendingEl =
document.getElementById(
"pendingWithdraw"
);

if(pendingEl){

pendingEl.innerText =
pending;

}

}
);
