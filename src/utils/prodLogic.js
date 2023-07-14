/* Utilizado en routes/prod.controllers.js */
import ProductManager from '../services/dataBase/prodServicesDB.js';
const productManager = new ProductManager();

// Lógica para ordenar si se proporciona sort
const getSorted = async (sort) => {
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

// Lógica para filtrar si se proporciona query
const getFiltered = (query) => {
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
  console.log('entre en la logica de paginacion');
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

const createProduct = async (productData) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = productData;

  // Verificar campos obligatorios
  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !stock ||
    !category
  ) {
    throw new Error('Faltan campos obligatorios');
  }

  const newProduct = {
    title,
    description,
    code,
    price,
    status: status || true,
    stock,
    category,
    thumbnails: thumbnails || [],
  };

  const createdProduct = await productManager.createProduct(newProduct);
  return createdProduct;
};

const updateProduct = async (_id, updatedData) => {
  try {
    // Guardo el producto por si se modificó por error
    const product = await productManager.getProductsById(_id);

    if (!product) {
      throw new Error('Producto no encontrado');
    }
    const updatedProduct = await productManager.updateProduct(_id, updatedData);

    return updatedProduct;
  } catch (error) {
    if (error.message === 'Producto no encontrado') {
      throw error;
    } else {
      throw new Error('Error al actualizar el producto');
    }
  }
};

const deleteProduct = async (_id) => {
  try {
    // Guardo el producto por si se eliminó por error
    const product = await productManager.getProductsById(_id);

    if (!product) {
      throw new Error('Producto no encontrado');
    }
    await productManager.deleteProduct(_id);
  } catch (error) {
    if (error.message === 'Producto no encontrado') {
      throw error;
    } else {
      throw new Error('Error al eliminar el producto');
    }
  }
};

export {
  getSorted,
  getFiltered,
  getPaginateProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
