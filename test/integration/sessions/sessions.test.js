import { expect } from 'chai';
import supertest from 'supertest';
import { user1, userFail } from '../../mocks/users.mocks.js';

const requester = supertest('http://localhost:8080');


describe.skip('Sessions router testing', function () {
  this.timeout(6000);

  describe('register', () => {
    it('It should fail if any required field is not provided.', async () => {
      const response = await requester
        .post('/api/sessions/register')
        .send(userFail);

      expect(response.ok).to.be.false;
      expect(response.statusCode).to.equal(400);
      expect(response.type).to.be.equal('application/json');
      expect(response.body).to.be.an('object');
      expect(response.body.status).deep.equal('error');
      expect(response.body.message).deep.equal('All fields are required');
    });

    it('It should register a new user correctly', async () => {
      const response = await requester
        .post('/api/sessions/register')
        .send(user1);

      expect(response.ok).to.be.true;
      expect(response.statusCode).to.equal(201);
      expect(response.type).to.be.equal('application/json');
      expect(response.body).to.be.an('object');
      expect(response.body.status).deep.equal('success');
      expect(response.body.user).to.be.an('object');
    });

    it('It should not register a new user if the user already exists', async () => {
      const response = await requester
        .post('/api/sessions/register')
        .send(user1);
      expect(response.ok).to.be.false;
      expect(response.statusCode).to.equal(302); //redirecciona a failregister
      expect(response.redirect).to.equal(true);
      expect(response.text).to.equal('Found. Redirecting to /failregister');
      expect(response.headers.location).to.equal('/failregister');
    });
  });

  describe('login', () => {
    it('It should log in successfully, return a cookie and redirect to "/product" (view path)', async () => {
      const mockUser = {
        email: user1.email,
        password: user1.password,
      };

      const response = await requester
        .post('/api/sessions/login')
        .send(mockUser);

      expect(response.statusCode).to.equal(302);
      expect(response.redirect).to.equal(true);
      expect(response.text).to.equal('Found. Redirecting to /product');
      expect(response.headers.location).to.equal('/product');

      const cookieResponse = response.headers['set-cookie'][0];

      expect(cookieResponse).to.be.ok;

      const cookie = {
        key: cookieResponse.split('=')[0],
        value: cookieResponse.split('=')[1],
      };

      expect(cookie.key).to.be.equal('connect.sid');
      expect(cookie.value).to.be.ok;

      const redirectUrl = response.headers.location;
      const redirectedResponse = await requester.get(redirectUrl);

      expect(redirectedResponse.statusCode).to.equal(200);
      expect(redirectedResponse.ok).to.be.true;
    });
  });

  describe('logout', () => {
    it('It should log out and redirect to "/login"', async () => {
      const response = await requester.get('/api/sessions/logout').send();
      expect(response.statusCode).to.equal(302);
      expect(response.redirect).to.equal(true);
      expect(response.text).to.equal('Found. Redirecting to /login');
      expect(response.headers.location).to.equal('/login');

      const redirectUrl = response.headers.location;
      const redirectedResponse = await requester.get(redirectUrl);

      expect(redirectedResponse.statusCode).to.equal(200);
      expect(redirectedResponse.ok).to.be.true;
    });
  });
});
