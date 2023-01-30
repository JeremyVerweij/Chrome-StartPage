const shortcutsList = document.getElementById("shortcutList");
const windowWidth = window.innerWidth;
const shortcutsListWidth = 0.5344444*windowWidth;
const popupElement = document.getElementById("popup");
const nameInputElement = document.getElementById("Name");
const urlInputElement = document.getElementById("Url");
const imageUrlInputElement = document.getElementById("ImageUrl");
const shortcutAddButton = document.getElementById("ShortcutAddBtn");
const shortcutCancelButton = document.getElementById("ShortcutCancelBtn");
const contextMenuElement = document.getElementById("contextMenu");
const contextMenu2Element = document.getElementById("contextMenu2");
const contextMenu3Element = document.getElementById("contextMenu3");
const editButton = document.getElementById("eidt");
const mapButton = document.getElementById("map");
const removeMapButton = document.getElementById("rmap");
const copyButton = document.getElementById("copy");
const pasteButton = document.getElementById("paste");
const deleteButton = document.getElementById("del");
const editButton2 = document.getElementById("eidt2");
const deleteButton2 = document.getElementById("del2");
const editButton3 = document.getElementById("eidt3");
const deleteButton3 = document.getElementById("del3");

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

editButton3.addEventListener("click", ()=>{
    var currentShortcut = maps[selectedList3];
    var newName = window.prompt("Rename map");
    maps[newName] = currentShortcut;
    delete maps[selectedList3];
    // Update global variable and save it to local storage
    global.list = list;
    global.maps = maps;
    localStorage.setItem("start", JSON.stringify(global));
    // Restart the application
    start();
})

deleteButton3.addEventListener("click", ()=>{
    var currentShortcut = maps[selectedList3];
    for (let i = 0; i < currentShortcut.length; i++) {
        const element = currentShortcut[i];
        list.push(element);
    }
    delete maps[selectedList3];
    // Update global variable and save it to local storage
    global.list = list;
    global.maps = maps;
    localStorage.setItem("start", JSON.stringify(global));
    // Restart the application
    start();
})

mapButton.addEventListener("click", () => {
    // Get the currently selected shortcut
    const currentShortcut = list[selectedList];
    // Prompt user for the map name
    const mapName = window.prompt("Map name");
    // Check if the map name is valid
    if (mapName != null && mapName !== "" && mapName !== undefined) {
        // Hide the context menu
        contextMenuElement.style.display = "none";
        // Check if the map already exists
        if (maps[mapName] === undefined) {
            maps[mapName] = [];
        }
        // Add the current shortcut to the map
        maps[mapName].push(currentShortcut);
        // Remove the shortcut from the list
        list.splice(selectedList, 1);
        // Update global variable and save it to local storage
        global.list = list;
        global.maps = maps;
        localStorage.setItem("start", JSON.stringify(global));
        // Restart the application
        start();
    }
});

deleteButton.addEventListener("click", () => {
    // Get the currently selected shortcut
    const currentShortcut = list[selectedList];
    // Hide the context menu
    contextMenuElement.style.display = "none";
    // Remove the shortcut from the list
    list.splice(selectedList, 1);
    // Update global variable and save it to local storage
    global.list = list;
    global.maps = maps;
    localStorage.setItem("start", JSON.stringify(global));
    // Restart the application
    start();
});

deleteButton2.addEventListener("click", () => {
    // Split the selected list index to get the map name and index
    const currentMapIndex = selectedList2.split("/");
    // Get the currently selected shortcut
    const currentShortcut = maps[currentMapIndex[0]][currentMapIndex[1]];
    // Hide the context menu
    contextMenuElement.style.display = "none";
    // Remove the shortcut from the map
    maps[currentMapIndex[0]].splice(currentMapIndex[1], 1);
    // Check if the map is empty and remove it if necessary
    if(maps[currentMapIndex[0]].length == 0) delete maps[currentMapIndex[0]]
    // Update global variable and save it to local storage
    global.list = list;
    global.maps = maps;
    localStorage.setItem("start", JSON.stringify(global));
    // Restart the application
    start();
});

removeMapButton.addEventListener("click", () => {
    // Split the selected list index to get the map name and index
    const currentMapIndex = selectedList2.split("/");
    // Get the currently selected shortcut
    const currentShortcut = maps[currentMapIndex[0]][currentMapIndex[1]];
    // Add the current shortcut to the list
    list.push(currentShortcut);
    // Remove the shortcut from the map
    maps[currentMapIndex[0]].splice(currentMapIndex[1], 1);
    // Check if the map is empty and remove it if necessary
    if(maps[currentMapIndex[0]].length == 0) delete maps[currentMapIndex[0]]
    // Update global variable and save it to local storage
    global.list = list;
    global.maps = maps;
    localStorage.setItem("start", JSON.stringify(global));
    // Restart the application
    start();
    // Hide the context menu
    contextMenu2Element.style.display = "none";
});

editButton2.addEventListener("click", () => {
    // Split the selected list index to get the map name and index
    const currentMapIndex = selectedList2.split("/");
    // Get the currently selected shortcut
    const currentShortcut = maps[currentMapIndex[0]][currentMapIndex[1]];
    // Set input fields values
    nameInputElement.value = currentShortcut.name;
    urlInputElement.value = currentShortcut.url;
    imageUrlInputElement.value = currentShortcut.ImageUrl;
    // Remove the shortcut from the map
    maps[currentMapIndex[0]].splice(currentMapIndex[1], 1);
    // Open the new shortcut popup
    openNewShortcutPopup();
    // Update global variable and save it to local storage
    global.list = list;
    global.maps = maps;
    localStorage.setItem("start", JSON.stringify(global));
    // Restart the application
    start();
});

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
        newShortcutButton.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            contextMenuElement.style.display = "";
            contextMenuElement.style.left = e.clientX;
            contextMenuElement.style.top = e.clientY;
            selectedList = listIndex;
        });
    }else if(id == "1"){
        newShortcutButton.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            contextMenu2Element.style.display = "";
            contextMenu2Element.style.left = e.clientX;
            contextMenu2Element.style.top = e.clientY;
            selectedList2 = listIndex;
        });
    }else if(id == "z"){
        newShortcutButton.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            contextMenu3Element.style.display = "";
            contextMenu3Element.style.left = e.clientX;
            contextMenu3Element.style.top = e.clientY;
            selectedList3 = listIndex;
        });
    }else newShortcutButton.addEventListener("contextmenu", (e) => {e.preventDefault();});
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

window.addEventListener("mousedown", (e)=>{
    if(e.target.offsetParent != contextMenuElement) contextMenuElement.style.display = "none";
    if(e.target.offsetParent != contextMenu2Element) contextMenu2Element.style.display = "none";
    if(e.target.offsetParent != contextMenu3Element) contextMenu3Element.style.display = "none";
})

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

