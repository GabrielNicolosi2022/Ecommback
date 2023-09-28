export const calculateTotal = (processedProducts) => {
  return processedProducts.reduce((total, product) => {
    return total + product.product.price * product.quantity;
  }, 0);
};

export const decimalToInteger = (value) => {
  let valor = value;

  if (typeof value === 'number') {
    valor = value.toString();
  }

  const integerString = valor.split('.');
  const newIntegerString = integerString.join('')
  const integerValue = parseInt(newIntegerString);

  return integerValue;
};
