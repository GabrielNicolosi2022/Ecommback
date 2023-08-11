import productsModel from '../../models/schemas/ProdModel.js';

// Recibe 3 parámetros desde prod.controller.js
const getAllProductsPaginated = async (options, filter, sortOptions) => {
  const {
    docs,
    totalPages,
    prevPage,
    nextPage,
    page,
    hasNextPage,
    hasPrevPage,
  } = await productsModel.paginate(filter, {
    ...options,
    sort: sortOptions,
  });

  return {
    docs,
    totalPages,
    prevPage,
    nextPage,
    page,
    hasNextPage,
    hasPrevPage,
  };
};

const getAllProducts = async () => await productsModel.find().lean();

const getProductsById = async (_id) => await productsModel.findById(_id).exec();

const createProduct = async (productsData) => await productsModel.create(productsData);

const updateProduct = async (_id, updatedData) => await productsModel.findByIdAndUpdate(_id, updatedData, { new: true });

const deleteProduct = async (_id) => await productsModel.findByIdAndRemove(_id);

export {
  getAllProducts,
  getAllProductsPaginated,
  getProductsById,
  createProduct,
  updateProduct,
  deleteProduct,
};
