import config from '../../../src/config/config.js';
import { expect } from 'chai';
import mongoose from 'mongoose';
import supertest from 'supertest';
// import { products1, products2 } from '../../mocks/products.mocks.js';

// console.log(config)
// mongoose.connect(config.db.testing);
await mongoose.connect(
  'mongodb+srv://gabianp:PrIntMdb23@ecommerce.hwzuuds.mongodb.net/testing'
);

const requester = supertest('http://localhost:8080');

describe('Product router testing', () => {
  describe('getProducts', () => {
    it('It should return an object with all the products of the DB', async () => {
      const response = await requester.get('/api/products').send();

      expect(response.ok).to.be.true;
      expect(response.statusCode).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body.status).deep.equal('success');
      expect(response.body.data).to.be.an('object');
      expect(response.body.data.payload).to.be.an('array');
    });
  });

  describe('getProductById', () => {
    it('It should return an object whit a product from its id', async () => {
      const id = '647bb555772098d69e1e8200';
      const response = await requester.get(`/api/products/${id}`).send();

      expect(response.ok).to.be.true;
      expect(response.statusCode).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body.status).deep.equal('success');
      expect(response.body.data).to.be.an('object');
    });

    it('It should fail if the product id is wrong', async () => {
      const idError = '747bb555772098d69e1e8200';
      const bodyResponse = {
        status: 'error',
        message: 'Producto no encontrado',
      };

      const response = await requester.get(`/api/products/${idError}`).send();

      expect(response.ok).to.be.false;
      expect(response.statusCode).to.be.equal(404);
      expect(response.body).to.deep.equal(bodyResponse);
    });

    it('Should fail if product id is not an ObjectId', async () => {
      const idError = '747bb55577';
      const bodyResponse = {
        status: 'error',
        message: 'Error al obtener el producto',
      };

      const response = await requester.get(`/api/products/${idError}`).send();

      expect(response.ok).to.be.false;
      expect(response.statusCode).to.be.equal(500);
      expect(response.body).to.deep.equal(bodyResponse);
    });
  });

  // describe.skip('createProducts', () => {
  //   it('It should create a new product', async () => {
  //     const response = await requester.post('/api/products').send(products1);

  //     console.log(response);
  //   });
  // });
});
