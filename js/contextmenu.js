class context_menu {
    constructor(buttons=[]){
        this.body = document.createElement("div");
        this.body.classList.add("contextMenu");
        this.body.addEventListener("contextmenu", (e) => {e.preventDefault();});
        
        this.buttonlist = [];

        for (let i = 0; i < buttons.length; i++) {
            const e = buttons[i];
            var tmp = document.createElement("div");
            tmp.classList.add("item");
            tmp.innerHTML = e.name;
            tmp.addEventListener("click", (d)=>{
                if(e.auto_hide)this.body.style.display = "none";
                e.clickEvent(d);
            });

            this.buttonlist.push(tmp);
            this.body.appendChild(tmp);
        }

        this.body.style.display = "none";
        window.addEventListener("mousedown", (e)=>{if(e.target.offsetParent != this.body) this.body.style.display = "none";})

        document.body.appendChild(this.body);

    }

    addToElement(element, _customFunction=()=>{}){
        element.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this.body.style.display = "";
            this.body.style.left = e.clientX;
            this.body.style.top = e.clientY;

            if(e.clientY>window.innerHeight/2)this.body.style.top = e.clientY - this.buttonlist.length*33;
            _customFunction(e);
        })
    }
}

var ctxm1 = new context_menu([
    {
        name: "Edit",
        auto_hide: true,
        clickEvent: () => {
            // Get the currently selected shortcut
            const currentShortcut = list[selectedList];
            // Set input fields values
            nameInputElement.value = currentShortcut.name;
            urlInputElement.value = currentShortcut.url;
            imageUrlInputElement.value = currentShortcut.ImageUrl;
            // Remove the shortcut from the list
            list.splice(selectedList, 1);
            // Open the new shortcut popup
            openNewShortcutPopup();
            // Update global variable and save it to local storage
            global.list = list;
            global.maps = maps;
            localStorage.setItem("start", JSON.stringify(global));
            // Restart the application
            start();
        }
    },
    {
        name: "Delete",
        clickEvent: () => {
            // Get the currently selected shortcut
            const currentShortcut = list[selectedList];
            // Remove the shortcut from the list
            list.splice(selectedList, 1);
            // Update global variable and save it to local storage
            global.list = list;
            global.maps = maps;
            localStorage.setItem("start", JSON.stringify(global));
            // Restart the application
            start();
        }
    },
    {
        name: "Add to map",
        auto_hide: true,
        clickEvent: () => {
            // Get the currently selected shortcut
            const currentShortcut = list[selectedList];
            // Prompt user for the map name
            const mapName = window.prompt("Map name");
            // Check if the map name is valid
            if (mapName != null && mapName !== "" && mapName !== undefined) {
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
        }
    }
]);

var ctxm2 = new context_menu([
    {
        name: "Edit",
        auto_hide: true,
        clickEvent: () => {
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
        }
    },
    {
        name: "Delete",
        auto_hide: true,
        clickEvent: () => {
            // Split the selected list index to get the map name and index
            const currentMapIndex = selectedList2.split("/");
            // Get the currently selected shortcut
            const currentShortcut = maps[currentMapIndex[0]][currentMapIndex[1]];
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
        }
    },
    {
        name: "Remove from map",
        auto_hide: true,
        clickEvent: () => {
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
        }
    }
]);

var ctxm3 = new context_menu([
    {
        name: "Edit",
        auto_hide: true,
        clickEvent: () => {
            var currentShortcut = maps[selectedList3];
            var newName = window.prompt("Rename map");
            if(newName!=selectedList3&&newName){
                if(maps[newName]){
                    window.alert("Map already exists!")
                    return
                }
                maps[newName] = currentShortcut;
                delete maps[selectedList3];
                // Update global variable and save it to local storage
                global.list = list;
                global.maps = maps;
                localStorage.setItem("start", JSON.stringify(global));
                // Restart the application
                start();
            }
        }
    },
    {
        name: "Delete",
        auto_hide: true,
        clickEvent: () => {
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
        }
    }
]);

window.addEventListener("contextmenu", (e)=>{e.preventDefault()})