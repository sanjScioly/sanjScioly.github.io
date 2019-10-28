












/*
! Enable this function when there are more humans
var githubUrl = "https://api.github.com/repos/sanjScioly/sanjScioly.github.io/contributors";

var contributors = [];
var requestThing = new XMLHttpRequest();
requestThing.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var collab = JSON.parse(this.responseText);
        collab.forEach((item, index) => {
            contributors.push(item);
        });
    }
};
requestThing.open("GET", githubUrl, true);
requestThing.send();

// * loop through the list of collaborators and add stuff

console.log(contributors);
$(document).ready(function () {
    contributors.forEach((item, index) => {
        var imageString = '<img src="' + item.avatar_url + '" class="contributor" onClick="window.location.assign(\'' + item.html_url + '\')" height="40">';
        document.getElementById("contributors").innerHTML += imageString;
    });
});

*/