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

const getProductsById = async (_id) => await productsModel.findById(_id).lean();

const createProduct = async (productsData) => {
  if (Array.isArray(productsData)) {
    const result = await productsModel.insertMany(productsData);
    console.log('result: ', result);
    return result;
  } else {
    const result = await productsModel.create(productsData);
    console.log('result: ', result);
    return result;
    // const newProduct = new productsModel(productsData);
    // const result = await newProduct.save();
    // return result;
  }
};

const updateProduct = async (_id, updatedData) =>
  await productsModel.findByIdAndUpdate(_id, updatedData, { new: true });

const deleteProduct = async (_id) => await productsModel.findByIdAndRemove(_id);

export {
  getAllProducts,
  getAllProductsPaginated,
  getProductsById,
  createProduct,
  updateProduct,
  deleteProduct,
};

// TODO: trasladar condicional en método createProduct
