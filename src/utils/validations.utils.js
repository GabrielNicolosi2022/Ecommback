import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config/config.js';

const generateToken = (user) =>
  jwt.sign({ user }, config.jwt.token, { expiresIn: '1h' });

const validateToken = (token) => jwt.verify(token, config.jwt.token, (err) => (err ? false : true));

const isSamePassword = async (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export {
  generateToken,
  validateToken,
  isSamePassword,
  createHash,
  isValidPassword,
};
