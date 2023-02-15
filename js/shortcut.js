const shortcutsList = document.getElementById("shortcutList");
const popupElement = document.getElementById("popup");
const nameInputElement = document.getElementById("Name");
const urlInputElement = document.getElementById("Url");
const imageUrlInputElement = document.getElementById("ImageUrl");
const shortcutAddButton = document.getElementById("ShortcutAddBtn");
const shortcutCancelButton = document.getElementById("ShortcutCancelBtn");
const copyButton = document.getElementById("copy");
const pasteButton = document.getElementById("paste");

var windowWidth = window.innerWidth;
var shortcutsListWidth = 0.5344444*windowWidth;
var selectedList = 0; 
var selectedList2 = 0; 
var selectedList3 = 0; 
var global = (localStorage.getItem("start"))||{};
try{ global = JSON.parse(global);}
catch{ global = {};}
var list = global.list||[];
var maps = global.maps||{};
var x = 0;
var y = 0;
var opened = [];

class listItem {
    constructor(name, url, ImageUrl){
        this.name = name;
        this.url = url;
        this.ImageUrl = ImageUrl;
        this.inner = `<img class="shortcutimage" src="${ImageUrl}"><div class="shortcutName">${name}</div>`;
    }
}

shortcutAddButton.addEventListener("click", () => {
    // Check if the popup is open
    if(popupElement.style.display == ""){
        // Check if the input fields are valid and not empty
        if(urlInputElement.checkValidity() && imageUrlInputElement.checkValidity() && urlInputElement.value !="" && imageUrlInputElement.value !=""){
            // Add the new shortcut to the list
            list.push(new listItem(nameInputElement.value, urlInputElement.value, imageUrlInputElement.value));
            // Update global variable and save it to local storage
            global.list = list;
            global.maps = maps;
            localStorage.setItem("start", JSON.stringify(global));
            // Restart the application
            start();
            // Hide the popup
            popupElement.style.display = "none";
        }
    }
});

shortcutCancelButton.addEventListener("click", () => {
    // Hide the popup
    popupElement.style.display = "none";
});

function addNewShortcutToTheList(inner = "", listIndex, id = "", css = "", clickEvent){
    // Create a new button element
    var newShortcutButton = document.createElement("button");
    // Assign class and css style
    newShortcutButton.className = "shortcut";
    newShortcutButton.style = css;
    // Assign inner html
    newShortcutButton.innerHTML = inner;
    // Assign id
    newShortcutButton.id = id;
    // Assign position
    newShortcutButton.style.left = x + "px";
    newShortcutButton.style.top = y + "px";
    // Add click event
    newShortcutButton.addEventListener("click", clickEvent);
    // Check the id to determine which context menu to open
    if(id == ""){
        ctxm1.addToElement(newShortcutButton, ()=>{
            selectedList = listIndex;
        })
    }else if(id == "1"){
        ctxm2.addToElement(newShortcutButton, ()=>{
            selectedList2 = listIndex;
        })
    }else if(id == "z"){
        ctxm3.addToElement(newShortcutButton, ()=>{
            selectedList3 = listIndex;
        })
    }else newShortcutButton.addEventListener("contextmenu", (e) => {e.preventDefault();});

    //drag
    if(id == ""||id == "1"){
        newShortcutButton.draggable = true;
        newShortcutButton.addEventListener("dragend", (e)=>{
            if(e.clientY<0){
                if(id=="") window.open(list[listIndex].url, '_blank');
                else{
                    // Split the selected list index to get the map name and index
                    const currentMapIndex = listIndex.split("/");
                    // Get the currently selected shortcut
                    const currentShortcut = maps[currentMapIndex[0]][currentMapIndex[1]];
                    window.open(currentShortcut.url, '_blank');
                }
            }
        })
    }

    // Append the new button to the shortcuts list
    shortcutsList.append(newShortcutButton);
    // Increment x and y positions
    x += 110;
    if(x > shortcutsListWidth) y += 110;
    if(x > shortcutsListWidth) x = 0;
}

function openNewShortcutPopup(){
    popupElement.style.display = "";
}

function start(){
    x = 0;
    y = 0;
    shortcutsList.innerHTML = "";

    addNewShortcutToTheList(`<img class="innerShortcut" style="filter: invert(100%);" src="./img/plus.png">`, null, "new", "", () => {
        nameInputElement.value = "";
        urlInputElement.value = "";
        imageUrlInputElement.value = "";
        openNewShortcutPopup();
    })

    for (const i in maps) {
        if (Object.hasOwnProperty.call(maps, i)) {
            const element = maps[i];
            var tmp, tmpe;

            if(opened.includes(i))tmp = `<img class="innerShortcut" style="filter: invert(100%);" src="./img/expand-left.png">`;
            else tmp = `<img class="innerShortcut" style="filter: invert(100%);" src="./img/expand-right.png">`;

            tmp += `<div class="shortcutName">${i}</div>`;

            if(opened.includes(i)) tmpe = () => {
                opened[opened.indexOf(i)] = undefined;
                start();
            }
            else tmpe = () => {
                opened.push(i);
                start();
            }

            addNewShortcutToTheList(tmp, i, "z", "", tmpe);

            if(opened.includes(i)) for (let i2 = 0; i2 < element.length; i2++) {
                const e = element[i2];
                addNewShortcutToTheList(e.inner, i + "/" + i2, "1", "", () => {
                    if(window.event.ctrlKey){
                        openInNewTab(e.url)
                    }else{
                        window.location = e.url;
                    }
                });
            }
        }
    }
    
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        addNewShortcutToTheList(element.inner, i, "", "", () => {
            if(window.event.ctrlKey){
                openInNewTab(element.url)
            }else{
                window.location = element.url;
            }
        });
    }
}

copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(JSON.stringify(global)).then(() => {
        // Alert the user that the action took place.
        // Nobody likes hidden stuff being done under the hood!
        alert("Copied to clipboard, you can now share the code with your friends.");
    });
})

pasteButton.addEventListener("click", async () => {
    const text = await navigator.clipboard.readText();
    global = JSON.parse(text);
    localStorage.setItem("start", JSON.stringify(global));
    list = global.list||[];
    maps = global.maps||{};
    start();
})

start();

window.addEventListener("resize", ()=>{
    windowWidth = window.innerWidth;
    shortcutsListWidth = 0.39*windowWidth;
    start();
})