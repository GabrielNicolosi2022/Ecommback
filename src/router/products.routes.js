import { Router } from 'express';
import * as prodControllers from '../controllers/routesControllers/prod.controller.js';
import { uploader } from '../middlewares/multer.js';

const productsRouter = Router();

// Obtener todos los productos paginados, filtrados y ordenados
productsRouter.get('/', prodControllers.getProducts);

// Obtener un producto por id
productsRouter.get('/:pid', prodControllers.getProductById);

// Crear un nuevo producto
productsRouter.post(
  '/',
  uploader.array('thumbnails', 5),
  prodControllers.createProducts
);

// Actualizar un producto por id
productsRouter.put('/:pid', prodControllers.updateProduct);

// Eliminar un producto por id
productsRouter.delete('/:pid', prodControllers.deleteProduct);

export default productsRouter;
