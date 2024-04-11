let form = document.getElementById('login-form');


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let formData = new FormData(form);

    let username = formData.get('login');
    let password = formData.get('password')

    let res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password}),
    })
      
    if(res.status == 401){
        alert('Неверный логин или пароль')
        return
    }
    if(res.ok){
        let token = await res.json();
        localStorage.setItem('auth_token' , JSON.stringify(token.token))
        window.open('./index.html')
    }

})