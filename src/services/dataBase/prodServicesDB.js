import productsModel from '../../models/schemas/ProdModel.js';

class ProductServices {
  constructor() {}

  // Recibe 3 parámetros desde prod.controller.js
  getAllProductsPaginated = async (options, filter, sortOptions) => {
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

  // ! getAllProducts no se está utilizando en products.routes.js
  getAllProducts = async () => (products = await productsModel.find().lean());

  getProductsById = async (_id) => await productsModel.findById(_id);

  createProduct = async (productsData) => {
    if (Array.isArray(productsData)) {
      const result = await productsModel.insertMany(productsData);
      return result;
    } else {
      await productsModel.create(productsData);
      // const newProduct = new productsModel(productsData);
      // const result = await newProduct.save();
      // return result;
    }
  };

  updateProduct = async (_id, updatedData) => await productsModel.findByIdAndUpdate(_id, updatedData, { new: true });

  deleteProduct = async (_id) => await productsModel.findByIdAndRemove(_id);
}

export default ProductServices;

// TODO: trasladar condicional en método createProduct