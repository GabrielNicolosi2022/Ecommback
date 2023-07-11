import productsModel from '../../dao/models/ProductModel.js';

/* Utilizado en prod.controllers.js */
// Lógica para ordenar los productos si se proporciona sort
const getSortedProducts = async (sort) => {
  let products = await productsModel.find().lean();

  if (sort === 'asc') {
    products = products.sort((a, b) => a.price - b.price);
  } else if (sort === 'desc') {
    products = products.sort((a, b) => b.price - a.price);
  }

  return products;
};

// Lógica para filtrar los productos si se proporciona query
const getFilteredProducts = (products, query) => {
  if (query.category) {
    products = products.filter(
      (product) => product.category === query.category
    );
  }

  if (query.status) {
    products = products.filter((product) => product.status === query.status);
  }

  return products;
};

// Lógica de paginación
const paginateProducts = (products, page, limit) => {
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentProducts = products.slice(startIndex, endIndex);

  return {
    currentProducts,
    totalPages,
  };
};

// Enlaces de paginación
const generatePaginationLinks = (page, totalPages, limit) => {
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;
  const prevLink = prevPage
    ? `/products?page=${prevPage}&limit=${limit}`
    : null;
  const nextLink = nextPage
    ? `/products?page=${nextPage}&limit=${limit}`
    : null;

  return {
    prevPage,
    nextPage,
    prevLink,
    nextLink,
  };
};

export {
  getSortedProducts,
  getFilteredProducts,
  paginateProducts,
  generatePaginationLinks,
};
