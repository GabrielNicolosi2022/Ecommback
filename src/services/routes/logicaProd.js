/* Utilizado en routes/prod.controllers.js */
import ProductManager from '../../dao/controllers/productManagerDB.js';
const productManager = new ProductManager();

// Lógica para ordenar los productos si se proporciona sort
const getSortedProducts = async (sort) => {
  const sortOptions = {};
  if (sort) {
    if (sort === 'asc') {
      sortOptions.price = 1;
    } else if (sort === 'desc') {
      sortOptions.price = -1;
    }
  }
  return sortOptions;
};

// Lógica para filtrar los productos si se proporciona query
const getFilteredProducts = (query) => {
  const filter = {};

  if (query) {
    if (query.category) {
      filter.$or = [{ category: query.category }];
    }
    if (query.status) {
      filter.$or = filter.$or || [];
      filter.$or.push({ status: query.status });
    }
  }

  return filter;
};

// Lógica de paginación
const getPaginateProducts = async (options, filter, sortOptions) => {

  // Cargo los productos utilizando mongoose-paginate-v2
  const {
    docs,
    totalPages,
    prevPage,
    nextPage,
    Page,
    hasNextPage,
    hasPrevPage,
  } = await productManager.getAllProductsPaginated(
    options,
    filter,
    sortOptions
  );

  return {
    docs,
    totalPages,
    prevPage,
    nextPage,
    Page,
    hasNextPage,
    hasPrevPage,
  };
};

// Lógica para obtener un producto por su ID
const getProductById = async (_id) => {
  try {
    const product = await productManager.getProductsById(_id);
    return product;
  } catch (error) {
    throw new Error('Error al obtener el producto');
  }
};

export { getSortedProducts, getFilteredProducts, getPaginateProducts, getProductById };
