import { Router } from 'express';
import { v4 } from 'uuid';
import ProductManager from '../../services/fileSystem/prodServicesFS.js'
import { uploader } from '../../middlewares/multer.js';

const productsRouterFs = Router();
const productManager = new ProductManager();

// Obtener todos los productos
productsRouterFs.get('/', async (req, res) => {
  try {
    // Obtengo el valor del query param 'limit' y lo convierto a un número entero
    const limit = parseInt(req.query.limit);
    // Cargo los productos utilizando el método loadProducts()
    const products = await productManager.loadProducts();
    // validación del query param 'limit'
    if (limit && !isNaN(limit) && limit > 0) {
      res.json(products.slice(0, limit));
      return;
    }
    return res.json({ status: 'success', data: products });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Obtener un producto por id
productsRouterFs.get('/:pid', async (req, res) => {
  try {
    // Obtengo el valor del parámetro de ruta 'pid'
    const pid = parseInt(req.params.pid);
    // Cargo los productos utilizando el método loadProducts()
    const products = await productManager.loadProducts();
    // Busca el producto solicitado por su 'product id'
    const product = await products.find((p) => p.id === pid);
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

// Agregar un nuevo producto
productsRouterFs.post('/', uploader.array('thumbnails', 5), async (req, res) => {
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
      res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const nuevoProducto = {
      id: v4(),
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
    await productManager.addProduct(nuevoProducto);
    res.send({
      status: 'success',
      message: 'Nuevo producto cargado correctamente',
      data: nuevoProducto,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar los productos' });
    console.error('El error es: ', error);
  }
});

// Actualizar un producto por id
productsRouterFs.put('/:pid', async (req, res) => {
  try {
    // Obtener el valor del parámetro de ruta 'pid'
    const pid = parseInt(req.params.pid);
    // Cargar los productos utilizando el método loadProducts()
    const products = await productManager.loadProducts();
    // Buscar el producto solicitado por su 'product id'
    const productIndex = products.findIndex((p) => p.id === pid);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    // Crear una copia del producto existente
    const updatedProduct = { ...products[productIndex] };
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

    // Actualizar los campos del producto solo si se proporcionan en el cuerpo de la solicitud
    if (title) updatedProduct.title = title;
    if (description) updatedProduct.description = description;
    if (code) updatedProduct.code = code;
    if (price) updatedProduct.price = price;
    if (status !== undefined) updatedProduct.status = status;
    if (stock) updatedProduct.stock = stock;
    if (category) updatedProduct.category = category;
    if (thumbnails) updatedProduct.thumbnails = thumbnails;

    // Actualizar el producto en el arreglo de productos
    products[productIndex] = updatedProduct;
    await productManager.saveProducts(products); // Guardar los productos actualizados en el archivo JSON

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
productsRouterFs.delete('/:pid', async (req, res) => {
  try {
    // Obtener el valor del parámetro de ruta 'pid'
    const pid = parseInt(req.params.pid);
    // Cargar los productos utilizando el método loadProducts()
    const products = await productManager.loadProducts();
    // Buscar el producto solicitado por su 'product id'
    const productIndex = products.findIndex((p) => p.id === pid);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    //eliminar el producto del array de productos
    products.splice(productIndex, 1);
    //guardar los productos actualizados
    await productManager.saveProducts(products);
    return res.json({
      status: 'success',
      message: 'El producto ha sido eliminado correctamente',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default productsRouterFs;
