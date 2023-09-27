export const calculateTotal = (processedProducts) => {
  return processedProducts.reduce((total, product) => {
    return total + product.product.price * product.quantity;
  }, 0);
};

export const decimalToInteger = (totalAmount) => {
  // Convertir el número a una cadena y reemplazar el punto con una cadena vacía
  const integerString = totalAmount.split(',');
  // Convierte la cadena resultante a un número entero
  const integerValue = parseInt(integerString.join(''));
  return integerValue;
}