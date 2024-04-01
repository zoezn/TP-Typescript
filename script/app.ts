import { render } from "./charts/pieChart";

// Tipos
type Gasto = {
  nombre: string;
  total: number;
  categoria: string;
  fecha: string;
};
type Gasto2 = {
  nombre: string;
  total: number;
  categoria: string;
  fecha: Date;
};

const historialContenedor: HTMLElement = document.getElementById(
  "historial-contenedor"
) as HTMLElement;
const btnAbrirModal: HTMLElement = document.getElementById(
  "btn-add-gasto"
) as HTMLElement;
const modalAgregarGasto: HTMLElement = document.querySelector(
  ".agregar-gasto"
) as HTMLElement;
const btnAgregarNuevoGasto: HTMLElement = document.querySelector(
  "#btn-aceptar"
) as HTMLElement;
const btnCancelarNuevoGasto: HTMLElement = document.querySelector(
  "#btn-cancelar"
) as HTMLElement;
const errorNombre: HTMLElement = document.querySelector(
  ".error-nombre"
) as HTMLElement;
const errorTotal: HTMLElement = document.querySelector(
  ".error-total"
) as HTMLElement;
const errorFecha: HTMLElement = document.querySelector(
  ".error-fecha"
) as HTMLElement;
const errorCat: HTMLElement = document.querySelector(
  ".error-cat"
) as HTMLElement;
const blurSpan: HTMLElement = document.querySelector(".blur") as HTMLElement;
const formulario = document.querySelector("form");
let inputNombre = <HTMLInputElement>document.getElementById("input-nombre");
let inputFecha = <HTMLInputElement>document.getElementById("input-fecha");
let inputTotal = <HTMLInputElement>document.getElementById("input-total");
let inputCategoria = <HTMLSelectElement>(
  document.getElementById("select-categorias")
);

// Gráficos
const canvas: HTMLCanvasElement = document.getElementById(
  "pieChart"
) as HTMLCanvasElement;
const stringValues = canvas.getAttribute("values");
const stringLabels = canvas.getAttribute("labels");
const values: number[] = JSON.parse(stringValues);
const labels: string[] = JSON.parse(stringLabels);

// Utiles
const esPrimo = (num: number) => {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
};

function handleVisibilidad(elemento: Element) {
  elemento.classList.contains("oculto")
    ? elemento.classList.remove("oculto")
    : elemento.classList.add("oculto");
}

let historial: Gasto[] | string = JSON.parse(localStorage.getItem("historial"));

// Renderizado de historial de gastos
function renderizarGastos() {
  historialContenedor.innerHTML = "";
  Array.isArray(historial) &&
    historial?.forEach(
      (g, i) =>
        (historialContenedor!.innerHTML += `
        <div class="gasto ${esPrimo(i + 1) ? "impar" : "par"}">
            <h3>${g.fecha}</h3> 
            <h2>${g.nombre}</h2> 
            <p>${g.categoria}</p>
            <p>${g.total}</p> 
            </div>
        `)
    );
  calcularPorcentajes();
}
renderizarGastos();

function agregarGasto() {
  Array.isArray(historial) && historial?.push();
}

// Modal Nuevo Gasto
btnAbrirModal?.addEventListener("click", function (e) {
  handleVisibilidad(blurSpan);
  handleVisibilidad(modalAgregarGasto);
});

btnAgregarNuevoGasto?.addEventListener("click", function (e) {
  e.preventDefault();
  let inputVacio: boolean = false;
  if (!inputNombre || !inputNombre.value) {
    inputVacio = true;
    inputNombre.classList.add("error");
    handleVisibilidad(errorNombre);
  }
  if (!inputTotal || !inputTotal.value) {
    inputVacio = true;
    inputTotal.classList.add("error");
    handleVisibilidad(errorTotal);
  }
  if (!inputFecha || !inputFecha.value) {
    inputVacio = true;
    inputFecha.classList.add("error");
    handleVisibilidad(errorFecha);
  }
  if (!inputCategoria || !inputCategoria.value) {
    inputVacio = true;
    inputCategoria.classList.add("error");
    handleVisibilidad(errorCat);
  }
  if (inputVacio === false) {
    let nuevoGasto: Gasto = {
      nombre: inputNombre.value,
      fecha: inputFecha.value,
      total: parseInt(inputTotal.value),
      categoria: inputCategoria.value,
    };
    Array.isArray(historial) && historial?.push(nuevoGasto);
    localStorage.setItem("historial", JSON.stringify(historial));
    renderizarGastos();
    modalAgregarGasto?.classList.add("oculto");
    handleVisibilidad(blurSpan);
  }
});

btnCancelarNuevoGasto?.addEventListener("click", function (e) {
  e.preventDefault();
  inputNombre.value = "";
  inputTotal.value = "";
  inputCategoria.value = "";
  inputFecha.value = "";

  handleVisibilidad(blurSpan);
  handleVisibilidad(modalAgregarGasto);
});

function calcularPorcentajes() {
  let hogar: number = 0;
  let impuestos = 0;
  let emergencias = 0;
  let salidas = 0;
  let regalos = 0;
  // let aux: Gasto[];
  historial.map((e) => {
    switch (e.categoria) {
      case "hogar":
        hogar += e.total;
        break;
      case "impuestos":
        impuestos += e.total;
        break;
      case "emergencias":
        emergencias += e.total;
        break;
      case "salidas":
        salidas += e.total;
        break;
      case "regalos":
        regalos += e.total;
        break;
    }
  });

  let total = hogar + impuestos + emergencias + salidas + regalos;
  hogar = (hogar * 100) / total;
  impuestos = (impuestos * 100) / total;
  emergencias = (emergencias * 100) / total;
  salidas = (salidas * 100) / total;
  regalos = (regalos * 100) / total;

  let aux = [hogar, impuestos, emergencias, salidas, regalos];
  stringValues = JSON.stringify(aux);
  console.log(stringLabels);
  console.log(stringValues);
  render();
}
