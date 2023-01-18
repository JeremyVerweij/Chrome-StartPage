const shortcutList = document.getElementById("shortcutList");
const wwidth = window.innerWidth;
const shortcutListWidth = 0.5344444*wwidth;
const popup = document.getElementById("popup");
const Name = document.getElementById("Name");
const Url = document.getElementById("Url");
const ImageUrl = document.getElementById("ImageUrl");
const ShortcutAddBtn = document.getElementById("ShortcutAddBtn");
const ShortcutCancelBtn = document.getElementById("ShortcutCancelBtn");
const contextmenu = document.getElementById("contextMenu");
const contextmenu2 = document.getElementById("contextMenu2");
const eidt = document.getElementById("eidt");
const map = document.getElementById("map");
const rmap = document.getElementById("rmap");
const copy = document.getElementById("copy");
const paste = document.getElementById("paste");

map.addEventListener("click", () => {
    const tmp = list[clist];
    var tmp2 = window.prompt("Map name");
    if(tmp2!=null&&tmp2!=""&&tmp2!=undefined){
        contextmenu.style.display = "none";
        if(maps[tmp2] == undefined) maps[tmp2] = [];
        maps[tmp2].push(tmp);
        list.splice(clist, 1);
        a.list = list;
        a.maps = maps;
        localStorage.setItem("start", JSON.stringify(a));
        start();
    }
})

rmap.addEventListener("click", () => {
    const ctmp = clist2.split("/");
    const tmp = maps[ctmp[0]][ctmp[1]];
    list.push(tmp);
    maps[ctmp[0]].splice(clist2, 1);
    if(maps[ctmp[0]].length == 0) delete maps[ctmp[0]]
    a.list = list;
    a.maps = maps;
    localStorage.setItem("start", JSON.stringify(a));
    start();
})

eidt.addEventListener("click", () => {
    const tmp = list[clist];
    Name.value = tmp.name;
    Url.value = tmp.url;
    ImageUrl.value = tmp.ImageUrl;
    list.splice(clist, 1);
    openNewShortcutPopup();
    a.list = list;
    a.maps= maps;
    localStorage.setItem("start", JSON.stringify(a));
    start();
})

var clist = 0; 
var clist2 = 0; 
var a = (localStorage.getItem("start"))||{};
if(a == 'undefined') a = "{}";
a = JSON.parse(a);
var list = a.list||[];
var maps = a.maps||{};
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

ShortcutAddBtn.addEventListener("click", () => {
    if(popup.style.display == ""){
        if(Url.checkValidity()&&ImageUrl.checkValidity()&&Url.value!=""&&ImageUrl.value!=""){
            list.push(new listItem(Name.value, Url.value, ImageUrl.value));
            a.list = list;
            a.maps= maps;
            localStorage.setItem("start", JSON.stringify(a));
            start();
            popup.style.display = "none";
        }
    }
})

ShortcutCancelBtn.addEventListener("click", () => {
    popup.style.display = "none";
})

function addNewSchortcutToTheList(inner = "", listt, id = "", css = "", click){
    var tmp = document.createElement("button");
    tmp.className = "shortcut";
    tmp.style = css;
    tmp.innerHTML = inner;
    tmp.id = id;
    tmp.style.left = x + "px";
    tmp.style.top = y + "px";
    tmp.addEventListener("click", click);
    if(id == ""){
        tmp.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            contextmenu.style.display = "";
            contextmenu.style.left = e.clientX;
            contextmenu.style.top = e.clientY;
            clist = listt;
        })
    }else if(id == "1"){
        tmp.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            contextmenu2.style.display = "";
            contextmenu2.style.left = e.clientX;
            contextmenu2.style.top = e.clientY;
            clist2 = listt;
        })
    }
    shortcutList.append(tmp);
    x += 110;
    if(x>shortcutListWidth) y += 110;
    if(x>shortcutListWidth) x = 0;
}

function openNewShortcutPopup(){
    popup.style.display = "";
}

function start(){
    x = 0;
    y = 0;
    shortcutList.innerHTML = "";

    addNewSchortcutToTheList(`<img class="innerShortcut" style="filter: invert(100%);" src="./img/plus.png">`, null, "new", "", () => {
        Name.value = "";
        Url.value = "";
        ImageUrl.value = "";
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

            addNewSchortcutToTheList(tmp, null, "z", "", tmpe);

            if(opened.includes(i)) for (let i2 = 0; i2 < element.length; i2++) {
                const e = element[i2];
                addNewSchortcutToTheList(e.inner, i + "/" + i2, "1", "", () => {
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
        addNewSchortcutToTheList(element.inner, i, "", "", () => {
            if(window.event.ctrlKey){
                openInNewTab(element.url)
            }else{
                window.location = element.url;
            }
        });
    }
}

window.addEventListener("mousedown", (e)=>{
    if(e.target.offsetParent != contextmenu) contextmenu.style.display = "none";
    if(e.target.offsetParent != contextmenu2) contextmenu2.style.display = "none";
})

copy.addEventListener("click", () => {
    navigator.clipboard.writeText(JSON.stringify(a)).then(() => {
        // Alert the user that the action took place.
        // Nobody likes hidden stuff being done under the hood!
        alert("Copied to clipboard, you can now share the code with your friends.");
    });
})

paste.addEventListener("click", async () => {
    const text = await navigator.clipboard.readText();
    a = JSON.parse(text);
    localStorage.setItem("start", JSON.stringify(a));
    list = a.list||[];
    maps = a.maps||{};
    start();
})


start();