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
const eidt = document.getElementById("eidt");

eidt.addEventListener("click", () => {
    const tmp = list[clist];
    Name.value = tmp.name;
    Url.value = tmp.url;
    ImageUrl.value = tmp.ImageUrl;
    console.log(list)
    list.splice(clist, 1);
    console.log(list)
    openNewShortcutPopup();
    a.list = list;
    localStorage.setItem("start", JSON.stringify(a));
    start();
})

var clist = 0; 
var a = JSON.parse(localStorage.getItem("start"))||{};
var list = a.list||[];
var x = 0;
var y = 0;

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
})

start();