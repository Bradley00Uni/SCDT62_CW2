frmLogin.onsubmit = async function (e) {
    e.preventDefault()
    let formData = new FormData(frmLogin)
    let data = {}
    formData.forEach((value, key) => {
        data[key] = value;
    })

    let response = await fetch('https://localhost:7267/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    let result = await response.json()
    if(response.status == 200){
        document.getElementById("error-msg").innerHTML = "Login Successful";
        document.getElementById("error-msg").classList.add("alert-success");

        window.localStorage.setItem('token', result.token)
    }
    else
    {
        document.getElementById("error-msg").innerHTML = result.message;
        document.getElementById("error-msg").classList.add("alert-danger");
    }
}

function checkLoggedIn(){
    let token = window.localStorage.getItem('token')
    if(token == null)
    {
        window.location.href('index.html')
    }
    else
    {
        alert('You are already logged in')
    }
}

async function logout()
{
    let response = await fetch('https://localhost:7267/api/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let result = await response.json()

    window.localStorage.removeItem('token')

    //window.location.href('index.html')

    document.getElementById("error-msg").innerHTML = result.message;
        document.getElementById("error-msg").classList.add("alert-info");
}
