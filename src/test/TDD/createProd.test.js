/* Escenarios de prueba
1. No se proporcionaron productos válidos (formato Array de objetos)
2. Faltan campos obligatorios (required)
3. Hay tipos de datos incorrectos (typeOf)
4. Nuevo producto guardado correctamente (el formato y todos los datos son válidos)
 */

const createProducts = (data) => {
  if (!data || !Array.isArray(data.products) || data.products.length === 0)
    return 'No se proporcionaron productos válidos';

  for (const product of data.products) {
    const { title, description, code, price, status, stock, category } =
      product;

    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category
    ) {
      return 'Faltan campos obligatorios';
    }

    if (
      typeof title !== 'string' ||
      typeof description !== 'string' ||
      typeof code !== 'string' ||
      typeof price !== 'number' ||
      typeof status !== 'boolean' ||
      typeof stock !== 'number' ||
      typeof category !== 'string'
    ) {
      return 'Hay tipos de datos incorrectos';
    }
    return 'Nuevo producto guardado correctamente';
  }
};

// Escenarios
let testPasados = 0;
let testTotales = 4;
console.log('Create Product Test')
// Test 1: La función debe devolver < No se proporcionaron productos válidos >
console.log(
  'Test 1: La función debe devolver < No se proporcionaron productos válidos >'
);
let result1 =
  createProducts();
  /* {products:[{
  title: 'Refinado Metal Pelota',
  description: 'Doloremque velit maxime ratione asperiores.',
  code: 'x4moRopa9A',
  price: 943,
  status: true,
  stock: 238,
  category: 'Bricolaje',
  thumbnails: ['https://picsum.photos/seed/jmLTQfamP/640/480'],
    }]} */

if (result1 === 'No se proporcionaron productos válidos') {
  console.log('Test 1: Pasado');
  testPasados++;
} else {
  console.error(
    '* Test 1 fail: se esperaba < No se proporcionaron productos válidos > y se obtuvo',
    result1
  );
    console.log(result1)
}
console.log('----------------------------------------------------------------');
// Test 2: La función debe devolver < Faltan campos obligatorios >
console.log('Test 2: La función debe devolver < Faltan campos obligatorios >');
let result2 = createProducts({
  products: [
    {
      title: 'Refinado Metal Pelota',
      //   description: 'Doloremque velit maxime ratione asperiores.',
      code: 'x4moRopa9A',
      price: 943,
      status: true,
      stock: 238,
      category: 'Bricolaje',
      thumbnails: ['https://picsum.photos/seed/jmLTQfamP/640/480'],
    },
  ],
});

if (result2 === 'Faltan campos obligatorios') {
  console.log('Test 2: Pasado');
  testPasados++;
} else {
  console.error(
    '* Test 2 fail: se esperaba < Faltan campos obligatorios > y se obtuvo',
    result2
  );
}
console.log('----------------------------------------------------------------');
// Test 3: La función debe devolver < Hay tipos de datos incorrectos >
console.log(
  'Test 3: La función debe devolver < Hay tipos de datos incorrectos >'
);
let result3 = createProducts({
  products: [
    {
      title: 'Refinado Metal Pelota',
      description: 45,
      code: 'x4moRopa9A',
      price: 943,
      status: true,
      stock: 238,
      category: 'Bricolaje',
      //   thumbnails: ['https://picsum.photos/seed/jmLTQfamP/640/480'],
    },
  ],
});

if (result3 === 'Hay tipos de datos incorrectos') {
  console.log('Test 3: Pasado');
  testPasados++;
} else {
  console.error(
    '* Test 3 fail: se esperaba < Hay tipos de datos incorrectos > y se obtuvo',
    result3
  );
}
console.log('----------------------------------------------------------------');
// Test 4: La función debe devolver < Nuevo producto guardado correctamente >
console.log(
  'Test 4: La función debe devolver < Nuevo producto guardado correctamente >'
);
let result4 = createProducts({
  products: [
    {
      title: 'Refinado Metal Pelota',
      description: 'Doloremque velit maxime ratione asperiores.',
      code: 'x4moRopa9A',
      price: 943,
      status: true,
      stock: 238,
      category: 'Bricolaje',
      thumbnails: ['https://picsum.photos/seed/jmLTQfamP/640/480'],
    },
  ],
});

if (result4 === 'Nuevo producto guardado correctamente') {
  console.log('Test 4: Pasado');
  testPasados++;
} else {
  console.error(
    '* Test 4 fail: se esperaba < Nuevo producto guardado correctamente > y se obtuvo',
    result4
  );
}
console.log('----------------------------------------------------------------');

if (testPasados === testTotales) {
  console.log(
    `${testPasados} de ${testTotales} test han pasado satisfactoriamente!!!`
  );
} else {
  console.log(
    `*** ${testTotales - testPasados} de ${testTotales} han fallado ***`
  );
}

export default createProducts;
