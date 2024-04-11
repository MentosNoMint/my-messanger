let form = document.getElementById('register_form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let formData = new FormData(form);

    let first_name = formData.get('name');
    let last_name = formData.get('last_name');
    let email = formData.get('email');
    let username = formData.get('login');
    let password = formData.get('password')
    let twoPassword = formData.get('two_password')

    if (twoPassword !== password) {
        alert('Пароли не совпадают')
        return
    }

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, last_name, first_name, email }),
    })
        .then(response => {

            if (response.status === 422) {
                alert('Логин уже используется')
                return
            }
            if (response.ok) {
                console.log('Статус: ' + response.status);
                window.open('./login.html')
            } else {
                console.error('Произошла ошибка: ' + response.status);
            }
        })
        .catch(error => {
            console.error('Произошла ошибка: ' + error);
        });

})