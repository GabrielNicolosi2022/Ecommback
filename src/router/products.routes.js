import { Router } from 'express';
import * as prodControllers from '../controllers/prod.controller.js';
import { uploader } from '../middlewares/multer.js';
import { checkRole } from '../middlewares/auth.js';

const productsRouter = Router();

// Obtener todos los productos paginados, filtrados y ordenados
productsRouter.get('/', prodControllers.getProducts);

// Obtener un producto por id
productsRouter.get('/:pid', prodControllers.getProductById);

// Crear un nuevo producto
productsRouter.post(
  '/',
  uploader.array('thumbnails', 5), checkRole('admin'),
  prodControllers.createProducts
);

// Actualizar un producto por id
productsRouter.put('/:pid', checkRole('admin'), prodControllers.updateProduct);

// Eliminar un producto por id
productsRouter.delete('/:pid', checkRole('admin'), prodControllers.deleteProduct);

export default productsRouter;
