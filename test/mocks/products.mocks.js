const products1 = [
  {
    title: 'cartuchera con cierre',
    description: 'zoom sport amarilla 2 bolsillos',
    code: 'N5120',
    price: 1500,
    status: true,
    stock: 200,
    category: 'libreria',
  },
];

const products2 = [
  {
    title: 'carpeta n°5',
    description: 'carton negra 3 ganchos',
    code: 'C5003',
    price: 1800,
    status: true,
    stock: 250,
    category: 'libreria',
  },
];

const productsData = [
  {
    title: 'Noteblook Asus',
    description: 'X515EA - octa core i7 ram 8mb sdd 256mb screen 15.5"',
    code: 'NA515i7',
    price: 350000,
    status: true,
    stock: 25,
    category: 'informatica',
    owner: '56cb91bdc3464f14678934ca',
  },
  {
    title: 'Monitor Philips',
    description: '22IV - lcd 22" anti reflex plano',
    code: 'MP22IV',
    price: 50000,
    status: true,
    stock: 25,
    category: 'informatica',
    owner: '56cb91bdc3464f14678934ca',
  },
  {
    title: 'Mouse Genius',
    description: 'NX-7015  óptico cordless',
    code: 'MG7015NX',
    price: 9000,
    status: true,
    stock: 25,
    category: 'informatica',
    owner: '56cb91bdc3464f14678934ca',
  },
];

const incompleteData = [
  {
    title: 'cartuchera con cierre',
    code: 'N5120',
    price: 1500,
    status: true,
    stock: 200,
    category: 'libreria',
  },
];

const invalidData = [
  {
    title: 'cartuchera con cierre',
    description: 656513,
    code: 'N5120',
    price: 1500,
    status: true,
    stock: 200,
    category: 'libreria',
  },
];
export {
  products1, products2, productsData, incompleteData, invalidData};
