/**
 * Created by Hirad on 7/25/2016.
 */


var queryCounter = 0;
var headerCounter = 0;

window.onload = function () {
    document.getElementById("newRequestBtn").addEventListener("click",function(){
        var hiddens = document.querySelectorAll('[data-display]');
        var i = 0;
        var len = hiddens.length;
        for (i; i < len; i++){
            hiddens[i].classList.remove("hide");
        }
        RequestObject = {};
    });

    window.setInterval(function(){
        updatePreview();
    },1500);

    function duplicate(idName) {
        var original = document.getElementById(idName + 0);
        var clone = original.cloneNode(true); // "deep" clone
        if(idName=="query"){
            ++queryCounter;
        }
        else
            ++headerCounter;

        clone.children[0].value = "";
        clone.children[1].value = "";
        counter = 1;
        for(counter; counter < 1000; ++counter){
            id = idName + counter;
            //check for the first available id name
            if(!document.getElementById(idName+counter))
                break;
        }
        clone.id = idName + counter; // there can only be one element with an ID
        //clone the event handlers if needed
    
        original.parentNode.appendChild(clone);
        return clone;
    }
    document.getElementById("paramsBtn").addEventListener(("click"),function(){
        document.getElementById("queries").classList.remove("hide");
        duplicate("query").classList.remove("hide");
        // //TODO:: Finds out why sometime the hide class is not getting removed before duplications
        // if(queryCounter === 0){
        //     document.getElementById("queries").classList.remove("hide");
        //     ++queryCounter;
        // }
        // else{
        //     duplicate ("query").classList.remove("hide");
        // }
    });
    
    document.getElementById("addHeader").addEventListener(("click"),function(){
        document.getElementById("headers").classList.remove("hide");
        duplicate("header").classList.remove("hide");
        // if(headerCounter === 0){
        //     document.getElementById("headers").classList.remove("hide");
        //     ++headerCounter;
        // }
        // else{
        //     duplicate ("header").classList.remove("hide");
        // }
    });
    
    document.getElementById('saveBtn').onclick = saveIt;
    document.getElementById('sendBtn').onclick = sendRequest;
    document.getElementById('favorite').onchange = menuItems;
};


var RequestObject = {};

function menuItems(){
    var select = document.getElementById('favorite');
    var value  = select.options[select.selectedIndex].value;
    //RequestObject = localStorage.getItem(value);
    RequestObject = JSON.parse(localStorage.getItem(value));
    console.log(RequestObject);
    populateForm();
}

function populateForm(){
    var urlField = document.getElementById('url');
    urlField.value = RequestObject.url;

    var select = document.getElementById('httpMethod');
    select.value = RequestObject.method;

    var requestName = document.getElementById('requestName');
    requestName.value = RequestObject.savedName;

    var headers = RequestObject['header'];
    if(headers)
        document.getElementById("headers").classList.remove("hide");
    var len = headers.length;
    var i = 1;
    for (var k in headers){
        var idName = "header" + i;
        var h = document.getElementById(idName);
        if(!h){
            duplicate("header").classList.remove("hide");
        }
        h.children[0].value = k;
        h.children[1].value = headers[k];
        ++i;
    }


    var params  = RequestObject['params'];
    if(params)
        document.getElementById("queries").classList.remove("hide");
    i = 1;
    for (var k in params){
        idName = "query" + i;
        h = document.getElementById(idName);
        if(!h){
            duplicate("query").classList.remove("hide");
        }
        h.children[0].value = k;
        h.children[1].value = params[k];
        ++i;
    }


}
function saveIt() {
    if(!validateForm(true))
        return false;

    makeObject();
    var savedName = RequestObject.savedName;
    if(savedName ==='')
        alert("The Request Name field cannot be empty to save.");
    else{
        //localStorage.setItem(savedName, RequestObject);
        localStorage.setItem(savedName, JSON.stringify(RequestObject));
        var favorite = document.getElementById("favorite");
        var option = document.createElement("OPTION");
        option.appendChild(document.createTextNode(savedName));
        favorite.appendChild(option);
        option.setAttribute("value", savedName);
        //option.onclick = "menuItems(this);";
    }
}

function deleteRow(deleteBtn) {
    var parent = deleteBtn.parentElement;
    var rowId = parent.id;
    if(parent.parentElement.id=="queries")
        --queryCounter;
    else
        --headerCounter;
    if (rowId.slice(-1) == '0'){
        parent.classList.add('hide');
        parent.children[0].value = "";
        parent.children[1].value = "";
    }
    else
        parent.parentNode.removeChild(parent);
}


function makeObject(){
    RequestObject ={};
    var Headers = document.getElementsByClassName('header');
    var i = 0;
    if (!RequestObject['header']) {
        RequestObject['header'] ={};
    }
    //Looping over the Headers
    for(i; i<Headers.length; i++) {
        //TODO:: Check headers and values to make sure they are valid before adding them to object
        if (Headers[i].children[0].value != '') {
            RequestObject['header'][Headers[i].children[0].value] = Headers[i].children[1].value;
        }
    }
    var Params = document.getElementsByClassName('query');
    if (!RequestObject['params']) {
        RequestObject['params'] ={};
    }
    //Looping over the Params
    for(i=0; i< Params.length; i++) {
        //TODO:: Check Params and values to make sure they are valid before adding them to object
        if (Params[i].children[0].value != '') {
            RequestObject['params'][Params[i].children[0].value] = Params[i].children[1].value;
        }
    }
    var UrlVal= document.getElementById('url').value;
    if (UrlVal !='') {
        if (!RequestObject['url']) {
            RequestObject['url'] ={};
        } 
        RequestObject['url'] = UrlVal;
    }

    var RequestMethodVal = document.getElementById('httpMethod').value;
    if (RequestMethodVal !='') {
        if (!RequestObject['method']) {
            RequestObject['method'] ={};
        } 
        RequestObject['method'] = RequestMethodVal;
    }
    console.log(RequestObject);

    var savedName = document.getElementById('requestName').value;
    if (!RequestObject['savedName'])
        RequestObject['savedName'] = {};

    RequestObject['savedName'] = savedName;

}
function getParamString(){
    var params  = RequestObject['params'];
    var paramString = "";
    var i = 0;
    for (var k in params){
        if(i!==0)
            paramString+="&";
        
        paramString += k + '=' + params[k];
        ++i;
    }
    return paramString;
}
function makeURLString(){
    var urlString = RequestObject.url;
    if(getParamString().length > 0)
        urlString += '?' + getParamString();
    return urlString;
}

function updatePreview(){
    makeObject();
    var urlPreview = document.getElementById("urlPreview");
    var headerPreview = document.getElementById("headerPreview");
    var url = makeURLString();
    if(url)
        urlPreview.innerText = url;
    else
        urlPreview.innerText = "";
    var h = RequestObject.header;

    if(h.length > 0){
        for (var k in h){
            headerPreview.innerText = k + " : " + h[k] + '\n';
        }
    }
    else
        headerPreview.innerText = "";
}
function sendRequest() {
    if(!validateForm(false))
        return false;

    makeObject();

    //ajax
    var xhr       = createXHR();
    var headers   = RequestObject['header'];
    var method    = RequestObject.method;
    // var url       = RequestObject.url;
    // var urlString = url;

    if(xhr){
        // if(getParamString.length > 0)
        //          urlString += '?' + getParamString();
        xhr.open(method, makeURLString(), true);
        //xhr.open(method, urlString, true);

        for (var k in headers) {
            xhr.setRequestHeader(k,headers[k]);
        }

        xhr.onreadystatechange = function(){
            handleResponse(xhr);

        };

        if(method==='post')
            xhr.send(getParamString());
        else
            xhr.send(null);
    }

}
function validateForm(isSave){
    document.getElementById("helpBlock2").innerText = "";
    var valid = true;
    var requestName = document.getElementById("requestName").value;
    var url = document.getElementById('url').value;
    //var alphanumeric = new RegExp("/^[a-z0-9]+$/i");
    var alphanumeric = new RegExp("/^([0-9]|[a-z])+([0-9a-z]+)$/i");


    var res = url.match(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null){
        document.getElementById("helpBlock2").innerText = "please Enter a valid URL.";
        return false;
    }

    else {
        if(isSave){
            var res = requestName.match(/^[a-z0-9]+$/i);
            if(res == null){
                document.getElementById("helpBlock2").innerText = "Please enter an alphanumeric request name to be saved.";
                return false;
            }
        }
        return true;
    }
}

function handleResponse(xhr){
    if(xhr.readyState == 4 && xhr.status == 200){
        //var response = xhr.responseXML;
        var response = xhr.responseText;
        document.getElementById("responseOutput").innerText = response;
    }
}

function createXHR()
{
    try{return new XMLHttpRequest();}catch(e){}
    try{return new ActiveXObject("Msxml2.XMLHTTP.6.0");}catch(e){}
    try{return new ActiveXObject("Msxml2.XMLHTTP.3.0");}catch(e){}
    try{return new ActiveXObject("Msxml2.XMLHTTP");}catch(e){}
    try{return new ActiveXObject("Microsoft.XMLHTTP");}catch(e){}
    alert("XMLHttpRequest not supported");
    return null;
}


//https://www.mockable.io/
//http://demo8696341.mockable.io/gettest

//https://pokeapi.co/api/v2/pokemon

// there's a working GET mockable here http://demo7266716.mockable.io/greeting
//and a POST mockable here http://demo7266716.mockable.io/takemydata