/*
Ciclo che implementa la creazione della board per la costruzione del team,
assegnazione delle classi agli elementi hex e composizione degli esagoni e indicizzazione
*/
for(let i=0; i<28; i++){
    const new_hex = document.createElement('div');

    new_hex.textContent='';
    new_hex.classList.add('hex');

    

    if(i===7 || i===21){
        new_hex.classList.add('shifted_hex');
    }
    new_hex.dataset.index = i+1;

    const container = document.querySelector('#four-row');
    container.appendChild(new_hex);

    new_hex.addEventListener("dragover", (event) => {event.preventDefault();}, false,);
    new_hex.addEventListener("dragenter", (event) => {event.target.classList.add("dragover"); drag_end_container=new_hex;});
    new_hex.addEventListener("dragleave", (event) => {event.target.classList.remove("dragover");});
    new_hex.addEventListener("drop", (event) => {event.preventDefault(); event.target.classList.remove("dragover"); swapBoard(dragged, drag_start_container, drag_end_container)});

    const new_top_hex = document.createElement('div');
    const new_bot_hex = document.createElement('div');
    new_top_hex.classList.add('top_hex');
    new_bot_hex.classList.add('bot_hex');

    new_hex.appendChild(new_top_hex);
    new_hex.appendChild(new_bot_hex);

    const new_div = document.createElement('div');
    new_div.classList.add('champ-item-container');

    const new_champ_wrapper = document.createElement('div');
    new_champ_wrapper.classList.add('character-wrapper');

    new_div.appendChild(new_champ_wrapper);
    new_hex.appendChild(new_div);

}

function removeChamp(x){
        x.style.backgroundImage = "none";
        x.classList.remove('filled-hex');
        x.classList.add('hex');
        const cont = x.querySelector('.champ-item-container .character-wrapper');
        cont.removeChild(cont.querySelector('img'));
        x.removeEventListener('click', removeChampBoard);
}

function onClickClear(){
    let hexes = document.querySelectorAll('.filled-hex');
    for(let i=0; i<hexes.length; i++)       removeChamp(hexes[i]);
    counter=0;
}

let dragged;
let drag_start_container;
let drag_end_container;

/*
Funzione di aggiunta alla board dei campioni
*/ 
function addChampBoard(event){
    if(counter===28) return;
    const champ = event.target;
    const champ_board = document.createElement('img');

    const hex= document.querySelector('#four-row .hex');
    hex.classList.remove('hex');
    hex.classList.add('filled-hex');
    hex.style.backgroundImage = "url("+champ.src+")";
    hex.addEventListener('dblclick', removeChampBoard);


    const cont = hex.querySelector('.champ-item-container .character-wrapper');
    champ_board.src = champ.src;
    champ_board.classList.add('character-icon');

    champ_board.addEventListener("dragstart", (event) => {dragged = event.target;   drag_start_container=hex;   event.target.classList.add("dragging");});
    champ_board.addEventListener("dragend", (event) => {event.target.classList.remove("dragging");});
    cont.appendChild(champ_board);
    counter++;
}

/*
funzione che gestisce il passaggio da un esagono ad un altro
*/
function swapBoard(ch, start, end){
    removeChamp(start);
    drag_end_container.classList.remove('hex');
    drag_end_container.classList.add('filled-hex');
    const champ_board = document.createElement('img');
    champ_board.classList.add('character-icon');

    champ_board.src = ch.src;
    drag_end_container.style.backgroundImage = "url("+ch.src+")";
    drag_end_container.addEventListener('dblclick', removeChampBoard);

    const cont = drag_end_container.querySelector('.champ-item-container .character-wrapper');
    cont.appendChild(champ_board);

    champ_board.addEventListener("dragstart", (event) => {dragged = event.target;   drag_start_container=drag_end_container;   event.target.classList.add("dragging");});
    champ_board.addEventListener("dragend", (event) => {event.target.classList.remove("dragging");});
}

/*
Funzione di rimozione dalla board dei campioni singola
*/ 
function removeChampBoard(event){
    const champ = event.currentTarget;
    removeChamp(champ);
}

/*
Funzione di aggiunta alla lista degli item
*/ 
function addItemBoard(event){
    const item = event.target;
    const item_board = document.createElement('img');
    item_board.src= item.src;
    if(item.nodeName === 'IMG') console.log(item.src);

}

function createContainer(x, root, f){
        const new_img = document.createElement('img');
        new_img.src = x;
        new_img.classList.add('character-icon');

        const new_div = document.createElement('div');
        new_div.classList.add('champ-item-container');
        
        if(f===0)             new_img.addEventListener('click', addChampBoard);
        else if(f===1)        new_img.addEventListener('click', addItemBoard);

        const new_champ_wrapper = document.createElement('div');
        new_champ_wrapper.classList.add('character-wrapper');
        
        new_champ_wrapper.appendChild(new_img);
        new_div.appendChild(new_champ_wrapper);
        root.appendChild(new_div);
}
/*
Creazione degli elementi img che contengono i campioni e loro indicizzazione,
assegnazione delle classi e assegnazione al container

Creazione di onSuccess e onFail
*/
function loadChamp(item){
    const list = item.split('\n');
    const root= document.querySelector('#champions-container .characters-list-wrapper');
    
    for(let i=0; i<list.length; i++)    createContainer(list[i], root, 0); 
}

function loadItem(item){
    const list = item.split('\n');
    const root= document.querySelector('#item-container .characters-list-wrapper');

    for(let i=0; i<list.length; i++)    createContainer(list[i], root, 1);
}

function onText(text){
    if(!text)   {   console.log("Nessun testo");    return;}
    if(x===0)   {loadChamp(text);   x++;}
    else        loadItem(text);
}

function onSuccess(response){
    console.log(response.status);
    if(!response.ok)
    {
        console.log('Risposta non valida');
        return null;
    }
    else    {return response.text();}
}

function onFail(error){
    console.log("Error: " + error);
}

let counter=0;
let x=0;
const champions_images_promise = fetch('/js/lista_path_campioni.txt');
champions_images_promise.then(onSuccess, onFail).then(onText);

const clear_btn = document.querySelector('#clear');
clear_btn.addEventListener('click', onClickClear);

const items_images_promise = fetch('/js/lista_path_oggetti.txt');
items_images_promise.then(onSuccess, onFail).then(onText);
