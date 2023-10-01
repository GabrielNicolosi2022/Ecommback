import { generateProducts } from './mocks/generateProducts.js';
import getLogger from '../utils/log.utils.js';

const log = getLogger();

const generateMockingProducts = async (req, res) => {
  try {
    const mockProducts = [];
    for (let i = 0; i < 100; i++) {
      const product = generateProducts();
      mockProducts.push(product);
    }
    res
      .status(200)
      .json({
        status: 'success',
        message: 'Mocked Products',
        Total_Prod: mockProducts.length,
        products: mockProducts,
      });
  } catch (error) {
    log.error(error.message);
    res
      .status(500)
      .json({ error: 'Error al generar los productos de prueba.' });
  }
};

export { generateMockingProducts };
