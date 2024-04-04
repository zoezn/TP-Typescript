export function totalFormatter(amount) {
    return ("$" +
        amount.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
        }));
}
