const shortcutList = document.getElementById("shortcutList");
const wwidth = window.innerWidth;
const shortcutListWidth = 0.5344444*wwidth;
const popup = document.getElementById("popup");
const Name = document.getElementById("Name");
const Url = document.getElementById("Url");
const ImageUrl = document.getElementById("ImageUrl");
const ShortcutAddBtn = document.getElementById("ShortcutAddBtn");
const ShortcutCancelBtn = document.getElementById("ShortcutCancelBtn");

var a = JSON.parse(localStorage.getItem("start"))||{};
list = a.list||[];
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

function addNewSchortcutToTheList(inner = "", id = "", css = "", click){
    var tmp = document.createElement("button");
    tmp.className = "shortcut";
    tmp.style = css;
    tmp.innerHTML = inner;
    tmp.id = id;
    tmp.style.left = x + "px";
    tmp.style.top = y + "px";
    tmp.addEventListener("click", click);
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

    addNewSchortcutToTheList(`<img class="innerShortcut" src="./img/plus.png">`, "new", "", () => {
        openNewShortcutPopup();
    })
    
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
        addNewSchortcutToTheList(element.inner, "", "", () => {
            if(window.event.ctrlKey){
                openInNewTab(element.url)
            }else{
                window.location = element.url;
            }
        })
    }
}

start();