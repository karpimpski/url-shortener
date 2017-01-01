/*global $*/
var form = document.querySelector('#form');
var urlInput = document.querySelector('#oldurl');
var result = document.querySelector('#result');
  
form.addEventListener('submit', (e) => {
    e.preventDefault();
    var url = urlInput.value;
    if(validUrl(url)){
      urlInput.classList.remove('invalid');
      getData(url);
    }
    else{
      urlInput.classList.add('invalid');
    }
    console.log(url);
});

function getData(url){
  $.get( "/new/" + url, () => {})
  .done((data) => {
    var json = JSON.parse(data);
    var old = url;
    var newUrl = json.new_url;
    var resultString = `You can now reach ${old} at <a href='${newUrl}'>${newUrl}</a>`;
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