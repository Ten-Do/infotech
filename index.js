// чистим хранилище перед загрузкой документа
localStorage.clear()

// достаем из документа некоторые элементы
const table_body = document.querySelector(".table_body");
const editFormFields = document.querySelector(".editFormFields");

// следующая функция является замыканием и возвращает функцицю
// по которой будет происходить сравнение при сортировке
// options: {isName: bool, reverse: bool}
const compareFn = (column, options={isName: false, reverse: false}) => {
    const { reverse, isName } = options;
    if (isName) {
        return (elem_1, elem_2) => {
            if (elem_1.name[column] > elem_2.name[column]) return reverse ? -1 : 1;
            else if (elem_1.name[column] < elem_2.name[column]) return reverse ? 1 : -1;
            else return 0;
        }
    }
    else {
        return (elem_1, elem_2) => {
            if (elem_1[column] > elem_2[column]) return reverse ? -1 : 1;
            else if (elem_1[column] < elem_2[column]) return reverse ? 1 : -1;
            else return 0;
        }
    }
}

// функция для отрисовки формы для редактирования строки
const drawForm = (elem) => {
    if (!elem?.id) return;
    localStorage.setItem("editItemId", elem.id);
    document.getElementById("firstNameField").value = elem.name.firstName;
    document.getElementById("lastNameField").value = elem.name.lastName;
    document.getElementById("phoneField").value = elem.phone;
    document.getElementById("aboutField").value = elem.about;
    document.getElementById("eyeColorField").value = elem.eyeColor;
}



// функция которая будет рисовать содержимое таблички
// основываяясь на содержимом localStorage
// определяет нужно ли отрисовывать конкретный столбец
// определяет сколько строк нужно вывести
const render = () => {
    table_body.innerHTML = ``;
    const page = localStorage.getItem("page");
    tableData = data.slice(0, 10 * (+page >= 0 ? +page + 1 : 1));
    const noFN = localStorage.getItem("noFN");
    const noLN = localStorage.getItem("noLN");
    const noA = localStorage.getItem("noA");
    const noEC = localStorage.getItem("noEC");
    tableData.forEach(element => {
        const row = document.createElement("div");
        row.classList.add("table_row");
        row.id = element.id;
        row.addEventListener("click", (event) => {
            const id = event.composedPath()[1].id;
            drawForm(tableData.find((elem) => elem.id == id));
            row.classList.toggle("openRow");
        })

        if (!(noFN == "true")) {
            const firstName = document.createElement('div');
            firstName.textContent = element.name.firstName;
            firstName.classList.add("firstName");
            row.appendChild(firstName);
        }
        if (!(noLN == "true")) {
            const lastName = document.createElement('div');
            lastName.textContent = element.name.lastName;
            lastName.classList.add("lastName");
            row.appendChild(lastName);
        }
        if (!(noA == "true")) {
            const about = document.createElement('div');
            about.textContent = element.about;
            about.classList.add("about");
            row.appendChild(about);
        }
        if (!(noEC == "true")) {
            const eyeColor = document.createElement('div');
            eyeColor.style.backgroundColor = element.eyeColor;
            eyeColor.classList.add("eyeColor");
            row.appendChild(eyeColor);
        }
        
        table_body.appendChild(row);
    });
}
// вызываем функцию чтобы данные уже отрисовался на страничке
render()

// вешаем на кнопки сортировок обработчик события "click"
// при клике по кнопке сортируется массив и его содержимое отрисовывается на странице 
document.querySelector("#nameSortBtn").addEventListener("click", () => {
    data.sort(compareFn("firstName", {isName: true}));
    render();
})
document.querySelector("#nameRevSortBtn").addEventListener("click", () => {
    data.sort(compareFn("firstName", {isName: true, reverse: true}));
    render();
})
document.querySelector("#lastNameSortBtn").addEventListener("click", () => {
    data.sort(compareFn("lastName", {isName: true}));
    render();
})
document.querySelector("#lastNameRevSortBtn").addEventListener("click", () => {
    data.sort(compareFn("lastName", {isName: true, reverse: true}));
    render();
})

document.querySelector("#aboutSortBtn").addEventListener("click", () => {
    data.sort(compareFn("about"));
    render();
})
document.querySelector("#aboutRevSortBtn").addEventListener("click", () => {
    data.sort(compareFn("about", {reverse: true}));
    render();
})
document.querySelector("#eyeColorSortBtn").addEventListener("click", () => {
    data.sort(compareFn("eyeColor"));
    render();
})
document.querySelector("#eyeColorRevSortBtn").addEventListener("click", () => {
    data.sort(compareFn("eyeColor", {reverse: true}));
    render();
})

// вешаем обработку события клика по чекбоксам
// при нажатии мы меняем содержимое хранилища и перерисовываем страничку
document.getElementById("viewFirstName").addEventListener("click", (e) => {
    localStorage.setItem("noFN", !e.target.checked);
    if (e.target.checked) {
        document.querySelector(`.table_head .firstName`).style.display = "";
    } else {
        document.querySelector(`.table_head .firstName`).style.display = "none";
    }
    render();
})
document.getElementById("viewLastName").addEventListener("click", (e) => {
    localStorage.setItem("noLN", !e.target.checked);
    if (e.target.checked) {
        document.querySelector(`.table_head .lastName`).style.display = "";
    } else {
        document.querySelector(`.table_head .lastName`).style.display = "none";
    }
    render();
})
document.getElementById("viewAbout").addEventListener("click", (e) => {
    localStorage.setItem("noA", !e.target.checked);
    if (e.target.checked) {
        document.querySelector(`.table_head .about`).style.display = "";
    } else {
        document.querySelector(`.table_head .about`).style.display = "none";
    }
    render();
})
document.getElementById("viewEyeColor").addEventListener("click", (e) => {
    localStorage.setItem("noEC", !e.target.checked);
    if (e.target.checked) {
        document.querySelector(`.table_head .eyeColor`).style.display = "";
    } else {
        document.querySelector(`.table_head .eyeColor`).style.display = "none";
    }
    render();
})

// при клике по кнопке "редактироавть" соответствующая зазпись из data будет изменена
document.querySelector(".editBtn").addEventListener("click", () => {
    const id = localStorage.getItem("editItemId");
    const elem = data.find((elem) => elem.id == id);
    
    elem.name.firstName = document.getElementById("firstNameField").value;
    elem.name.lastName = document.getElementById("lastNameField").value;
    elem.phone = document.getElementById("phoneField").value;
    elem.about = document.getElementById("aboutField").value;
    elem.eyeColor = document.getElementById("eyeColorField").value;

    render();
})

// при клике по кнопке отмены форма вновь заполниться данными из data
document.querySelector(".cancelBtn").addEventListener("click", () => {
    const id = localStorage.getItem("editItemId");
    drawForm(data.find((elem) => elem.id == id));
})

// добавляем контент на страничке
// меняем хранилище -> отрисовываем табличку
document.querySelector("#addContent").addEventListener("click", (e) => {
    const page = localStorage.getItem("page");
    document.querySelector("#hideContent").style.display = "";
    if (!+page || +page <= 0) {
        localStorage.setItem("page", 1);
    } else if (+page + 2 >= Math.floor(data.length / 10)) {
        e.target.style.display = "none";
        localStorage.setItem("page", +page + 1);
    } else {
        localStorage.setItem("page", +page + 1);
    }
    render()
})
// скрываем контент со странички
// меняем хранилище -> отрисовываем табличку
document.querySelector("#hideContent").addEventListener("click", (e) => {
    const page = localStorage.getItem("page");
    document.querySelector("#addContent").style.display = "";
    if (!+page || +page - 1 <= 0) {
        localStorage.setItem("page", 0);
        e.target.style.display = "none";
    } else if (+page >= Math.floor(data.length / 10)) {
        localStorage.setItem("page", (Math.floor(data.length / 10) > 0 ? Math.floor(data.length / 10) : 1) - 1);
    } else {
        localStorage.setItem("page", +page - 1);
    }
    render()
})
