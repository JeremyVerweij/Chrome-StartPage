const searchInput = document.getElementById("search");
const searchbtn = document.getElementById("searchbtn");
const isValidUrl = urlString =>{
    var inputElement = document.createElement('input');
    inputElement.type = 'url';
    inputElement.value = urlString;

    if (!inputElement.checkValidity()) {
      return false;
    } else {
      return true;
    }
} 


function openInNewTab(url) {
    window.open(url, '_blank').focus();
}

searchbtn.addEventListener("click", () => {
    var tmp = searchInput.value;
    serach(tmp, window.event.ctrlKey);
})

searchInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        var tmp = searchInput.value;
        serach(tmp);
    }
})

function serach(input, n){
    if(n){
        if(isValidUrl(input)) openInNewTab(`${input}`);
        if(input.includes("www.")||input.includes(".nl")||input.includes(".com")) {if(isValidUrl(`https://${input}`)) openInNewTab(`https://${input}`)}
        else openInNewTab(`https://www.google.com/search?q=${input}`);
    }else{
        if(isValidUrl(input))window.location = `${input}`;
        if(input.includes("www.")||input.includes(".nl")||input.includes(".com")) {if(isValidUrl(`https://${input}`)) window.location = `https://${input}`}
        else window.location = `https://www.google.com/search?q=${input}`;
    }
}

//https://www.google.com/search?q=