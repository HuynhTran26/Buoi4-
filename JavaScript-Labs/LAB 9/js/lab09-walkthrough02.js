/* code goes here */
var stories = document.getElementById("stories");

for (i = 0; i < stories.childNodes.length; i++) {
    if (stories.childNodes[i].nodeType != 3) {
        stories.childNodes[i].style.backgroundColor = "yellow";
    }
}