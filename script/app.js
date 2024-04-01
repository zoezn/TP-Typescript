import { render } from "./charts/pieChart";
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
const canvas = document.getElementById("pieChart");
const stringValues = canvas.getAttribute("values");
const stringLabels = canvas.getAttribute("labels");
const values = JSON.parse(stringValues);
const labels = JSON.parse(stringLabels);
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
let historial = JSON.parse(localStorage.getItem("historial"));
// Renderizado de historial de gastos
function renderizarGastos() {
    historialContenedor.innerHTML = "";
    Array.isArray(historial) &&
        (historial === null || historial === void 0 ? void 0 : historial.forEach((g, i) => (historialContenedor.innerHTML += `
        <div class="gasto ${esPrimo(i + 1) ? "impar" : "par"}">
            <h3>${g.fecha}</h3> 
            <h2>${g.nombre}</h2> 
            <p>${g.categoria}</p>
            <p>${g.total}</p> 
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
