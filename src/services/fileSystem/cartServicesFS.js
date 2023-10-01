import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import __dirname from '../../utils.js';
import getLogger from '../utils/log.utils.js';

const log = getLogger();

class CartManager {
  constructor() {
    this.path = path.join(__dirname, '/data/carritos.json');
    this.pathDelete = path.join(__dirname, '/data/removedCarts.json');
    this.carts = [];
    this.removed = [];
    this.loadCarts();
  }
  // Método para traer los datos del archivo de carts
  async loadCarts() {
    try {
      const dataJson = await fs.promises.readFile(this.path, 'utf-8');
      if (dataJson) {
        this.carts = JSON.parse(dataJson);
        return this.carts;
      } else {
        return [];
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      } else {
        log.info('Error al obtener los carritos', error);
      }
    }
  }

  // Método para guardar datos en el archivo de carts
  async saveCarts() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 2)
      );
      log.info('Los datos fueron guardados exitosamente');
    } catch (error) {
      log.info(error);
    }
  }

  // Método para agregar un carrito
  async addCart() {
    const newCart = {
      id: v4(),
      products: [],
    };
    // agrego producto al array y lo guardo en un archivo json
    this.carts.push(newCart);
    await this.saveCarts();
    log.info(`El carrito con id ${newCart.id} ha sido creado con éxito`);
    return newCart;
  }

  // método para guardar datos de carts eliminados
  async removedCart() {
    try {
      await fs.promises.writeFile(
        this.pathDelete,
        JSON.stringify(this.removed, null, 2)
      );
      log.info('Los datos fueron guardados exitosamente');
    } catch (error) {
      log.info(error);
    }
  }
}

export default CartManager;
// module.exports = CartManager;
