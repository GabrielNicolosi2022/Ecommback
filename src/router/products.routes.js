import Router from 'express';
import * as prodControllers from '../dao/controllers/routes/prod.controller.js';
import ProductManager from '../dao/controllers/productManagerDB.js';
import { uploader } from '../middlewares/multer.js';

const router = Router();

const productManager = new ProductManager();

// Obtener todos los productos paginados, filtrados y ordenados
router.get('/', prodControllers.getProducts);

// Obtener un producto por id
router.get('/:pid', prodControllers.getProductById);

// Crear un nuevo producto
router.post('/', uploader.array('thumbnails', 5), async (req, res) => {
  try {
    const productsData = req.body;

    // Verificar que se proporcionen al menos un producto
    if (!Array.isArray(productsData) || productsData.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron productos' });
    }

    const createdProducts = [];
    for (const productData of productsData) {
      const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      } = productData;

      // Verificar campos obligatorios
      if (
        !title ||
        !description ||
        !code ||
        !price ||
        !status ||
        !stock ||
        !category
      ) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      const newProduct = {
        title,
        description,
        code,
        price,
        status: status || true,
        stock,
        category,
        thumbnails: thumbnails || [],
      };

      const createdProduct = await productManager.createProduct(newProduct);
      createdProducts.push(createdProduct);
    }

    res.send({
      status: 'success',
      message: 'Nuevos productos cargados correctamente',
      data: createdProducts,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al guardar los productos' });
  }
});

// Actualizar un producto por id
router.put('/:pid', async (req, res) => {
  const _id = req.params.pid;
  const updatedData = req.body;

  try {
    // Guardo el producto por si se modificó por error
    const product = await productManager.getProductsById(_id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const updatedProduct = await productManager.updateProduct(_id, updatedData);

    return res.json({
      status: 'success',
      message: 'Producto actualizado correctamente',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto por id
router.delete('/:pid', async (req, res) => {
  const _id = req.params.pid;

  try {
    // Guardo el producto por si se eliminó por error
    const product = await productManager.getProductsById(_id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await productManager.deleteProduct(_id);

    return res.json({
      status: 'success',
      message: 'El producto ha sido eliminado correctamente',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default router;
