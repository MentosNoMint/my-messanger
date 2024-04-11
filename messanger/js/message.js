let dialoglist = document.querySelector('.dialoglist');
let messagelist = document.querySelector('.messagelist');
let listLogin = document.getElementById('login_all')
let inputElement = document.querySelector('.inputLogin')
let form = document.getElementById('search-form');

if (localStorage.getItem('auth_token') != '') {

    //лайфпоиск юзеров по логину
    async function inputSearch(code) {
        let contentLogin = await fetch(`http://localhost:3000/search?query=${code}`, {
            method: 'GET'
        })
        let resLogin = await contentLogin.json();
        return resLogin;
    }

    // дебаунс для предовращения большого количества запросов на сервер
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const debouncedInputSearch = debounce(async (inputValue) => {
        const items = await inputSearch(inputValue);
        const nameLogin = items.map(a => {
            return `
              <option value="${a.username}" id="${a.user_id}">${a.first_name} ${a.last_name}</option>
          `;
        });
        listLogin.innerHTML = nameLogin;

        if (inputValue == '') {
            listLogin.innerHTML = ''
        }
    }, 500);

    inputElement.addEventListener('input', () => {
        const inputValue = inputElement.value;
        debouncedInputSearch(inputValue);
    });


    async function viewDialog() {
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            
            let formData = new FormData(form);

            let username = formData.get('loginsearch');

            if(username == ''){
                alert('Не указан логин')
                return
            }

            let items = await addUser(username)

            console.log(items)
            if(items == ''){
                alert('Не правильно указан логин')
            }
        })

    }
    viewDialog()

} else {
    //что видит не авторизированный юзер 
    dialoglist.innerHTML = `
<h1 class="text-[20px] font-medium mt-[15px]">Диалоги</h1>
<div class="h-[50px] w-[250px] rounded-[10px] bg-[#F9F9F5] mt-[15px] flex items-center cursor-pointer hover:bg-[#FFAFAF] duration-300 "
    id="active">
    <div class="img-circle rounded-[500px] w-[40px] h-[40px] border-[1px] ml-[5px]">
        <img src="./media/1663110850_6-mykaleidoscope-ru-p-spokoinii-chelovek-vkontakte-8.jpg"
            alt="Photo" class="w-full h-full rounded-[50px] object-cover">
    </div>
    <div class="flex flex-col ml-[15px]">
        <div class="flex">
            <span>Николай</span>
            <span class="ml-[5px]">Кудрявцев</span>
        </div>
        <div class="flex">
            <span>Вы:</span>
            <span class="ml-[5px] text-gray-500">Знаешь наверное ...</span>
        </div>
    </div>
</div>
<div
    class="h-[50px] w-[250px] rounded-[10px] bg-[#F9F9F5] mt-[15px] flex items-center cursor-pointer hover:bg-[#FFAFAF] duration-300">
    <div class="img-circle rounded-[500px] w-[40px] h-[40px] border-[1px] ml-[5px]">
        <img src="./media/e77beef67c4add701e512096f1849a15.jpg" alt="Photo"
            class="w-full h-full rounded-[50px] object-cover">
    </div>
    <div class="flex flex-col ml-[15px]">
        <div class="flex">
            <span>Кирилл</span>
            <span class="ml-[5px]">Широков</span>
        </div>
        <div class="flex">
            <span>я:</span>
            <span class="ml-[5px] text-gray-500">хз</span>
        </div>
    </div>
</div>

`

    messagelist.innerHTML = `
<div class="flex h-[70px] w-full items-center ml-[25px] justify-between">
<div class="flex">
    <div class="flex">
        <span>Николай</span>
        <span class="ml-[5px]">Кудрявцев</span>
    </div>
    <div class="all-circle flex items-center">
        <div class="w-[10px] h-[10px] bg-green-500 rounded-[500px] ml-[10px]"></div>
        <span class="ml-[5px] text-[13px] text-gray-400">online</span>
    </div>
</div>
<div class="flex gap-[5px] mr-[50px] cursor-pointer">
    <div class="w-[5px] h-[5px] rounded-[500px] bg-gray-500"></div>
    <div class="w-[5px] h-[5px] rounded-[500px] bg-gray-500"></div>
    <div class="w-[5px] h-[5px] rounded-[500px] bg-gray-500"></div>
</div>
</div>
<div class="h-[1px] w-full bg-gray-200"></div>
<div class="w-full h-full overflow-y-auto">
<div class="you">
    <div class="flex items-start mt-[50px] w-full">
        <div class="img-circle rounded-[500px] w-[40px] h-[40px] border-[1px] ml-[15px]">
            <img src="./media/1663110850_6-mykaleidoscope-ru-p-spokoinii-chelovek-vkontakte-8.jpg"
                alt="Photo" class="w-full h-full rounded-[50px] object-cover">
        </div>
        <div class="bg-gray-100 rounded-[10px] max-w-[250px] flex items-center ml-[5px]">
            <span class="px-[10px] text-[15px] py-[5px]">Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Saepe nisi ad neque ex nesciunt? Numquam
                quam beatae iusto voluptatem. Accusamus vitae reprehenderit totam quam
                fuga, architecto minima magni odio sunt.</span>
        </div>
    </div>
</div>
<div class="me w-full">
    <div class="flex items-start mt-[25px] w-full justify-end">
        <div class="bg-gray-100 rounded-[10px] max-w-[250px] flex items-center mr-[5px]">
            <span class="px-[10px] text-[15px] py-[5px]">Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Saepe nisi ad neque ex nesciunt? Numquam
                quam beatae iusto voluptatem. Accusamus vitae reprehenderit totam quam
                fuga, architecto minima magni odio sunt.</span>
        </div>
        <div class="img-circle rounded-[500px] w-[40px] h-[40px] border-[1px] mr-[15px]">
            <img src="./media/e77beef67c4add701e512096f1849a15.jpg" alt="Photo"
                class="w-full h-full rounded-[50px] object-cover">
        </div>
    </div>
</div>
<div class="you">
    <div class="flex items-start mt-[50px] w-full">
        <div class="img-circle rounded-[500px] w-[40px] h-[40px] border-[1px] ml-[15px]">
            <img src="./media/1663110850_6-mykaleidoscope-ru-p-spokoinii-chelovek-vkontakte-8.jpg"
                alt="Photo" class="w-full h-full rounded-[50px] object-cover">
        </div>
        <div class="bg-gray-100 rounded-[10px] max-w-[250px] flex items-center ml-[5px]">
            <span class="px-[10px] text-[15px] py-[5px]">Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Saepe nisi ad neque ex nesciunt? Numquam
                quam beatae iusto voluptatem. Accusamus vitae reprehenderit totam quam
                fuga, architecto minima magni odio sunt.</span>
        </div>
    </div>
</div>
<div class="me w-full">
    <div class="flex items-start mt-[25px] w-full justify-end">
        <div class="bg-gray-100 rounded-[10px] max-w-[250px] flex items-center mr-[5px]">
            <span class="px-[10px] text-[15px] py-[5px]">Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Saepe nisi ad neque ex nesciunt? Numquam
                quam beatae iusto voluptatem. Accusamus vitae reprehenderit totam quam
                fuga, architecto minima magni odio sunt.</span>
        </div>
        <div class="img-circle rounded-[500px] w-[40px] h-[40px] border-[1px] mr-[15px]">
            <img src="./media/e77beef67c4add701e512096f1849a15.jpg" alt="Photo"
                class="w-full h-full rounded-[50px] object-cover">
        </div>
    </div>
</div>
</div>
<div class="flex h-[80px] justify-center items-center">
<div class="w-[20px] cursor-pointer mr-[15px]">
    <img src="./media/png-transparent-computer-icons-camera-camera-cdr-text-camera-lens (1).png"
        alt="Send">
</div>
<div class="h-[50px] w-[75vh] rounded-[12px] bg-[#F9F9F5]">
    <input type="text" placeholder="Сообщение"
        class="text-black text-start w-full h-full bg-[#F9F9F5] pl-[15px] rounded-[12px]">
</div>
<div class="w-[25px] cursor-pointer ml-[25px]">
    <img src="./media/png-transparent-computer-icons-desktop-symbol-paper-plane-miscellaneous-angle-triangle (1).png"
        alt="Send">
</div>
</div>
`

}


async function addUser(login) {
    let responseLogin = await fetch(`http://localhost:3000/users/${login}`)
    let contentLogin = await responseLogin.json();
    return contentLogin
}
