const API_URL_USERS =  'https://localhost:7124/Users/Login';


const username = document.getElementById('Username');
const password = document.getElementById('Password');

async function login() {
    const res = await fetch(API_URL_USERS, {
        method: 'POST',
        headers: {
            'accept': 'text/plain',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                "user_name": "",
                "email": username.value,
                "password": password.value,
                "state": ""
            }
        ),
    });
    const data = await res.json();
    console.log(username.value)
    console.log(password.value)
    console.log(res);

    if (res.status !== 200) {
        spanError.innerHTML = 'Hubo un error: ' + res.status + data.message;
    } else {
        sessionStorage.setItem("token", data.accessToken);
        window.location.href = "./views/chat.html";
    }
}

