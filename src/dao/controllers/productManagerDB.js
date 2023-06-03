import productsModel from '../models/ProductModel.js';

class ProductManager {
  constructor() {}
  
  async getAllProducts() {
    try {
      const products = await productsModel.find().lean();
      return products;
    } catch (error) {
      throw new Error('Error al obtener los productos');
    }
  }

  async getProductsById(_id) {
    try {
      const product = await productsModel.findById(_id);
      return product;
    } catch (error) {
      throw new Error('Error al obtener el producto');
    }
  }

  async createProduct(productData) {
    try {
      if (Array.isArray(productData)) {
        const result = await productsModel.insertMany(productData);
        return result;
      } else {
        const newProduct = new productsModel(productData);
        const result = await newProduct.save();
        return result;
      }
    } catch (error) {
      throw new Error('Error al crear el producto');
    }
  }

  async updateProduct(_id, updatedData) {
    try {
      const product = await productsModel.findByIdAndUpdate(_id, updatedData, {
        new: true,
      });
      return product;
    } catch (error) {
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
