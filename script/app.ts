import { totalFormatter } from "./utils/utils.js";

// Tipos
type Gasto = {
  nombre: string;
  total: number;
  categoria: string;
  fecha: string;
  comentarios?: string;
};
interface TotalesPorCategoria {
  [key: string]: number;
}

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

let historial: Gasto[] | string = JSON.parse(
  localStorage.getItem("historial") || "{}"
);

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
            <p class='categoria-box'>${g.categoria}</p>
            <p class='total-box'>${totalFormatter(g.total)}</p> 
            <div> <img src='../img/trash-can.svg' class='trashcan' id=${
              "g-" + i
            }/></div> 
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
  Array.isArray(historial) &&
    historial.forEach((e) => {
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
  return {
    Impuestos: impuestos,
    Hogar: hogar,
    Salidas: salidas,
    Regalos: regalos,
    Emergencias: emergencias,
  };
  // console.log(hogar);
  // console.log(impuestos);
  // console.log(emergencias);
  // console.log(salidas);
  // console.log(regalos);
}
let totalesPorCategoria: TotalesPorCategoria = calcularPorcentajes();
// Gráfico
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);
let rows: any[][] = [];

for (const key in totalesPorCategoria) {
  if (Object.prototype.hasOwnProperty.call(totalesPorCategoria, key)) {
    const element = totalesPorCategoria[key];

    element != 0 && rows.push([key, element]);
  }
}
function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Categoría");
  data.addColumn("number", "Gasto total");
  data.addRows(rows);

  let options: google.visualization.PieChartOptions = {
    title: "Gastos por categoría:",
    width: 800,
    height: 500,
    backgroundColor: "none",
    colors: ["#38B6D1", "#C2DB9C", "#DBCE9C", "#DB9C9C", "#CF76AB", "#9CA1DB"],
    fontName: "Franklin Gothic Medium",
    titleTextStyle: { bold: false, fontSize: 20 },
    fontSize: 18,
    legend: { position: "bottom", textStyle: { bold: false, fontSize: 14 } },
    pieSliceText: "label",
  };

  // Instantiate and draw our chart, passing in some options.
  let elemento = document.getElementById("grafico-pie");
  if (elemento != null) {
    let chart = new google.visualization.PieChart(elemento);
    chart.draw(data, options);
  }
}
