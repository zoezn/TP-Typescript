var historialContenedor = document.getElementById("historial-contenedor");
var btnAbrirModal = document.getElementById("btn-add-gasto");
var modalAgregarGasto = document.querySelector(".agregar-gasto");
var btnAgregarNuevoGasto = document.querySelector("#btn-aceptar");
var formulario = document.querySelector("form");
var inputNombre = document.getElementById("input-nombre");
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
// Informacion
var historial = [
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
    historialContenedor === null || historialContenedor === void 0 ? void 0 : historialContenedor.innerHTML = null;
    historial.forEach(function (g, i) {
        return (historialContenedor === null || historialContenedor === void 0 ? void 0 : historialContenedor.innerHTML += "\n        <div class=\"gasto ".concat(esPrimo(i + 1) ? "impar" : "par", "\">\n            <h2>").concat(g.nombre, "</h2> \n            <p>").concat(g.categoria, "</p>\n            <p>").concat(g.total, "</p> \n            </div>\n        "));
    });
}
renderizarGastos();
function agregarGasto() {
    historial.push();
}
function handleVisibilidad(elemento) {
    elemento === null || elemento === void 0 ? void 0 : elemento.classList.remove("oculto");
    // console.log("hizo click");
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
            total: parseInt(inputTotal.value),
            categoria: inputCategoria.value,
        };
        historial.push(nuevoGasto);
        renderizarGastos();
        modalAgregarGasto === null || modalAgregarGasto === void 0 ? void 0 : modalAgregarGasto.classList.add("oculto");
    }
});
