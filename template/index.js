function ham() {
    if (Array.from(document.getElementById("ulNav").classList).includes("hide")) {
        document.getElementById("ulNav").classList.remove("hide");
    } else {
        document.getElementById("ulNav").classList = "hide";
    }
}