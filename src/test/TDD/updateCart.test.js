import getLogger from '../utils/log.utils.js';

const log = getLogger();

/* Escenarios de prueba
Carrito actualizado correctamente (todos los datos son válidos)
 */

const updateCart = (cartId, products, quantity) => {
  const cartIdOk = '64c594d1085825c5ca084d62';
  const productsOk = 'd0eaf83dabb3cf21a3fd7afc';
  const stockOk = 25;

  if (!cartId) return 'No se ha proporcionado un cartId'; // ('', ===,===)
  if (typeof cartId !== 'string') return 'Tipo de dato incorrecto'; // (number, ===,===)
  if (cartId !== cartIdOk) return 'Carrito no encontrado'; // (!==, ===,===)
  if (products !== productsOk) return 'Producto no encontrado'; // (===, !==,===)
  if (quantity < 1) return 'La cantidad mínima es 1'; // (===, ===,0)
  if (quantity > stockOk) return 'Stock insuficiente'; // (===, ===,32)
  return 'Carrito actualizado correctamente'; // (===, ===,16)
};
// Escenarios
let testPasados = 0;
let testTotales = 7;

log.info('Update Cart Test');
// Test 1: La función debe devolver < No se ha proporcionado un cartId >
log.info(
  'Test 1: La función debe devolver < No se ha proporcionado un cartId >'
);
const result1 = updateCart('', 'd0eaf83dabb3cf21a3fd7afc', 32);

if (result1 === 'No se ha proporcionado un cartId') {
  log.info('Test 1: Pasado');
  testPasados++;
} else {
  log.error(
    '* Test 1 fails: se esperaba < No se ha proporcionado un cartId > y se obtuvo',
    result1
  );
}
log.info('----------------------------------------------------------------');
// Test 2: La función debe devolver < Tipo de dato incorrecto >
log.info('Test 2: La función debe devolver < Tipo de dato incorrecto >');
const result2 = updateCart(24, 'd0eaf83dabb3cf21a3fd7afc', 32);

if (result2 === 'Tipo de dato incorrecto') {
  log.info('Test 2: Pasado');
  testPasados++;
} else {
  log.error(
    '* Test 2 fails: se esperaba < Tipo de dato incorrecto > y se obtuvo',
    result2
  );
}
log.info('----------------------------------------------------------------');
// Test 3: La función debe devolver < Carrito no encontrado >
log.info('Test 3: La función debe devolver < Carrito no encontrado >');
const result3 = updateCart(
  '64c594d1085825c5ca084c35',
  'd0eaf83dabb3cf21a3fd7afc',
  32
);

if (result3 === 'Carrito no encontrado') {
  log.info('Test 3: Pasado');
  testPasados++;
} else {
  log.error(
    '* Test 3 fails: se esperaba < Carrito no encontrado > y se obtuvo',
    result3
  );
}
log.info('----------------------------------------------------------------');
// Test 4: La función debe devolver < Producto no encontrado >
log.info('Test 4: La función debe devolver < Producto no encontrado >');
const result4 = updateCart(
  '64c594d1085825c5ca084d62',
  'd0eaf83dabb3cf21a3fd7cfa',
  32
);
if (result4 === 'Producto no encontrado') {
  log.info('Test 4: Pasado');
  testPasados++;
} else {
  log.error(
    '* Test 4 fails: se esperaba < Producto no encontrado > y se obtuvo',
    result4
  );
}
log.info('----------------------------------------------------------------');
// Test 5: La función debe devolver < La cantidad mínima es 1 >
log.info('Test 5: La función debe devolver < La cantidad mínima es 1 >');
const result5 = updateCart(
  '64c594d1085825c5ca084d62',
  'd0eaf83dabb3cf21a3fd7afc',
  0
);
if (result5 === 'La cantidad mínima es 1') {
  log.info('Test 5: Pasado');
  testPasados++;
} else {
  log.error(
    '* Test 5 fails: se esperaba < La cantidad mínima es 1 > y se obtuvo',
    result5
  );
}
log.info('----------------------------------------------------------------');
// Test 6: La función debe devolver < Stock insuficiente >
log.info('Test 6: La función debe devolver < Stock insuficiente >');
const result6 = updateCart(
  '64c594d1085825c5ca084d62',
  'd0eaf83dabb3cf21a3fd7afc',
  32
);
if (result6 === 'Stock insuficiente') {
  log.info('Test 6: Pasado');
  testPasados++;
} else {
  log.error(
    '* Test 6 fails: se esperaba < Stock insuficiente > y se obtuvo',
    result6
  );
}
log.info('----------------------------------------------------------------');
// Test 7: La función debe devolver < Carrito actualizado correctamente >
log.info(
  'Test 7: La función debe devolver < Carrito actualizado correctamente >'
);
const result7 = updateCart(
  '64c594d1085825c5ca084d62',
  'd0eaf83dabb3cf21a3fd7afc',
  16
);
if (result7 === 'Carrito actualizado correctamente') {
  log.info('Test 7: Pasado');
  testPasados++;
} else {
  log.error(
    '* Test 7 fails: se esperaba < Carrito actualizado correctamente > y se obtuvo',
    result7
  );
}
log.info('----------------------------------------------------------------');

if (testPasados === testTotales) {
  log.info(
    `${testPasados} de ${testTotales} test han pasado satisfactoriamente!!!`
  );
} else {
  log.info(
    `*** ${testTotales - testPasados} de ${testTotales} han fallado ***`
  );
}
log.info(
  '________________________________________________________________________________________________________________________________'
);

export default updateCart();
