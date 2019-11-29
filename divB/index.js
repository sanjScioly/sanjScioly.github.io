function ham() {
    if (Array.from(document.getElementById("ulNav").classList).includes("hide")) {
        document.getElementById("ulNav").classList.remove("hide");
    } else {
        document.getElementById("ulNav").classList = "hide";
    }
}







// //$(document).ready(function () {
// //    alert("All I have so far is Circuit Lab, So Im gonna redirect you there.");
// //    window.location.assign("./CircuitLab/index.html");
// //});