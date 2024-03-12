// Tipos
type Gasto = {
  nombre: string;
  total: number;
  categoria: string;
};

const historialContenedor = document.getElementById("historial-contenedor");
const btnAbrirModal = document.getElementById("btn-add-gasto");
const modalAgregarGasto = document.querySelector(".agregar-gasto");
const btnAgregarNuevoGasto = document.querySelector("#btn-aceptar");
const formulario = document.querySelector("form");
let inputNombre = <HTMLInputElement>document.getElementById("input-nombre");
let inputTotal = <HTMLInputElement>document.getElementById("input-total");
let inputCategoria = <HTMLSelectElement>(
  document.getElementById("select-categorias")
);

// Utiles
const esPrimo = (num: number) => {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
};
// Informacion
let historial: Gasto[] = [
  {
    nombre: "Luz",
    total: 1000,
    categoria: "impuestos",
  },
  {
    nombre: "Alquiler",
    total: 350000,
    categoria: "hogar",
  },
];

// Renderizado de historial de gastos
function renderizarGastos() {
  historialContenedor?.innerHTML = null;
  historial.forEach(
    (g, i) =>
      (historialContenedor?.innerHTML += `
        <div class="gasto ${esPrimo(i + 1) ? "impar" : "par"}">
            <h2>${g.nombre}</h2> 
            <p>${g.categoria}</p>
            <p>${g.total}</p> 
            </div>
        `)
  );
}
renderizarGastos();

function agregarGasto() {
  historial.push();
}

function handleVisibilidad(elemento: Element) {
  elemento?.classList.remove("oculto");
  // console.log("hizo click");
}

btnAbrirModal?.addEventListener("click", function (e) {
  handleVisibilidad(modalAgregarGasto);
});

btnAgregarNuevoGasto?.addEventListener("click", function (e) {
  e.preventDefault();
  let inputVacio: boolean = false;
  if (!inputNombre || !inputNombre.value) {
    inputVacio = true;
    inputNombre.classList.add("error");
    console.log("ingrese nombre");
  }
  if (!inputTotal || !inputTotal.value) {
    inputVacio = true;
    inputTotal.classList.add("error");
    console.log("ingrese total");
  }
  if (!inputCategoria || !inputCategoria.value) {
    inputVacio = true;
    inputCategoria.classList.add("error");
    console.log("elija categoria");
  }
  if (inputVacio === false) {
    let nuevoGasto: Gasto = {
      nombre: inputNombre.value,
      total: parseInt(inputTotal.value),
      categoria: inputCategoria.value,
    };
    historial.push(nuevoGasto);
    renderizarGastos();
    modalAgregarGasto?.classList.add("oculto");
  }
});
