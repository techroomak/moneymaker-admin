import { db }
from "./firebase.js";

import {
collection,
doc,
updateDoc,
onSnapshot,
increment,
getDoc,
getDocs
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

const lifeTimeAds =
document.getElementById("lifeTimeAds");

const lifeTimeCoins =
document.getElementById("lifeTimeCoins");

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
let totalAdsCount = 0;
let totalEarnCount = 0;

snapshot.forEach((docSnap)=>{

const data =
docSnap.data();

total++;

coin += data.coin || 0;
totalAdsCount += data.totalAds || 0;
totalEarnCount += data.totalEarn || 0;
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
lifeTimeAds.innerText = totalAdsCount;
lifeTimeCoins.innerText = totalEarnCount;

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
/* TASK DATA */
/* ========================= */

let dailyTasks = {};
let socialTasks = {};

/* ========================= */
/* SETTINGS */
/* ========================= */

const settingsRef =
doc(db,"settings","app");

const saveBtn =
document.getElementById(
"saveSettingsBtn"
);

async function loadSettings(){

const snap =
await getDoc(settingsRef);

if(!snap.exists()) return;

const data =
snap.data();

dailyTasks =
data.dailyTasks || {};

socialTasks =
data.socialTasks || {};
/* REWARDS */

document.getElementById("ad1Reward").value =
data.ad1Reward || 0;

document.getElementById("ad2Reward").value =
data.ad2Reward || 0;

document.getElementById("ad3Reward").value =
data.ad3Reward || 0;

document.getElementById("ad4Reward").value =
data.ad4Reward || 0;

document.getElementById("registrationBonus").value =
data.registrationBonus || 5;

document.getElementById("referBonus").value =
data.referBonus || 10;

document.getElementById("coinRate").value =
data.coinRate || 10;
/* ADS */

document.getElementById("ad1Limit").value =
data.ad1Limit || 25;

document.getElementById("ad2Limit").value =
data.ad2Limit || 20;

document.getElementById("ad3Limit").value =
data.ad3Limit || 15;

document.getElementById("ad4Limit").value =
data.ad4Limit || 10;

document.getElementById("ads").value =
String(data.ads);

/* ads zone */

document.getElementById("ad1Zone").value =
data.ad1Zone || "";

document.getElementById("ad2Zone").value =
data.ad2Zone || "";

document.getElementById("ad3Zone").value =
data.ad3Zone || "";

document.getElementById("ad4Zone").value =
data.ad4Zone || "";

/* WITHDRAW */

document.getElementById("minWithdrawCoin").value =
data.minWithdrawCoin || 1000;

document.getElementById("minReferForWithdraw").value =
data.minReferForWithdraw || 5;

document.getElementById("minWithdraw").value =
data.minWithdraw || 500;

document.getElementById("maxWithdraw").value =
data.maxWithdraw || 1000;

document.getElementById("rechargeMin").value =
data.rechargeMin || 20;

document.getElementById("rechargeMax").value =
data.rechargeMax || 100;

document.getElementById("dailyWithdrawLimit").value =
data.dailyWithdrawLimit || 3;

document.getElementById("withdraw").value =
String(data.withdraw);

/* SYSTEM */

document.getElementById("maintenance").value =
String(data.maintenance);

document.getElementById("dailyTask").value =
String(data.dailyTask);

document.getElementById("socialTask").value =
String(data.socialTask);

/* NOTICE */

document.getElementById("notice").value =
data.notice || "";

/* task edit */
for(let i=1;i<=6;i++){

const dTask =
dailyTasks[`task${i}`];

if(
document.getElementById(
`dailyTask${i}Enabled`
)
){
document.getElementById(
`dailyTask${i}Enabled`
).checked =
dTask?.enabled ?? true;
}

if(
dTask &&
document.getElementById(`dailyTask${i}Name`)
){

document.getElementById(
`dailyTask${i}Name`
).innerText =
dTask.name || `Task ${i}`;

}

const sTask =
socialTasks[`task${i}`];

if(
document.getElementById(
`socialTask${i}Enabled`
)
){
document.getElementById(
`socialTask${i}Enabled`
).checked =
sTask?.enabled ?? true;
}

if(
sTask &&
document.getElementById(`socialTask${i}Name`)
){

document.getElementById(
`socialTask${i}Name`
).innerText =
sTask.name || `Social ${i}`;

}
}
}

loadSettings();

/* auto save task */
document
.querySelectorAll(
'[id^="dailyTask"][id$="Enabled"],[id^="socialTask"][id$="Enabled"]'
)
.forEach(el=>{

el.addEventListener("change", async()=>{

const id =
el.id.match(/\d+/)?.[0];

if(!id) return;

if(el.id.startsWith("daily")){

dailyTasks[`task${id}`] = {
...(dailyTasks[`task${id}`] || {}),
enabled: el.checked
};

}else{

socialTasks[`task${id}`] = {
...(socialTasks[`task${id}`] || {}),
enabled: el.checked
};

}

await updateDoc(settingsRef,{
dailyTasks,
socialTasks
});

});

});

/* ========================= */
/* CHANGE DETECT */
/* ========================= */

document
.querySelectorAll(
"#settingsSection input, #settingsSection textarea, #settingsSection select"
)
.forEach((field)=>{

field.addEventListener("input",enableSave);

field.addEventListener("change",enableSave);

});

function enableSave(){

saveBtn.disabled = false;

saveBtn.classList.remove(
"disabled-save"
);

saveBtn.classList.add(
"active-save"
);

saveBtn.innerHTML =
"💾 Save Changes";

}

/* ========================= */
/* SAVE SETTINGS */
/* ========================= */

window.saveSettings =
async()=>{

try{

saveBtn.innerHTML =
"⏳ Saving...";

saveBtn.disabled = true;

await updateDoc(settingsRef,{

/* REWARDS */

ad1Reward:Number(
document.getElementById("ad1Reward").value
),

ad2Reward:Number(
document.getElementById("ad2Reward").value
),

ad3Reward:Number(
document.getElementById("ad3Reward").value
),

ad4Reward:Number(
document.getElementById("ad4Reward").value
),

registrationBonus:Number(
document.getElementById("registrationBonus").value
),

coinRate:Number(
document.getElementById("coinRate").value
),

referBonus:Number(
document.getElementById("referBonus").value
),

/* ADS */

ad1Limit:Number(
document.getElementById("ad1Limit").value
),

ad2Limit:Number(
document.getElementById("ad2Limit").value
),

ad3Limit:Number(
document.getElementById("ad3Limit").value
),

ad4Limit:Number(
document.getElementById("ad4Limit").value
),

ads:
document.getElementById("ads").value === "true",
/* Ads Zone ID */

ad1Zone:
document.getElementById("ad1Zone").value,

ad2Zone:
document.getElementById("ad2Zone").value,

ad3Zone:
document.getElementById("ad3Zone").value,

ad4Zone:
document.getElementById("ad4Zone").value,

/* WITHDRAW */

minWithdrawCoin:Number(
document.getElementById("minWithdrawCoin").value
),

minReferForWithdraw:Number(
document.getElementById("minReferForWithdraw").value
),

minWithdraw:Number(
document.getElementById("minWithdraw").value
),

maxWithdraw:Number(
document.getElementById("maxWithdraw").value
),

rechargeMin:Number(
document.getElementById("rechargeMin").value
),

rechargeMax:Number(
document.getElementById("rechargeMax").value
),

dailyWithdrawLimit:Number(
document.getElementById("dailyWithdrawLimit").value
),

withdraw:
document.getElementById("withdraw").value === "true",

/* SYSTEM */

maintenance:
document.getElementById("maintenance").value === "true",

dailyTask:
document.getElementById("dailyTask").value === "true",

socialTask:
document.getElementById("socialTask").value === "true",

/* NOTICE */

notice:
document.getElementById("notice").value,
dailyTasks,
socialTasks
});



saveBtn.innerHTML =
"✅ Saved";

saveBtn.classList.remove(
"active-save"
);

saveBtn.classList.add(
"disabled-save"
);

setTimeout(()=>{

saveBtn.innerHTML =
"💾 Save Settings";

},2000);

}catch(err){

console.error(err);

saveBtn.disabled = false;

saveBtn.innerHTML =
"❌ Error";

}

};

/* ========================= */
/* TASK MODAL */
/* ========================= */

let currentTaskType = "";
let currentTaskId = 0;

const taskSaveBtn =
document.getElementById(
"saveTaskBtn"
);

function enableTaskSave(){

taskSaveBtn.disabled = false;

taskSaveBtn.innerHTML =
"💾 Save Task";

}

window.editDailyTask = (id)=>{

currentTaskType = "daily";
currentTaskId = id;

document.getElementById(
"taskModal"
).style.display = "flex";

document.getElementById(
"taskModalTitle"
).innerText =
`Daily Task ${id}`;

document.getElementById(
"dailyTaskFields"
).style.display = "block";

document.getElementById(
"socialTaskFields"
).style.display = "none";

const task =
dailyTasks[`task${id}`] || {};

document.getElementById("taskName").value =
task.name || "";

document.getElementById(
"taskLink1"
).value =
task.links?.[0] || "";

document.getElementById(
"taskLink2"
).value =
task.links?.[1] || "";

document.getElementById(
"taskLink3"
).value =
task.links?.[2] || "";

document.getElementById(
"taskLink4"
).value =
task.links?.[3] || "";

document.getElementById(
"taskLink5"
).value =
task.links?.[4] || "";

document.getElementById(
"taskDailyLimit"
).value =
task.dailyLimit || 1;

document.getElementById("taskReward").value =
task.reward || 0;

document.getElementById("taskLogo").value =
"";

document
.querySelectorAll(
"#taskModal input"
)
.forEach((input)=>{

input.oninput =
enableTaskSave;

});

};

window.editSocialTask = (id)=>{

currentTaskType = "social";
currentTaskId = id;

document.getElementById(
"taskModal"
).style.display = "flex";

document.getElementById(
"taskModalTitle"
).innerText =
`Social Task ${id}`;

document.getElementById(
"dailyTaskFields"
).style.display = "none";

document.getElementById(
"socialTaskFields"
).style.display = "block";

const task =
socialTasks[`task${id}`] || {};

document.getElementById("taskName").value =
task.name || "";

document.getElementById("taskLink").value =
task.link || "";

document.getElementById("taskReward").value =
task.reward || 0;

document.getElementById("taskLogo").value =
task.logo || "";

document.getElementById(
"taskType"
).value =
task.type || "timer";

document.getElementById(
"taskChatId"
).value =
task.chatId || "";

document.getElementById(
"taskWait"
).value =
task.wait || 60;
  
document
.querySelectorAll(
"#taskModal input"
)
.forEach((input)=>{

input.oninput =
enableTaskSave;

});

};

window.saveTaskModal = async()=>{

if(currentTaskType==="daily"){

dailyTasks[`task${currentTaskId}`]={

name:
document.getElementById(
"taskName"
).value,

reward:Number(
document.getElementById(
"taskReward"
).value
),

dailyLimit:Number(
document.getElementById(
"taskDailyLimit"
).value
),

links:[

document.getElementById(
"taskLink1"
).value,

document.getElementById(
"taskLink2"
).value,

document.getElementById(
"taskLink3"
).value,

document.getElementById(
"taskLink4"
).value,

document.getElementById(
"taskLink5"
).value

].filter(Boolean),

enabled:
document.getElementById(
`dailyTask${currentTaskId}Enabled`
).checked

};

if(
document.getElementById(
`dailyTask${currentTaskId}Name`
)
){
document.getElementById(
`dailyTask${currentTaskId}Name`
).innerText =
document.getElementById(
"taskName"
).value;
}

}else{

const oldTask =
socialTasks[`task${currentTaskId}`] || {};

socialTasks[`task${currentTaskId}`]={

name:
document.getElementById("taskName").value,

link:
document.getElementById("taskLink").value,

logo:
document.getElementById("taskLogo").value,

reward:Number(
document.getElementById("taskReward").value
),

type:
document.getElementById("taskType").value,

chatId:
document.getElementById("taskChatId").value,

wait:Number(
document.getElementById("taskWait").value
),

enabled:
document.getElementById(
`socialTask${currentTaskId}Enabled`
).checked,

version:
oldTask.version || 1

};

if(
document.getElementById(
`socialTask${currentTaskId}Name`
)
){
document.getElementById(
`socialTask${currentTaskId}Name`
).innerText =
document.getElementById(
"taskName"
).value;
}

}

if(
document.getElementById(
`socialTask${currentTaskId}Name`
)
){
document.getElementById(
`socialTask${currentTaskId}Name`
).innerText =
document.getElementById(
"taskName"
).value;
}

taskSaveBtn.disabled = true;

taskSaveBtn.innerHTML =
"✅ Saved";

try{

await updateDoc(settingsRef,{
dailyTasks,
socialTasks
});

taskSaveBtn.disabled = true;

taskSaveBtn.innerHTML =
"✅ Saved";

document.getElementById(
"taskModal"
).style.display = "none";

}catch(err){

console.error(err);

taskSaveBtn.innerHTML =
"❌ Error";

}
};
window.closeTaskModal = ()=>{

document.getElementById(
"taskModal"
).style.display = "none";

};


window.fixTotalEarn = async()=>{

if(
!confirm(
"Set Total Earn = Current Coin for all users?"
)
) return;

const snap =
await getDocs(
collection(db,"users")
);

let updated = 0;

for(const userDoc of snap.docs){

const data = userDoc.data();

await updateDoc(
doc(db,"users",userDoc.id),
{
totalEarn:data.coin || 0
}
);

updated++;

}

alert(`${updated} users updated`);

};
