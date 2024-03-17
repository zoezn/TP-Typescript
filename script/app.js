var historialContenedor = document.getElementById("historial-contenedor");
var btnAbrirModal = document.getElementById("btn-add-gasto");
var modalAgregarGasto = document.querySelector(".agregar-gasto");
var btnAgregarNuevoGasto = document.querySelector("#btn-aceptar");
var btnCancelarNuevoGasto = document.querySelector("#btn-cancelar");
var errorNombre = document.querySelector(".error-nombre");
var errorTotal = document.querySelector(".error-total");
var errorFecha = document.querySelector(".error-fecha");
var errorCat = document.querySelector(".error-cat");
var blurSpan = document.querySelector(".blur");
var formulario = document.querySelector("form");
var inputNombre = document.getElementById("input-nombre");
var inputFecha = document.getElementById("input-fecha");
var inputTotal = document.getElementById("input-total");
var inputCategoria = (document.getElementById("select-categorias"));
// Utiles
var esPrimo = function (num) {
    for (var i = 2, s = Math.sqrt(num); i <= s; i++) {
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
var historial = JSON.parse(localStorage.getItem("historial") || []);
// Renderizado de historial de gastos
function renderizarGastos() {
    historialContenedor.innerHTML = "";
    Array.isArray(historial) &&
        (historial === null || historial === void 0 ? void 0 : historial.forEach(function (g, i) {
            return (historialContenedor.innerHTML += "\n        <div class=\"gasto ".concat(esPrimo(i + 1) ? "impar" : "par", "\">\n            <h3>").concat(g.fecha, "</h3> \n            <h2>").concat(g.nombre, "</h2> \n            <p>").concat(g.categoria, "</p>\n            <p>").concat(g.total, "</p> \n            </div>\n        "));
        }));
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
    var inputVacio = false;
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
        var nuevoGasto = {
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
// Graficos
