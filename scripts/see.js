/**
 * Created by Hirad on 7/25/2016.
 */


//var SEE={};
window.onload = function () {
    document.getElementById("newRequestBtn").addEventListener("click",function(){
        var hiddens = document.querySelectorAll('[data-display]');
        var i = 0;
        var len = hiddens.length;
        for (i; i < len; i++){
            hiddens[i].classList.remove("hide");
        }
        RequestObject = {};
        console.log(RequestObject);
    });

var queryCounter = 0;
var headerCounter = 0;


function duplicate(idName) {
    console.log(idName + queryCounter);
    var original = document.getElementById(idName + 0);
    var clone = original.cloneNode(true); // "deep" clone
    ++queryCounter;
    clone.children[0].value = "";
    clone.children[1].value = "";
    clone.id = idName + queryCounter; // there can only be one element with an ID
    //clone the event handlers if needed

    original.parentNode.appendChild(clone);
    return clone;
}
document.getElementById("paramsBtn").addEventListener(("click"),function(){
    //TODO:: Finds out why sometime the hide class is not getting removed before duplications
    if(queryCounter === 0){
        document.getElementById("queries").classList.remove("hide");
        ++queryCounter;
    }
    else{
        duplicate ("query");
    }
});

document.getElementById("addHeader").addEventListener(("click"),function(){
    if(headerCounter === 0){
        document.getElementById("headers").classList.remove("hide");
        ++headerCounter;
    }
    else{
        duplicate ("header");
    }
});
document.getElementById('saveBtn').onclick = saveIt;
document.getElementById('sendBtn').onclick = sendRequest;

};


var RequestObject = {};

function saveIt() {
    makeObject();

}
function makeObject(){
    var Headers = document.getElementsByClassName('header');
    var i = 0;
    if (!RequestObject['header']) {
        RequestObject['header'] ={};
    }
    //Looping over the Headers
    for(i; i<Headers.length; i++) {
        console.log(i);
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
        console.log(i);
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



}
function getParamString(){
    var params  = RequestObject['params'];
    var paramString = "";
    var i = 0;
    for (var k in params){
        if(i!==0)
            paramString+="&";

        console.log(k);
        console.log(headers[k]);
        paramString += k + '=' + params[k];
        ++i;
    }
    return paramString;
}

function sendRequest() {
    makeObject();

    //ajax
    var xhr       = createXHR();
    var headers   = RequestObject['header'];
    var method    = RequestObject.method;
    var url       = RequestObject.url;
    var urlString = url;

    if(method==='get'){
        if(getParamString.length > 0)
            urlString += '?' + getParamString();
    }

    xhr.open(method, urlString, true);

    for (var k in headers) {
        console.log(k);
        console.log(headers[k]);
        xhr.setRequestHeader(k,headers[k]);
    }

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status ==200)
            alert(xhr.responseText);
    }

    console.log(xhr);
    xhr.send(null);
}


function createXHR(){
    var xhr;

    try{
        if(window.ActiveXObject) //for IE
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        else
            xhr = new XMLHttpRequest();
    }
    catch (e){
        xhr = false;
    }
    return xhr;
}