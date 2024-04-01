"use strict";
const body = document.getElementById("body");
const themeButton = document.getElementById("modo-tema");
const sun = document.getElementById("sol");
const moon = document.getElementById("luna");
themeButton.addEventListener("click", () => {
    if (sun.classList.contains("oculto")) {
        sun.classList.remove("oculto");
        moon.classList.add("oculto");
    }
    else {
        sun.classList.add("oculto");
        moon.classList.remove("oculto");
    }
    modoOscuro();
});
function modoOscuro() {
    body.classList.toggle("dark");
}
