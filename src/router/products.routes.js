import Router from 'express';

import ProductManager from '../dao/controllers/productManagerDB.js';

import { uploader } from '../utils.js';

const router = Router();

const productManager = new ProductManager();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    // Obtener los query params
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query.query;

    // Cargo los productos utilizando el método loadProducts()
    const products = await productManager.getAllProducts();
    // validación del query param 'limit'
    if (limit && !isNaN(limit) && limit > 0) {
      res.json(products.slice(0, limit));
      return res.json({ status: 'success', data: products });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Obtener un producto por id
router.get('/:pid', async (req, res) => {
  try {
    // Obtengo el valor del parámetro de ruta 'pid'
    const _id = req.params.pid;
    // Cargo el producto utilizando el método getProductsById()
    const product = await productManager.getProductsById(_id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    return res.json({
      status: 'success',
      message: 'Producto encontrado',
      data: product,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Crear un nuevo producto
router.post('/', uploader.array('thumbnails', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    // Valida que se proporcionen todos los campos obligatorios
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category
    ) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' }); // Ver problema en productManagerDB
    }
    const nuevoProducto = {
      title,
      description,
      code,
      price,
      status: status || true,
      stock,
      category,
      thumbnails: thumbnails || [],
    };
    console.log('Nuevo producto: ', nuevoProducto);
    await productManager.createProduct(nuevoProducto);
    res.send({
      status: 'success',
      message: 'Nuevo producto cargado correctamente',
      data: nuevoProducto,
    });
  } catch (error) {
    console.error('El error es: ', error);
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
    // Guardar los productos actualizados en el archivo JSON

    return res.json({
      status: 'success',
      message: 'Producto actualizado correctamente',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
    console.error('El error es: ', error);
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
    console.log(product);
    return res.json({
      status: 'success',
      message: 'El producto ha sido eliminado correctamente',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default router;
