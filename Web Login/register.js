frmRegister.onsubmit = async function(e) {
    e.preventDefault()
    let formData = new FormData(frmRegister)
    let data = {}
    formData.forEach((value, key) => {
        data[key] = value;
    })

    let response = await fetch('https://localhost:7267/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    let result = await response.json()
    if (response.status == 200) //Sucessful
    {
        window.location.href = `index.html?m=${result.message}`
    }
    else
    {
        var errors = Object.values(result.errors);
        var error_messages = ''

        for (i = 0; i < errors.length; i++)
        {
            error_messages += errors[i].errors[0].errorMessage + '<br>'
        }


        document.getElementById("error-msg").innerHTML = error_messages
    }

}
