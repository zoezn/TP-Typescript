var historialContenedor = document.getElementById("historial-contenedor");
var btnAbrirModal = document.getElementById("btn-add-gasto");
var modalAgregarGasto = document.querySelector(".agregar-gasto");
var btnAgregarNuevoGasto = document.querySelector("#btn-aceptar");
var btnCancelarNuevoGasto = document.querySelector("#btn-cancelar");
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
var historial = localStorage.getItem("historial") || [];
console.log(localStorage.getItem("historial"));
// function chequearStorage() {
//   if (Array.isArray(historial) && historial?.length > 0) {
//     renderizarGastos();
//   }
// }
// chequearStorage();
localStorage.getItem("historial");
localStorage.setItem("historial", JSON.stringify(historial));
//  localStorage.setItem('historial',);
// let gastos = localStorage.getItem('historial');
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
function handleVisibilidad(elemento) {
    elemento.classList.contains("oculto")
        ? elemento.classList.remove("oculto")
        : elemento.classList.add("oculto");
}
btnAbrirModal === null || btnAbrirModal === void 0 ? void 0 : btnAbrirModal.addEventListener("click", function (e) {
    handleVisibilidad(modalAgregarGasto);
});
btnAgregarNuevoGasto === null || btnAgregarNuevoGasto === void 0 ? void 0 : btnAgregarNuevoGasto.addEventListener("click", function (e) {
    e.preventDefault();
    var inputVacio = false;
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
    }
});
btnCancelarNuevoGasto === null || btnCancelarNuevoGasto === void 0 ? void 0 : btnCancelarNuevoGasto.addEventListener("click", function (e) {
    e.preventDefault();
    inputNombre.value = "";
    inputTotal.value = "";
    inputCategoria.value = "";
    inputFecha.value = "";
    handleVisibilidad(modalAgregarGasto);
});
