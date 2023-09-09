import { Router } from 'express';
import * as prodControllers from '../controllers/prod.controller.js';
import { uploader } from '../middlewares/multer.js';
import { checkProductOwner } from '../middlewares/products.middlewares.js';
import { checkRole } from '../middlewares/auth.js';
import { generateMockingProducts } from '../test/products.test.js';

const productsRouter = Router();

// Obtener todos los productos paginados, filtrados y ordenados
productsRouter.get('/', prodControllers.getProducts);

// Crear un nuevo producto
productsRouter.post(
  '/',
  uploader.array('thumbnails', 5),
  checkRole('premium' || 'admin'),
  prodControllers.createProducts
);

// Obtener un producto por id
productsRouter.get('/:pid', prodControllers.getProductById);

// Actualizar un producto por id
productsRouter.patch(
  '/:pid',
  checkRole('premium'),
  checkProductOwner,
  prodControllers.updateProduct
);

// Eliminar un producto por id
productsRouter.delete(
  '/:pid',
  checkRole('premium'),
  checkProductOwner,
  prodControllers.deleteProduct
);

// Opción adicional para que el admin pueda borrar cualquier producto
productsRouter.delete(
  '/:pid',
  checkRole('admin'),
  prodControllers.deleteProduct
);

productsRouter.post(
  '/mockingproducts',
  checkRole('admin'),
  generateMockingProducts
);

export default productsRouter;
