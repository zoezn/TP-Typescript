import { totalFormatter } from "./utils/utils.js";
const historialContenedor = document.getElementById("historial-contenedor");
const btnAbrirModal = document.getElementById("btn-add-gasto");
const modalAgregarGasto = document.querySelector(".agregar-gasto");
const btnAgregarNuevoGasto = document.querySelector("#btn-aceptar");
const btnCancelarNuevoGasto = document.querySelector("#btn-cancelar");
const errorNombre = document.querySelector(".error-nombre");
const errorTotal = document.querySelector(".error-total");
const errorFecha = document.querySelector(".error-fecha");
const errorCat = document.querySelector(".error-cat");
const blurSpan = document.querySelector(".blur");
const formulario = document.querySelector("form");
let inputNombre = document.getElementById("input-nombre");
let inputFecha = document.getElementById("input-fecha");
let inputTotal = document.getElementById("input-total");
let inputCategoria = (document.getElementById("select-categorias"));
// Gráficos
// Utiles
const esPrimo = (num) => {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if (num % i === 0)
            return false;
    }
    return num > 1;
};
function handleVisibilidad(elemento) {
    elemento.classList.contains("oculto")
        ? elemento.classList.remove("oculto")
        : elemento.classList.add("oculto");
}
let historial = JSON.parse(localStorage.getItem("historial") || "{}");
// Renderizado de historial de gastos
function renderizarGastos() {
    historialContenedor.innerHTML = "";
    Array.isArray(historial) &&
        (historial === null || historial === void 0 ? void 0 : historial.forEach((g, i) => (historialContenedor.innerHTML += `
        <div class="gasto ${esPrimo(i + 1) ? "impar" : "par"}">
            <h3>${g.fecha}</h3> 
            <h2>${g.nombre}</h2> 
            <p class='categoria-box'>${g.categoria}</p>
            <p class='total-box'>${totalFormatter(g.total)}</p> 
            <div> <img src='../img/trash-can.svg' class='trashcan' id=${"g-" + i}/></div> 
            </div>
        `)));
    calcularPorcentajes();
}
renderizarGastos();
function agregarGasto() {
    Array.isArray(historial) && (historial === null || historial === void 0 ? void 0 : historial.push());
}
// Modal Nuevo Gasto
btnAbrirModal === null || btnAbrirModal === void 0 ? void 0 : btnAbrirModal.addEventListener("click", function (e) {
    handleVisibilidad(blurSpan);
    handleVisibilidad(modalAgregarGasto);
});
btnAgregarNuevoGasto === null || btnAgregarNuevoGasto === void 0 ? void 0 : btnAgregarNuevoGasto.addEventListener("click", function (e) {
    e.preventDefault();
    let inputVacio = false;
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
        let nuevoGasto = {
            nombre: inputNombre.value,
            fecha: inputFecha.value,
            total: parseInt(inputTotal.value),
            categoria: inputCategoria.value,
        };
        Array.isArray(historial) && (historial === null || historial === void 0 ? void 0 : historial.push(nuevoGasto));
        localStorage.setItem("historial", JSON.stringify(historial));
        renderizarGastos();
        modalAgregarGasto === null || modalAgregarGasto === void 0 ? void 0 : modalAgregarGasto.classList.add("oculto");
        handleVisibilidad(blurSpan);
    }
});
btnCancelarNuevoGasto === null || btnCancelarNuevoGasto === void 0 ? void 0 : btnCancelarNuevoGasto.addEventListener("click", function (e) {
    e.preventDefault();
    inputNombre.value = "";
    inputTotal.value = "";
    inputCategoria.value = "";
    inputFecha.value = "";
    handleVisibilidad(blurSpan);
    handleVisibilidad(modalAgregarGasto);
});
function calcularPorcentajes() {
    let hogar = 0;
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
let totalesPorCategoria = calcularPorcentajes();
// Gráfico
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);
let rows = [];
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
    let options = {
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
