/* Escenarios de prueba
Tipo de dato incorrecto
Carrito no encontrado (error CartId)
Producto no encontrado (error productId)
La cantidad mínima es 1
Stock insuficiente
Carrito actualizado correctamente (todos los datos son válidos)
 */

const updateCart = (cartId, products, quantity) => {
  const cartIdOk = '64c594d1085825c5ca084d62';
    const productsOk = [{ id: 'd0eaf83dabb3cf21a3fd7afc', quantity: 25 }];
    const stockOk = 25
  if (!cartId) return 'Se esperaba un cartId';
  if (typeof cartId !== 'string') return 'Tipo de dato incorrecto';
  if (cartId !== cartIdOk) return 'Carrito no encontrado';
    if (products !== productsOk) return 'Producto no encontrado';
    if (quantity < 1) return 'La cantidad mínima es 1'
    if (quantity > stockOk) return 'Stock insuficiente'
  return 'Carrito actualizado correctamente';
};
// Escenarios
let testPasados = 0;
let testTotales = 5;
console.log('Uptade Cart Test');
// Test 1: La función debe devolver < Se Esperaba un cartId >
console.log('Test 1: La función debe devolver < No se ha proporcionado un cartId >');
let result1 = updateCart('', 'd0eaf83dabb3cf21a3fd7afc', 32);

if (result1 === 'No se ha proporcionado un cartId') {
  console.log('Test 1: Pasado');
  testPasados++;
} else {
  console.error(
    '* Test 1 fails: se esperaba < No se ha proporcionado un cartId > y se obtuvo',
    result1
  );
}
console.log('----------------------------------------------------------------');
