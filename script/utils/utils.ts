export function totalFormatter(amount: Number): string {
  return (
    "$" +
    amount.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
    })
  );
}
