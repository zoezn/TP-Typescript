const body: HTMLElement = document.getElementById("body") as HTMLElement;
const themeButton: HTMLElement = document.getElementById(
  "modo-tema"
) as HTMLElement;
const sun: HTMLElement = document.getElementById("sol") as HTMLElement;
const moon: HTMLElement = document.getElementById("luna") as HTMLElement;

themeButton.addEventListener("click", () => {
  if (sun.classList.contains("oculto")) {
    sun.classList.remove("oculto");
    moon.classList.add("oculto");
  } else {
    sun.classList.add("oculto");
    moon.classList.remove("oculto");
  }
  modoOscuro();
});

function modoOscuro() {
  body.classList.toggle("dark");
}
