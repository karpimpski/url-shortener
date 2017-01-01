/*global $*/
var form = document.querySelector('#form');
var urlInput = document.querySelector('#oldurl');
var result = document.querySelector('#result');
  
form.addEventListener('submit', (e) => {
    e.preventDefault();
    var url = urlInput.value;
    if(validUrl(url)){
      getData(url);
    }
    else{
      alert("please enter a valid URL");
    }
    console.log(url);
})

function getData(url){
  $.get( "/new/" + url, () => {})
  .done((data) => {
    alert(data);
    var json = JSON.parse(data);
    var old = url;
    var newUrl = json.new_url;
    var resultString = `You can now reach ${old} at ${newUrl}`;
    result.innerHTML = resultString;
  })
  
  .fail((err) => {
    console.log(err.responseText + err.statusText);
  });
}

function validUrl(str) {
  var regexp = /[\S]+[.][\S]+/i;
  return regexp.test(str);
}