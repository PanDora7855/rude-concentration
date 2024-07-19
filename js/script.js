const addButton = document.querySelector(".add__warehouse");
const myMap = document.querySelector(".map");
const box = document.querySelector('.closeModal');
const zoomOut = document.querySelector('.zoom__out');
const rude = document.querySelector('.closeRude');
let input;
let i = -1;

const template = `
    <div class="xButton">X</div>
    <div class="module__item">
        <input type="text" id="warehouseName" name="name"  required>
        <label for="warehouseName">Название склада</label>
    </div>
    <div class="module__item">
        <input type="text" id="warehouseName" name="square"  required>
        <label for="warehouseName">Площадь склада</label>
    </div>
    <div class="module__item">
        <input type="text" id="warehouseName" name="volume"  required>
        <label for="warehouseName">Объем склада</label>
    </div>
    <div class="module__item">
        <input type="text" id="warehouseName" name="count"  required>
        <label for="warehouseName">Количество руды</label>
    </div>

    <input type="submit" value="Submit">
`;

zoomOut.addEventListener('click', e => {
    document.querySelectorAll('.box').forEach(item => {
        item.removeAttribute('hidden');
    })

    document.querySelector('svg').remove();
    box.classList.toggle('openModal');

    zoomOut.setAttribute('hidden', true)
})

addButton.addEventListener("click", first);

function first() {
    myMap.style.cursor = "url(../icons/warehouse.svg), auto";
    myMap.addEventListener("click", second, { once: true });
}

function second(ev) {
    i++;
    addButton.removeEventListener("click", first);
    const xCoord = ev.clientX;
    const yCoord = ev.clientY;

    const newModuleWindow = document.createElement("form");
    newModuleWindow.classList.add("moduleWindow");
    newModuleWindow.innerHTML = template;
    newModuleWindow.style.position = "absolute";
    newModuleWindow.style.top = yCoord - 60 + "px";
    newModuleWindow.style.left = xCoord + 40 + "px";
    myMap.append(newModuleWindow);

    const newWarehouse = document.createElement("img");
    newWarehouse.setAttribute("src", "../icons/warehouse.svg");
    newWarehouse.classList.add(`num${i}`, `box`);
    newWarehouse.style.position = "absolute";
    newWarehouse.style.top = yCoord + "px";
    newWarehouse.style.left = xCoord + "px";

    myMap.append(newWarehouse);
    myMap.style.cursor = "auto";

    const xButton = document.querySelector('.xButton');

    addButton.addEventListener("click", first);

    form = document.querySelector("form");

    xButton.addEventListener('click', (e) => {
        newModuleWindow.remove();
    })
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = makeData(form);

        postData("http://localhost:3000/first", data);
        newModuleWindow.remove();
    });

    newWarehouse.addEventListener('click', (e) => {
        document.querySelectorAll('.box').forEach(item => {
            item.setAttribute('hidden', true);
        })
        // rudeButton.removeAttribute('hidden');
        zoomOut.removeAttribute('hidden');

        // getD3('../newDb.json', newWarehouse.classList[0].slice(3, 4));

        newd3('../real.json');

        box.classList.toggle('openModal');
    })

}

// rudeButton.addEventListener('click', () => {
//    ();
// })

// function() {
//     rudeus();
// }

// function third(i) {
//     document.querySelectorAll('.box').forEach(item => {
//         item.classList.add('closeModal');
//     })
//     zoomOut.removeAttribute('hidden');

//     getD3Data('http://localhost:3000/second', i);

//     box.classList.toggle('openModal');
// }

function postData(url, data) {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: data,
    })
        .then((data) => data.json())
        .then((data) => console.log(data));
}

function makeData(form) {
    const formData = new FormData(form);
    const dataEntries = formData.entries();
    const objData = Object.fromEntries(dataEntries);
    const json = JSON.stringify(objData);

    return json;
}

const header = document.querySelector('.table__header');
const table = document.querySelector('.table');
const headerNavItems = document.querySelectorAll('.list-item');


header.addEventListener('mousedown', getHeaderY);

function getHeaderY(e) {
    let flag = true;
    for (i of headerNavItems) {
        if (e.target == i) {
            flag = false;
        }
    }
    if (flag) {
        header.removeEventListener('mousedown', getHeaderY);
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', e => {
            document.removeEventListener('mousemove', mouseMove)
            header.addEventListener('mousedown', getHeaderY);
        }, { once: true })
    }

}

function mouseMove(ev) {
    table.style.height = document.body.scrollHeight - ev.clientY + 'px';
}