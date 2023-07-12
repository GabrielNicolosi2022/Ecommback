import productsModel from '../../models/ProductModel.js';

class ProductManager {
  constructor() {}

  async getAllProductsPaginated(options, filter, sortOptions) {
    // Recibe 3 parametros desde prod.controller.js
    console.log('estoy en getAllProductsPaginated');
    try {
      const paginationOptions = {
        ...options,
        sort: sortOptions,
      };

      const result = await productsModel.paginate(filter, paginationOptions);

      return {
        docs: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      };
    } catch (error) {
      throw new Error('Error al obtener los productos paginados');
    }
  }

  async getAllProducts() { // ! No se está utilizando en products.routes.js
    console.log('estoy en getAllProducts');

    try {
      const products = await productsModel.find().lean();
      return products;
    } catch (error) {
      throw new Error('Error al obtener los productos');
    }
  }

  async getProductsById(_id) {
    console.log('estoy en getProductsById');
    try {
      const product = await productsModel.findById(_id);
      return product;
    } catch (error) {
      throw new Error('Error al obtener el producto');
    }
  }

  async createProduct(productsData) {
    console.log('ahora estoy en createProduct del manager');
    try {
      if (Array.isArray(productsData)) {
        console.log('entre en el if del manager')
        const result = await productsModel.insertMany(productsData);
        return result;
      } else {
        console.log('entré en el else del manager')
        const newProduct = new productsModel(productsData);
        const result = await newProduct.save();
        return result;
      }
    } catch (error) {
      console.error(error);
      throw Error('Error al crear el producto');
    }
  }

  async updateProduct(_id, updatedData) {
    try {
      const product = await productsModel.findByIdAndUpdate(_id, updatedData, {
        new: true,
      });
      return product;
    } catch (error) {
      console.error(error);
      throw new Error('Error al actualizar el producto');
    }
  }

  async deleteProduct(_id) {
    try {
      await productsModel.findByIdAndRemove(_id);
    } catch (error) {
      throw new Error('Error al eliminar el producto');
    }
  }
}

export default ProductManager;
