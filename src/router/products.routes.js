import Router from 'express';
import ProductManager from '../dao/controllers/productManagerDB.js';
import { uploader } from '../middlewares/multer.js';

const router = Router();

const productManager = new ProductManager();

// Obtener todos los productos paginados, filtrados y ordenados
router.get('/', async (req, res) => {
  try {
    // Obtener los query params
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query;

    // opciones de paginación
    const options = {
      limit: limit,
      page: page,
    };

    // opciones de ordenamiento
    console.log('sort:', sort);

    const sortOptions = {};
if (sort) {
  if (sort === 'asc') {
    sortOptions.price = 1;
  } else if (sort === 'desc') {
    sortOptions.price = -1;
  }
}    
    console.log('sortOptions:', sortOptions);

    // filtro de búsqueda
    const filter = {};

    if (query) {
      if (query.category) {
        filter.$or = [{ category: query.category }];
      }
      if (query.status) {
        filter.$or = filter.$or || [];
        filter.$or.push({ status: query.status });
      }
    }

    // Cargo los productos utilizando mongoose-paginate-v2
    const {
      docs,
      totalPages,
      prevPage,
      nextPage,
      Page,
      hasNextPage,
      hasPrevPage,
    } = await productManager.getAllProductsPaginated(
      options,
      filter,
      sortOptions
    );
    // enlaces a página previa y siguiente
    const prevLink = hasPrevPage
      ? `/products?page=${prevPage}&limit=${limit}`
      : null;
    const nextLink = hasNextPage
      ? `/products?page=${nextPage}&limit=${limit}`
      : null;

    // objeto para respuesta
    const response = {
      status: 'success',
      payload: docs,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    };

    res.json(response);
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
