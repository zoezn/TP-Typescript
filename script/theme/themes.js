var themeButton = document.getElementById("modo-tema");
var sun = document.getElementById("sol");
var moon = document.getElementById("luna");
themeButton.addEventListener("click", function () {
    if (sun.classList.contains("oculto")) {
        sun.classList.remove("oculto");
        moon.classList.add("oculto");
    }
    else {
        sun.classList.add("oculto");
        moon.classList.remove("oculto");
    }
});
