
//#region  url area
const API_URL_GUILD = (id) =>  `https://localhost:7124/Guild/${id}`;
const API_URL_USERS =  'https://localhost:7124/Users';
const API_URL_CHATS = `https://localhost:7124/Chat/Guild`;
const API_URL_USER = (id) => `https://localhost:7124/Users/${id}`;
const API_URL_CHAT_SAVE = `https://localhost:7124/Chat`;
const API_URL_GUILD_REQUEST = `https://localhost:7124/Guild/RequestGuild`;
const API_URL_GUILD_REQUEST_LIST = (id) => `https://localhost:7124/Guild/Request/${id}`;
const API_URL_GUILD_PARTICIPANTS = (id) => `https://localhost:7124/Guild/Participants/${id}`;
const API_URL_FRIENDS = (id) => `https://localhost:7124/Friend/${id}`;
const API_URL_CHAT = (id) => `https://localhost:7124/Chat/${id}`;
const API_URL_USERS_CHAT = (id) => `https://localhost:7124/Chat/Users/${id}`;
//#endregion

let arrayFriendsToInvite = [];
let arrayParticipantsToChat = [];

async function LoadChats() {
    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("idGuild");
    const profile = await GetProfile();
    const profileData = await profile.json();
    console.log('e'+id);
    const res = await fetch(API_URL_CHATS, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                "idGuild": id,
                "idUser": profileData.id,
            }
        ),
    });
    const data = await res.json();
    console.log(res);
    console.log(res.status);   
    if(res.status === 401)
    {   
        window.location.href = "./../index.html";
    } else if (res.status !== 200) {
        console.log(data);
        
        console.log(res.status)
    } else {
        // const section = document.getElementById('chatsList')
        const chatList = document.getElementById('chatsArea')

        chatList.innerHTML = "";
        

        data.forEach(chat => {
            // const a = document.createElement("a");
            const div = document.createElement("div");
            const h5 = document.createElement("h5");
            const small = document.createElement("small");
            const p = document.createElement("p");
            const chatName = document.createTextNode(chat.name);
            const chatTitleText = document.createTextNode(chat.name);
            const lastMessage = document.createTextNode("5 min");
            const message = document.createTextNode("by the moment not have a message");
            const quantityMessages = document.createTextNode("1");
            const messagesWithoutRead = document.createElement("span");

            div.className += 'd-flex w-100 justify-content-between';

            p.className += 'mb-0';

            h5.className += 'mb-1';

            small.className += 'text-muted';


            messagesWithoutRead.appendChild(quantityMessages);
            messagesWithoutRead.className += 'badge bg-primary rounded-pill';

            h5.appendChild(chatName);
            small.appendChild(lastMessage);
            p.appendChild(message);
            div.appendChild(h5);
            div.appendChild(small);
            
            chatList.innerHTML += `<a class="list-group-item list-group-item-action chatSelector" aria-current="true" id="chat-selector-${chat.id}" data-id="${chat.id}" onCLick="changeSelection(this)">
                                    </a>`

            const a = document.getElementById(`chat-selector-${chat.id}`);
            a.appendChild(div);
            a.appendChild(p);
        });
    }
}

async function SaveChat() {


    const users = document.getElementsByClassName("active participantsForChatList");
    for (const user of users) {

        const idUser = user.getAttribute("data-id")
        const name = document.getElementById('chatName');
        const token = sessionStorage.getItem("token")
        const idGuild = sessionStorage.getItem('idGuild');
        console.log(token);
        const res = await fetch(API_URL_CHAT_SAVE, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    "name": name.value,
                    "user_limit": users.length + 1,
                    "guild_id":  idGuild
                }
            ),
        });
        const data = await res.json();
        console.log(res);

        if (res.status !== 201) {
            spanError.innerHTML = 'Hubo un error: ' + res.status + data.message;
        } else {
            // console.log(res.json);
            //

            const myIdRes = await GetProfile();
            if (myIdRes.status !== 200) {
                console.log(myIdRes)
            }
            else{
                myUsrId = await myIdRes.json();
                RegistUsersChat(data.id, myUsrId.id);
            }
            RegistUsersChat(data.id, idUser);

            LoadChats();
        }
    }
}


async function RegistUsersChat(id, myIdRes) {
    const token = sessionStorage.getItem("token");
    console.log(myIdRes);
    const usrRes = await fetch(API_URL_USER(myIdRes), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    usrData = await usrRes.json();
    if (usrRes.status !== 200) {
        console.log(usrRes)
    }
    else{

        const associationRes = await fetch(API_URL_CHAT_SAVE + '/Users', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    "name": usrData.user_name,
                    "userid": usrData.id,
                    "chatid": id,
                }
            ),
        });

        const data = await associationRes.json();

        if (associationRes.status !== 201) {
            console.log(associationRes);
        } else {
            console.log(associationRes);
        }
        LoadChats();
    }
}



function changeSelection(element) {
    
    const chatTitleName = document.getElementById("titleChatWindow");
    chatTitleName.innerHTML = ""
    const chatSelectorList = document.getElementsByClassName("chatSelector");

    for (const chatSelector of chatSelectorList) {
        chatSelector.className = 'list-group-item list-group-item-action chatSelector';
    }

    element.className = 'list-group-item list-group-item-action chatSelector active';
    const id = element.getAttribute('data-id');
    GetChat(id);
}


async function GetChat(id) {
    const token = sessionStorage.getItem("token");
    const res = await fetch(API_URL_CHAT(id), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await res.json();
    console.log(res);
    console.log(res.status);    
    if (res.status !== 200) {
        spanError.innerHTML = 'Hubo un error: ' + res.status + data.message;
        if(res.status == 401)
        {   
            console.log("fuera");
            window.location.href = "./../index.html";
        }
        console.log(res.status)
    } else {
        const titleChat = document.getElementById("titleChatWindow");
        const title = document.createTextNode(data.name);
        
        titleChat.appendChild(title);
    }
}


async function LoadGuildData() {
    const token = sessionStorage.getItem("token");
    const idGuild = sessionStorage.getItem("idGuild");
    const res = await fetch(API_URL_GUILD(idGuild), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await res.json();
    console.log("en guild",res);
    console.log(res.status);    
    if (res.status !== 200) {
        console.log(data);
        if(res.status === 401)
        {   
            console.log("fuera");
            window.location.href = "./../index.html";
        }
        console.log(res.status)
    } else {
        const title = document.createTextNode(data.name);
        const navTitle = document.getElementById('titleNavbar');
        const owner = document.getElementById('ownerSection');
        const ownerName = document.createTextNode(data.owner)
        navTitle.innerHTML = "";
        navTitle.appendChild(title);
        // owner.innerHTML = '';
        owner.appendChild(ownerName);
    }
}


async function GetProfile() {
    const token = sessionStorage.getItem("token");
    const myIdRes = await fetch(API_URL_USERS + '/Me', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                "accessToken": token
            }
        )
    });
    console.log(myIdRes.status);
    if(myIdRes.status === 401 )
    {   
        // window.location.href = "./../index.html";
        console.log("si funciona pon aquí el login");
    }
    return myIdRes;
}


async function LoadProfile() {
    const myIdRes = await GetProfile();
    
    const scrollDownName = document.getElementById("navbarScrollingDropdown");
    const  profile = await myIdRes.json();
    const text = document.createTextNode(profile.user_name);
    scrollDownName.appendChild(text);
}

async function GetUsers() {
    const token = sessionStorage.getItem("token");
    const res = await fetch(API_URL_USERS, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await res.json();
    console.log(res);
    console.log(res.status);    
    if (res.status !== 200) {
        spanError.innerHTML = 'Hubo un error: ' + res.status + data.message;
        if(res.status == 401)
        {   
            window.location.href = "./../index.html";
        }
        console.log(res.status)
    } else {
        const userList = document.getElementById('userstogroup-list-group')
        const userListChat = document.getElementById('userstochat-list-group')

        userList.innerHTML = "";
        /**
         * ! tengo que verificar que funcione y cambiar de todos los usuarios a solo participantes
         */

        data.forEach(user => {
            
            // const achat = document.createElement("a");
            const agroup = document.createElement("a");
            const text = document.createTextNode(user.user_name);
            const text2 = document.createTextNode(user.user_name);
            console.log(text);
            
            // achat.className = 'list-group-item list-group-item-action usersChat';
            // achat.setAttribute("data-id", user.id);
            agroup.appendChild(text2);
            agroup.className = 'list-group-item list-group-item-action usersGroup';
            agroup.setAttribute("data-id", user.id);
            userList.appendChild(agroup);
            // userListChat.appendChild(achat);
            userListChat.innerHTML += `<a id="user-selector-${user.user_name}" aria-current="true" class="list-group-item list-group-item-action usersChatList" data-id="${user.id}" onClick="SelectUserchat(this)">${user.user_name}</a>`;
            // const achat = document.getElementById(`user-selector-${user.user_name}`);
            // achat.appendChild(text);
        })
    }
}

async function LoadFriends() {
    const myidUser = await GetProfile();
    const token = sessionStorage.getItem("token");
    const myprofile = await myidUser.json();
    const res = await fetch(API_URL_FRIENDS(myprofile.id), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await res.json();
    console.log(res);
    console.log(res.status);    
    if (res.status !== 200) {
        console.log(data);
        if(res.status == 401)
        {   
            window.location.href = "./../index.html";
        }
        console.log(res.status)
    } else {
        const userList = document.getElementById('friendsToInvite')

        userList.innerHTML = "";
        data.forEach(friend => {
            userList.innerHTML += `<a id="friend-selector-${friend.friend_name}" aria-current="true" class="list-group-item list-group-item-action freindsToInviteList" data-id="${friend.friend_id}" onClick="SelectFriendToInvite(this)">${friend.friend_name}</a>`;

        })
    }
}

function SelectFriendToInvite(element) {
    element.className += ' active';
    const friendId = element.getAttribute('data-id');
    arrayFriendsToInvite.push(friendId);
}

async function SendAllGuildInvitation() {
    // const friendsSection = document.getElementById('friendsToInvite')
    // const friendsToInvite =  friendsSection.getElementsByClassName('active');
    arrayFriendsToInvite.forEach(friendId => {
        console.log(friendId);
        GetUserData(friendId);
    })
}

async function GetUserData(friendId) {
    const token = sessionStorage.getItem("token");
        const usrRes = await fetch(API_URL_USER(friendId), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        usrData = await usrRes.json();
        if (usrRes.status !== 200) {
            console.log(usrData);
        }else{
            console.log(usrData);
            SendGuildInvitation(usrData);
        }
}

async function SendGuildInvitation(friend) {
    const token = sessionStorage.getItem("token");
    const idGuild =  sessionStorage.getItem("idGuild");
    const res = await fetch(API_URL_GUILD_REQUEST, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                "name": friend.user_name,
                "user_id": friend.id,
                "guild_id": idGuild
            }
        )
    });
    const data = await res.json();
    if (res.status !== 201) {
        console.log(data);
    }
    else 
    {
        console.log(data);
        await GetGuildRequest();
        arrayFriendsToInvite = [];
        console.log(arrayFriendsToInvite.length);
    }
}


async function GetGuildRequest() {
    const myidUser = await GetProfile();
    const token = sessionStorage.getItem("token");
    // const guildId = sessionStorage.getItem("idGuild");
    const myprofile = await myidUser.json();
    const res = await fetch(API_URL_GUILD_REQUEST_LIST(myprofile.id), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const allRequest = document.getElementById('guidRequest');
    if (res.status !== 200) {
        console.log(res);
        if (res.status === 404) {
            const spanOfRequest = document.getElementById('numberOfRequest');
            spanOfRequest.innerHTML= '0';
            allRequest.innerHTML = `You don have request's`;
        }
    }
    else
    {
        const data = await res.json();
        console.log(res);
        console.log(res.status);  
        const spanOfRequest = document.getElementById('numberOfRequest');
        spanOfRequest.innerHTML = '';
        console.log(data.length);
        if (data.length === 0) {
            const quantity = document.createTextNode(0);
            spanOfRequest.appendChild(quantity)
            allRequest.innerHTML = `You don have request's`;
        }
        else
        {
            allRequest.innerHTML = '';
            console.log(data.length);
            const quantity = document.createTextNode(data.length);
            spanOfRequest.appendChild(quantity)
            data.forEach(request => {
                allRequest.innerHTML += `<div><a id="friend-selector-${request.name}" aria-current="true" class="list-group-item list-group-item-action guildRequestList " >
                ${request.userSender} invited you to ${request.guildName}
                <span class="fa-solid fa-circle-check"  data-id="${request.id}" onclick="AcceptGuildRequest(this)"></span>
                <span class="fa-solid fa-ban "  data-id="${request.id}" onclick="RejectGuildRequest(this)"></span>
                </a>`
            })
        }
        // data.forEach(request => {

        // })
    }
}

async function AcceptGuildRequest(element) {
    // const myidUser = await GetProfile();
    const token = sessionStorage.getItem("token");
    // const guildId = sessionStorage.getItem("idGuild");
    // const myprofile = await myidUser.json();
    const requestId = element.getAttribute('data-id');
    const res = await fetch(API_URL_GUILD_REQUEST_LIST(requestId), {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.status !== 200) {
        console.log(res);
        if (res.status === 404) {
        }
    }
    else
    {
        console.log("ok");
        // const toast = document.getElementById('toastAcceptRequest');
        // toast.
    }

}

async function RejectGuildRequest(element) {
    const token = sessionStorage.getItem("token");
    // const guildId = sessionStorage.getItem("idGuild");
    // const myprofile = await myidUser.json();
    const requestId = element.getAttribute('data-id');
    const res = await fetch(API_URL_GUILD_REQUEST_LIST(requestId), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (res.status !== 200) {
        console.log(res);
        if (res.status === 404) {
        }
    }
    else
    {
        console.log("rejected ok");
        // const toast = document.getElementById('toastAcceptRequest');
        // toast.
    }
}

async function LoadParticipants() {
    const token = sessionStorage.getItem("token");
    const guildId = sessionStorage.getItem("idGuild");
    const res = await fetch(API_URL_GUILD_PARTICIPANTS(guildId), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    const participantListAccordion = document.getElementById('participantsGuildList');
    const participantListNewChat = document.getElementById('userstochat-list-group');
    if (res.status !== 200) {
        console.log(res);
        if (res.status === 404) {
            participantListAccordion.innerHTML = "Participants not found (°n°)";
            participantListNewChat.innerHTML = "Participants not found (°n°)";
            
        }
    }
    else
    {
        const data = await res.json();
        console.log(res);
        console.log(res.status);  
        console.log(data.length);
        if (data.length === 0) {
            participantListAccordion.innerHTML = "Add new friends (*u*)";
            participantListNewChat.innerHTML = "Add new friends (*u*)";
        }
        else
        {
            console.log(data.length);
            data.forEach(participant => {
                participantListAccordion.innerHTML = `<a>${participant.name}</a>`
                participantListNewChat.innerHTML = `<a id="friend-selector-${participant.name}" aria-current="true" class="list-group-item list-group-item-action participantsForChatList" data-id="${participant.user_id}" onClick="SelectUserForChat(this)">${participant.name}</a>`;
            })
        }
        // data.forEach(request => {

        // })
    }
}

function SelectUserForChat(element) {
    element.className += ' active';
    const friendId = element.getAttribute('data-id');
    arrayParticipantsToChat.push(friendId);
}

GetGuildRequest();
LoadFriends();
LoadGuildData();
LoadProfile();
LoadChats();
LoadParticipants();