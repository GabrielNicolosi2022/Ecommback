import Router from 'express';
import * as prodControllers from '../controllers/routesControllers/prod.controller.js';
import { uploader } from '../middlewares/multer.js';

const router = Router();


// Obtener todos los productos paginados, filtrados y ordenados
router.get('/', prodControllers.getProducts);

// Obtener un producto por id
router.get('/:pid', prodControllers.getProductById);

// Crear un nuevo producto
router.post('/', uploader.array('thumbnails', 5), prodControllers.createProducts);

// Actualizar un producto por id
router.put('/:pid', prodControllers.updateProduct);

// Eliminar un producto por id
router.delete('/:pid', prodControllers.deleteProduct);

export default router;
