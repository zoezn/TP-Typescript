import { totalFormatter } from "./utils/utils.js";

// Tipos
type Gasto = {
  nombre: string;
  total: number;
  categoria: string;
  fecha: Date;
};
interface TotalesPorCategoria {
  [key: string]: number;
}
interface rowChart {
  mes: string;
  total: number;
}
interface dataChart {
  [key: string]: rowChart[];
  hogar: rowChart[];
  impuestos: rowChart[];
  emergencias: rowChart[];
  salidas: rowChart[];
  regalos: rowChart[];
}

const historialContenedor: HTMLElement = document.getElementById(
  "historial-contenedor"
) as HTMLElement;
const btnAbrirModal: HTMLElement = document.getElementById(
  "btn-add-gasto"
) as HTMLElement;
const btnAbrirModalSec: HTMLElement = document.getElementById(
  "btn-add-gasto-sec"
) as HTMLElement;
const modalAgregarGasto: HTMLElement = document.querySelector(
  ".agregar-gasto"
) as HTMLElement;
const modalBorrarGasto: HTMLElement = document.querySelector(
  ".borrar-gasto"
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

let aceptarBorrar = <HTMLSelectElement>(
  document.getElementById("btn-aceptar-borrar")
);
let cancelarBorrar = <HTMLSelectElement>(
  document.getElementById("btn-cancelar-borrar")
);
let errorNoGastos = <HTMLSelectElement>(
  document.querySelector(".error-no-gastos")
);
let graficosContenedor = <HTMLSelectElement>(
  document.querySelector(".graficos-contenedor")
);
let filtrosContenedor = <HTMLSelectElement>(
  document.getElementById("filtrar-historial")
);

let botonesBorrar: NodeListOf<Element> =
  document.querySelectorAll(".btn-borrar");

// Utiles
const esPar = (num: number) => {
  return num % 2 === 0;
};
function formatearFecha(fechaString: string): string {
  const aux = new Date(fechaString);
  const dia = aux.getDate();
  const mes = aux.getMonth() + 1;
  const año = aux.getFullYear();

  const fechaFormateada = `${dia < 10 ? "0" : ""}${dia}-${
    mes < 10 ? "0" : ""
  }${mes}-${año}`;

  return fechaFormateada;
}

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
  if (Array.isArray(historial) && historial.length > 0) {
    historial?.forEach(
      (g, i) =>
        (historialContenedor!.innerHTML += `
      <div class="gasto ${esPar(i) ? "impar" : "par"}">
          <p class='fecha-box'>${formatearFecha(g.fecha.toString())}</p>
          <h2>${g.nombre}</h2>
          <p class='categoria-box'>${g.categoria}</p>
          <p class='total-box'>${totalFormatter(g.total)}</p>
          <div id=${i} class="btn-borrar" > <img src='../img/trash-can.svg' class='trashcan hover' /></div>
           </div>
      `)
    );

    botonesBorrar = document.querySelectorAll(".btn-borrar");
    errorNoGastos.classList.add("oculto");
    graficosContenedor.classList.remove("oculto");
    filtrosContenedor.classList.remove("oculto");

    agregarFuncionalidades();
  } else {
    handleVisibilidad(errorNoGastos);
    handleVisibilidad(graficosContenedor);
    handleVisibilidad(filtrosContenedor);
  }
}
renderizarGastos();
let idABorrar: string;
function agregarFuncionalidades() {
  botonesBorrar.forEach((element) =>
    element.addEventListener("click", function (e) {
      idABorrar = element.id;
      handleVisibilidad(blurSpan);
      handleVisibilidad(modalBorrarGasto);
    })
  );
}

aceptarBorrar.addEventListener("click", function () {
  borrarGasto();
});
blurSpan.addEventListener("click", function () {
  handleVisibilidad(blurSpan);

  !modalBorrarGasto.classList.contains("oculto") &&
    modalBorrarGasto.classList.add("oculto");
  !modalAgregarGasto.classList.contains("oculto") &&
    modalAgregarGasto.classList.add("oculto");
});
cancelarBorrar.addEventListener("click", function () {
  handleVisibilidad(blurSpan);

  handleVisibilidad(modalBorrarGasto);
});

function borrarGasto() {
  Array.isArray(historial) &&
    idABorrar &&
    historial.splice(parseFloat(idABorrar), 1);
  localStorage.setItem("historial", JSON.stringify(historial));
  drawChart();
  drawChart2();
  renderizarGastos();
  handleVisibilidad(blurSpan);
  handleVisibilidad(modalBorrarGasto);
}

btnAbrirModal?.addEventListener("click", function (e) {
  handleVisibilidad(blurSpan);
  handleVisibilidad(modalAgregarGasto);
});
btnAbrirModalSec?.addEventListener("click", function (e) {
  handleVisibilidad(blurSpan);
  handleVisibilidad(modalAgregarGasto);
});

btnAgregarNuevoGasto?.addEventListener("click", function (e) {
  e.preventDefault();
  let inputVacio: boolean = false;
  let aux = [
    { input: inputNombre, error: errorNombre },
    { input: inputTotal, error: errorTotal },
    { input: inputFecha, error: errorFecha },
    { input: inputCategoria, error: errorCat },
  ];

  aux.forEach((e) => {
    if (!e || !e.input.value) {
      inputVacio = true;
      e.input.classList.add("error");
      handleVisibilidad(e.error);
    }
  });

  if (inputVacio === false) {
    let nuevoGasto: Gasto = {
      nombre: inputNombre.value,
      fecha: new Date(inputFecha.value),
      total: parseInt(inputTotal.value),
      categoria: inputCategoria.value,
    };
    Array.isArray(historial) && historial?.push(nuevoGasto);
    localStorage.setItem("historial", JSON.stringify(historial));
    historial = JSON.parse(localStorage.getItem("historial") || "{}");
    renderizarGastos();
    drawChart();
    drawChart2();
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
}

let ultMeses: any[] = [];

let data: dataChart = {
  hogar: [
    { mes: "enero", total: 0 },
    { mes: "febrero", total: 0 },
    { mes: "marzo", total: 0 },
    { mes: "abril", total: 0 },
    { mes: "mayo", total: 0 },
    { mes: "junio", total: 0 },
    { mes: "julio", total: 0 },
    { mes: "agosto", total: 0 },
    { mes: "septiembre", total: 0 },
    { mes: "octubre", total: 0 },
    { mes: "noviembre", total: 0 },
    { mes: "diciembre", total: 0 },
  ],
  impuestos: [
    { mes: "enero", total: 0 },
    { mes: "febrero", total: 0 },
    { mes: "marzo", total: 0 },
    { mes: "abril", total: 0 },
    { mes: "mayo", total: 0 },
    { mes: "junio", total: 0 },
    { mes: "julio", total: 0 },
    { mes: "agosto", total: 0 },
    { mes: "septiembre", total: 0 },
    { mes: "octubre", total: 0 },
    { mes: "noviembre", total: 0 },
    { mes: "diciembre", total: 0 },
  ],
  emergencias: [
    { mes: "enero", total: 0 },
    { mes: "febrero", total: 0 },
    { mes: "marzo", total: 0 },
    { mes: "abril", total: 0 },
    { mes: "mayo", total: 0 },
    { mes: "junio", total: 0 },
    { mes: "julio", total: 0 },
    { mes: "agosto", total: 0 },
    { mes: "septiembre", total: 0 },
    { mes: "octubre", total: 0 },
    { mes: "noviembre", total: 0 },
    { mes: "diciembre", total: 0 },
  ],
  salidas: [
    { mes: "enero", total: 0 },
    { mes: "febrero", total: 0 },
    { mes: "marzo", total: 0 },
    { mes: "abril", total: 0 },
    { mes: "mayo", total: 0 },
    { mes: "junio", total: 0 },
    { mes: "julio", total: 0 },
    { mes: "agosto", total: 0 },
    { mes: "septiembre", total: 0 },
    { mes: "octubre", total: 0 },
    { mes: "noviembre", total: 0 },
    { mes: "diciembre", total: 0 },
  ],
  regalos: [
    { mes: "enero", total: 0 },
    { mes: "febrero", total: 0 },
    { mes: "marzo", total: 0 },
    { mes: "abril", total: 0 },
    { mes: "mayo", total: 0 },
    { mes: "junio", total: 0 },
    { mes: "julio", total: 0 },
    { mes: "agosto", total: 0 },
    { mes: "septiembre", total: 0 },
    { mes: "octubre", total: 0 },
    { mes: "noviembre", total: 0 },
    { mes: "diciembre", total: 0 },
  ],
};

const mesesS: string[] = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
function calcGastosPorMes() {
  const mesActual = new Date().getMonth() + 1;
  const meses: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  ultMeses = [];
  if (mesActual < 5) {
    switch (mesActual) {
      case 5:
        ultMeses = [12, 1, 2, 3, 4, 5];
        break;
      case 4:
        ultMeses = [11, 12, 1, 2, 3, 4];
        break;
      case 3:
        ultMeses = [10, 11, 12, 1, 2, 3];
        break;
      case 2:
        ultMeses = [9, 10, 11, 12, 1, 2];
        break;
      case 1:
        ultMeses = [8, 9, 10, 11, 12, 1];
        break;
    }
  } else {
    ultMeses.push(mesActual);
    for (let i = 0; i <= 5; i++) {
      ultMeses.push(mesActual + 1);
    }
  }
  ultMeses.forEach((e) => {
    ultMeses.push(mesesS[e - 1]);
  });
  ultMeses.splice(0, 6);

  let auxFecha: Date;
  Array.isArray(historial) &&
    historial.forEach((e) => {
      auxFecha = new Date(e.fecha);

      data.hogar[auxFecha.getMonth()].total = 0;
      data.impuestos[auxFecha.getMonth()].total = 0;
      data.emergencias[auxFecha.getMonth()].total = 0;
      data.salidas[auxFecha.getMonth()].total = 0;
      data.regalos[auxFecha.getMonth()].total = 0;
      switch (e.categoria) {
        case "hogar":
          data.hogar[auxFecha.getMonth()].total += e.total;
          break;
        case "impuestos":
          data.impuestos[auxFecha.getMonth()].total += e.total;
          break;
        case "emergencias":
          data.emergencias[auxFecha.getMonth()].total += e.total;
          break;
        case "salidas":
          data.salidas[auxFecha.getMonth()].total += e.total;
          break;
        case "regalos":
          data.regalos[auxFecha.getMonth()].total += e.total;
          break;
      }
    });
}
calcGastosPorMes();
let totalesPorCategoria: TotalesPorCategoria;

// Gráfico de torta
google.charts.load("current", { packages: ["corechart"] });
if (historial.length > 0) {
  google.charts.setOnLoadCallback(drawChart);
}
let rows: any[][] = [];
function drawChart() {
  let data = new google.visualization.DataTable();
  rows = [];
  totalesPorCategoria = calcularPorcentajes();
  for (const key in totalesPorCategoria) {
    if (Object.prototype.hasOwnProperty.call(totalesPorCategoria, key)) {
      const element = totalesPorCategoria[key];

      element != 0 && rows.push([key, element]);
    }
  }
  data.addColumn("string", "Categoría");
  data.addColumn("number", "Gasto total");
  data.addRows(rows);

  let options: google.visualization.PieChartOptions = {
    title: "Gastos por categoría:",
    width: 500,
    height: 500,
    backgroundColor: "none",
    colors: ["#38B6D1", "#C2DB9C", "#DBCE9C", "#DB9C9C", "#CF76AB", "#9CA1DB"],
    fontName: "Franklin Gothic Medium",
    titleTextStyle: { bold: false, fontSize: 20 },
    fontSize: 18,
    legend: { position: "bottom", textStyle: { bold: false, fontSize: 14 } },
    pieSliceText: "label",
  };

  let elemento = document.getElementById("grafico-pie");
  if (elemento != null) {
    let chart = new google.visualization.PieChart(elemento);
    chart.draw(data, options);
  }
}

// Gráfico de barras
google.charts.load("current", { packages: ["corechart"] });
if (historial.length > 0) {
  google.charts.setOnLoadCallback(drawChart2);
}
function drawChart2() {
  calcGastosPorMes();
  const config = [
    "Mes",
    "Hogar",
    "Impuestos",
    "Emergencias",
    "Salidas",
    "Regalos",
    { role: "annotation" },
  ];
  let dataChart: any[] = [
    // [
    //   "Mes",
    //   "Hogar",
    //   "Impuestos",
    //   "Emergencias",
    //   "Salidas",
    //   "Regalos",
    //   { role: "annotation" },
    // ],
  ];

  dataChart = [];
  dataChart.push(config);
  // dataChart.push();
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  ultMeses.forEach((m) => {
    let arrAux = [];
    arrAux.push(capitalizeFirstLetter(m));
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key].forEach((e) => {
          if (e.mes === m) {
            arrAux.push(e.total);
          }
        });
      }
    }
    arrAux.push("");
    dataChart.push(arrAux);
  });

  let dataAux = google.visualization.arrayToDataTable(dataChart);

  let view = new google.visualization.DataView(dataAux);
  view.setColumns([0, 1, 2, 3, 4, 5, 6]);

  var options: google.visualization.BarChartOptions = {
    title: "Gastos en los últimos 6 meses por categoría:",
    width: 600,
    height: 400,
    fontName: "Franklin Gothic Medium",
    legend: { position: "bottom", maxLines: 3 },
    bar: { groupWidth: "75%" },
    isStacked: true,
    titleTextStyle: { bold: false, fontSize: 20 },
    fontSize: 14,
    backgroundColor: "none",
    colors: ["#C2DB9C", "#9CA1DB", "#DBCE9C", "#38B6D1", "#DB9C9C", "#CF76AB"],
  };

  let elemento = document.getElementById("grafico-lineas");
  if (elemento != null) {
    let chart = new google.visualization.BarChart(elemento);
    chart.draw(view, options);
  }
}
