// import foo from './client';
//#region  url area
const API_URL_CHAT = (id) =>  `https://localhost:7124/Chat/${id}`;
const API_URL_CHAT_SAVE = `https://localhost:7124/Chat`;
const API_URL_GUILDS =  'https://localhost:7124/Guild';
const API_URL_CHATS = (id) =>  `https://localhost:7124/Chat/Mine/${id}`;
const API_URL_USERS =  'https://localhost:7124/Users';
const API_URL_USER = (id) => `https://localhost:7124/Users/${id}`;
const API_URL_USERS_CHAT = (id) => `https://localhost:7124/Chat/Users/${id}`;
const API_URL_GUILD_REQUEST = `https://localhost:7124/Guild/RequestGuild`;
const API_URL_GUILD_REQUEST_LIST = (id) => `https://localhost:7124/Guild/Request/${id}`;
const API_URL_CHAT_MESSAGES = 'https://localhost:7124/Chat/Messages';
const API_URL_CHAT_MESSAGES_LIST = (id) => `https://localhost:7124/Chat/Messages/${id}`;
const API_URL_CHAT_MESSAGES_LAST = (id) => `https://localhost:7124/Chat/Messages/Last/${id}`;
//#endregion


// let client = new Client();


async function LoadChats() {
  const user = await GetProfile();
  const token = sessionStorage.getItem("token");
  const myId = await user.json();
  const res = await fetch(API_URL_CHATS(myId.id), {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  });
  const data = await res.json();
  console.log(res);
  console.log(res.status);
  if(res.status == 401)
  {
    window.location.href = "./../index.html";
    console.log("si funciona pon aquí el login");
  } else if (res.status !== 200) {
    console.log(data);

    console.log(res.status)
  } else {
    // const section = document.getElementById('chatsList')
    const chatList = document.getElementById('chat-List-group')

    chatList.innerHTML = "";

    data.forEach(async chat => {
      const div = document.createElement("div");
      const h5 = document.createElement("h5");
      const small = document.createElement("small");
      const p = document.createElement("p");
      const chatName = document.createTextNode(chat.name);
      const chatTitleText = document.createTextNode(chat.name);
      const lastMessage = document.createTextNode("5 min");
      const quantityMessages = document.createTextNode("1");
      const messagesWithoutRead = document.createElement("span");
      var text = '';
      const resMessage =  await GetLastMessage(chat.id);
      if (resMessage.status !== 200) {
        text = `You dont have messages`;
      }
      else
      {
        const data =  await resMessage.json();
        text = `${data.userName}: ${data.message_text}`;
      }

      const message = document.createTextNode(text);
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

async function GetLastMessage(id) {
  const token = sessionStorage.getItem("token");
  const res = await fetch(API_URL_CHAT_MESSAGES_LAST(id), {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
  });
  if (res.status != 200) {
    console.log('not have');
  } else {
  }
  return res;
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


function SelectUserchat(element) {
    const usersChatList = document.getElementsByClassName("usersChatList");
    for (const userChat of usersChatList) {
        userChat.className = 'list-group-item list-group-item-action usersChatList';
    }
    element.className = 'list-group-item list-group-item-action usersChatList active'
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
    sessionStorage.setItem('idChat', id);
    GetChat(id);
    LoadMessages();
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


async function SaveChat() {


    const users = document.getElementsByClassName("active usersChatList");
    for (const user of users) {

        const idUser = user.getAttribute("data-id")
        const name = document.getElementById('chatName');
        const token = sessionStorage.getItem("token")
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
                    "user_limit": 2
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
    else
    {
        console.log(myIdRes);
    }
    return myIdRes;
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


async function SaveGroup() {
    const name = document.getElementById('groupName');
    const userLimit = document.getElementById('maxUsers');
    const token = sessionStorage.getItem("token")
    console.log(token);
    const res = await fetch(API_URL_CHATS, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                "name": name.value,
                "user_limit": userLimit.value
            }
        ),
    });
    const data = await res.json();


    console.log('Save');
    console.log(res);

    if (res.status !== 200) {
        spanError.innerHTML = 'Hubo un error: ' + res.status + data.message;
    } else {
        console.log(res.json);
        LoadChats();
    }
}


async function LoadGuilds() {
    const token = sessionStorage.getItem("token");
    const res = await fetch(API_URL_GUILDS, {
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
        // const section = document.getElementById('chatsList')
        const guildList = document.getElementById('guild-list-group')
        console.log(data);
        guildList.innerHTML = '';
        data.forEach(guild => {
            const a = document.createElement("a");
            const img = document.createElement('img');
            const guildName = document.createTextNode(guild.name);

            a.href = './guild.html';
            a.className = 'list-group-item list-group-item-action';
            a.setAttribute('id-guild', guild.id);
            a.setAttribute('onclick','OpenGuild(this)') ;
            // img.src = guild.image;
            // img.width = 80;

            a.appendChild(guildName);
            a.appendChild(img);

            guildList.appendChild(a);
        })
    }
}


function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}


async function LoadProfile() {
    const myIdRes = await GetProfile();

    const scrollDownName = document.getElementById("navbarScrollingDropdown");
    const  profile = await myIdRes.json();
    const text = document.createTextNode(profile.user_name);
    scrollDownName.appendChild(text);
}


if(document.querySelector("#foto")){
    var foto = document.querySelector("#foto");
    foto.onchange = function(e) {
        var uploadFoto = document.querySelector("#foto").value;
        var fileimg = document.querySelector("#foto").files;
        var nav = URL || uploadFoto.webkitURL;
        var contactAlert = document.querySelector('#form_alert');
        if(uploadFoto !=''){
            var type = fileimg[0].type;
            var name = fileimg[0].name;
            if(type != 'image/jpeg' && type != 'image/jpg' && type != 'image/png'){
                contactAlert.innerHTML = '<p class="errorArchivo">El archivo no es válido.</p>';
                if(document.querySelector('#img')){
                    document.querySelector('#img').remove();
                }
                document.querySelector('.delPhoto').classList.add("notBlock");
                foto.value="";
                return false;
            }else{
                    contactAlert.innerHTML='';
                    if(document.querySelector('#img')){
                        document.querySelector('#img').remove();
                    }
                    document.querySelector('.delPhoto').classList.remove("notBlock");
                    var objeto_url = nav.createObjectURL(this.files[0]);
                    document.querySelector('.prevPhoto div').innerHTML = "<img id='img' src="+objeto_url+">";
                }
        }else{
            alert("No selecciono foto");
            if(document.querySelector('#img')){
                document.querySelector('#img').remove();
            }
        }
    }
}


if(document.querySelector(".delPhoto")){
    var delPhoto = document.querySelector(".delPhoto");
    delPhoto.onclick = function(e) {
        removePhoto();
    }
}


function removePhoto(){
    document.querySelector('#foto').value ="";
    document.querySelector('.delPhoto').classList.add("notBlock");
    document.querySelector('#img').remove();
}


async function SaveGuild() {
    const img = document.getElementById('img');
    const name = document.getElementById('GuildName');
    const user = await GetProfile();
    const userData = await user.json()
    const token = sessionStorage.getItem("token");
    // console.log(img.src);
    // var dataurl =  ConvertImagen(img);
    console.log(name.value);
    console.log(img);
    console.log(img.src);
    const res = await fetch(API_URL_GUILDS, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                "name": name.value,
                "image": img.src,
                "owner": userData.user_name
            }
        ),
    });
    const data = await res.json();
    if (res.status !== 201) {
        console.log(res);
        console.log(data);
    } else {
        console.log(data);
        LoadGuilds();
    }
}


function OpenGuild(element) {
    const id = element.getAttribute('id-guild');
    sessionStorage.setItem('idGuild', id);
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

// async function StartGrpcServer() {
//     // console.log('node Client.js');
//     // console.
//     const user = await GetProfile();
//     const userData =  await user.json();
//     foo(userData)
//     // FillName(userData);
// }


async function SendMessage() {
  const user =  await GetProfile();
  const userData =  await user.json();
  const message = document.getElementById('messageInput');
  const token = sessionStorage.getItem("token")
  const idChat = sessionStorage.getItem("idChat")
  // console.log(token);
  console.log(message.value);
  if (!isEmptyOrSpaces(message.value)) {
    
    const res = await fetch(API_URL_CHAT_MESSAGES, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                "message_text": message.value,
                "chat_id": idChat,
                "user_id": userData.id
            }
        ),
    });
    const data = await res.json();
  
    console.log(res);
  
    if (res.status !== 201) {
      console.log(data);
    } else {
      console.log(data);
      message.value = '';
    }
  }
  LoadMessages()
}



async function LoadMessages() {
  const idChat = sessionStorage.getItem("idChat")
  const token = sessionStorage.getItem("token")
  console.log(token);
  const res = await fetch(API_URL_CHAT_MESSAGES_LIST(idChat), {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
  });
  const messagesArea = document.getElementById('messagesAreas');
  console.log(res);
  if (res.status !== 200) {
    console.log(res);
    messagesArea.innerHTML = `<li class="message">
          <div class="avatar"></div>
          <div class="text_wrapper">
              <div class="text">You dont have messages</div>
          </div>
      </li>`;
  } else {
    const data = await res.json();
    console.log(data);
    
    messagesArea.innerHTML = '';
    data.forEach(message => {
      messagesArea.innerHTML += `<li class="message">
          <div class="avatar"></div>
          <div class="text_wrapper">
              <div class="text">${message.userName} : ${message.message_text}</div>
          </div>
      </li>`;
    });
  }
}



LoadMessages();
GetGuildRequest();
LoadProfile();
LoadGuilds();
LoadChats();
// StartGrpcServer();
