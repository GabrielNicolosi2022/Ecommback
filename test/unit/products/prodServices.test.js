// import 'dotenv/config';
// import config from '../../../src/config/config.js';
// console.log(config);

import * as prodServices from '../../../src/services/dataBase/prodServicesDB.js';
import mongoose from 'mongoose';
import { expect } from 'chai';
import { incompleteData, productsData } from '../../mocks/products.mocks.js';
import { before } from 'mocha';

// Conectar a la base de datos
const dbURI =
  'mongodb+srv://gabianp:PrIntMdb23@ecommerce.hwzuuds.mongodb.net/testing?retryWrites=true&w=majority';

describe('prodServices testing', function () {
  this.timeout(6000);
  let connection;

  before(async () => {
    connection = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    // Después de todos los tests, cerrar la conexión
    await connection.disconnect();
  });

  beforeEach(async () => {
    await mongoose.connection.collections.products.deleteMany({});
  });

  describe('createProduct function', () => {
    it('It should create a product correctly', async () => {
      const response = await prodServices.createProduct(productsData);

      expect(response).to.be.ok;
      expect(response).to.be.an('array');
      expect(response[0].title).to.equal(productsData[0].title);
      expect(response[1].price).to.equal(productsData[1].price);
      expect(response[2].category).to.equal(productsData[2].category);

      const productCount =
        await mongoose.connection.collections.products.countDocuments();
      expect(productCount).to.equal(productsData.length);
    });

    it('It should handle duplicate data', async () => {
      await prodServices.createProduct(productsData[0]);

      try {
        await prodServices.createProduct(productsData[0]);
      } catch (error) {
        expect(error.message).to.include('duplicate key error');
      }
    });

    it('It should handle invalid data', async () => {
      try {
        await prodServices.createProduct(invalidData);
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it('It should handle incomplete data', async () => {
      try {
        await prodServices.createProduct(incompleteData);
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it('It should handle asynchronous operations correctly', async () => {
      const responsePromise = prodServices.createProduct(productsData[0]);
      expect(responsePromise).to.be.a('Promise');

      const response = await responsePromise;
      expect(response).to.be.an('object');
    });
  });

  describe('getAllProducts function', () => {
    it('It should return all products', async () => {
      await prodServices.createProduct(productsData);
      const response = await prodServices.getAllProducts();
      expect(response).to.be.ok;
      expect(response).to.be.an('array');
      expect(response).to.have.lengthOf(productsData.length);

      const titlesInResponse = response.map((product) => product.title);
      const expectedTitles = titlesInResponse.map((title) => title);
      expect(titlesInResponse).to.have.deep.equal(expectedTitles);
    });

    it('It should return an empty array if there are no products', async () => {
      // La base de datos esta limpia por el beforeEach
      const allProducts = await prodServices.getAllProducts();

      expect(allProducts).to.be.an('array');
      expect(allProducts).to.have.lengthOf(0);
    });
  });

  describe('getProductsById function', () => {
    it('It should return an object whit a product from its id', async () => {
      const createProduct = await prodServices.createProduct(productsData);
      const _id = createProduct[1]._id;

      const response = await prodServices.getProductsById(_id);

      expect(response).to.be.ok;
      expect(response).to.be.an('object');
      expect(response.code).to.be.equal(productsData[1].code);
    });

    it('It should return null if the id is not found', async () => {
      await prodServices.createProduct(productsData);
      // ID que no existe en la base de datos
      const nonExistentId = '6164ea956a13bd0000000000';

      const response = await prodServices.getProductsById(nonExistentId);

      expect(response).to.be.null;
    });

    it('It should handle errors correctly', async () => {
      await prodServices.createProduct(productsData);
      try {
        // Un ID que no es válido
        const invalidId = 'invalidId';

        await prodServices.getProductsById(invalidId);
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe('updateProduct function', () => {
    it('It should update a product successfully', async () => {
      const createdProduct = await prodServices.createProduct(productsData[0]);
      const _id = createdProduct._id;

      const updatedData = {
        title: 'Notebook Acer',
        price: 400000,
      };

      const response = await prodServices.updateProduct(_id, updatedData);

      expect(response).to.be.an('object');
      expect(response._id.toString()).to.equal(_id.toString());
      expect(response.title).to.equal(updatedData.title);
      expect(response.price).to.equal(updatedData.price);
    });

    it('It should return null if the product is not found to update', async () => {
      const nonExistentId = '6164ea956a13bd0000000000';

      const response = await prodServices.updateProduct(nonExistentId, {});

      expect(response).to.be.null;
    });

    it('It should handle validation errors correctly', async () => {
      const createdProduct = await prodServices.createProduct(productsData[0]);
      const _id = createdProduct._id;

      try {
        const invalidData = {
          price: -100,
        };

        await prodServices.updateProduct(_id, invalidData);
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe('deleteProduct function', () => {
    it('It should delete a product correctly', async () => {
      const createdProduct = await prodServices.createProduct(productsData[0]);
      const _id = createdProduct._id;

      const deletedProduct = await prodServices.deleteProduct(_id);

      expect(deletedProduct).to.be.an('object');
      expect(deletedProduct._id.toString()).to.equal(_id.toString());
      expect(deletedProduct.title).to.equal(productsData[0].title);

      // Intentar obtener el producto después de eliminarlo debería devolver null
      const retrievedProduct = await prodServices.getProductsById(_id);
      expect(retrievedProduct).to.be.null;
    });

    it('It should return null if the product is not found to remove', async () => {
      await prodServices.createProduct(productsData);

      const nonExistentId = '6164ea956a13bd0000000000';

      const deletedProduct = await prodServices.deleteProduct(nonExistentId);

      expect(deletedProduct).to.be.null;
    });

    it('It should handle errors correctly', async () => {
      await prodServices.createProduct(productsData);
      try {
        // Un ID que no es válido
        const invalidId = 'invalidId';

        await prodServices.deleteProduct(invalidId);
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
});
