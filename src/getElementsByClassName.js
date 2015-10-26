// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };
//
//You should use document.body, element.childNodes, and element.classList
//element.childNodes includes an array of objects
//element.classList is an array of classes
// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {

  var matches = [];
  checkElementClass(document.body);

  function checkElementClass(element) {

    if (element.classList && element.classList.contains(className)) {
      matches.push(element);
    }
    for (var i = 0; i < element.childNodes.length; i++) {
      checkElementClass(element.childNodes[i]);
    }
  }

  return matches;

};