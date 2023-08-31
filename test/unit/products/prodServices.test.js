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
  });

  it('It should return an empty array if there are no products', async () => {
    // La base de datos esta limpia por el beforeEach
    const allProducts = await prodServices.getAllProducts();

    expect(allProducts).to.be.an('array');
    expect(allProducts).to.have.lengthOf(0);
  });
});
