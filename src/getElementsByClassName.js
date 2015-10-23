// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className, node) {
    var matches = [];

    node = node || document.body;

    var nodeClasses = node.className.split(" ");

    nodeClasses.indexOf(className) >= 0 ? matches.push(node) : null;

    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            matches = matches.concat(getElementsByClassName(className, node.children[i]));
        }
    }

    return matches;
};