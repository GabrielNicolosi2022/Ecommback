 import * as logica from '../../utils/logicaPr.js';

const getProducts = async (req, res) => {
  try {
    // Obtener los query params
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query;

    // ordenar los productos si se proporciona sort
    const sortOptions = await logica.getSorted(sort);
    // filtrar los productos si se proporciona query
    const filter = logica.getFiltered(query);
    // opciones de paginación
    const options = {
      limit: limit,
      page: page,
    };

    // Obtener los productos paginados
    const {
      docs,
      totalPages,
      prevPage,
      nextPage,
      Page,
      hasNextPage,
      hasPrevPage,
    } = await logica.getPaginateProducts(options, filter, sortOptions);

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
};

const getProductById = async (req, res) => {
  try {
    // Obtengo el valor del parámetro de ruta 'pid'
    const _id = req.params.pid;

    // Obtener el producto por su ID utilizando la función getProductsById()
    const product = await logica.getProductById(_id);

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
};

const createProducts = async (req, res) => {
  try {
    const productsData = req.body;
    console.log(productsData);

    // Verificar que se proporcionen productos válidos
    if (
      !(Array.isArray(productsData) && productsData.length > 0) &&
      !(
        typeof productsData === 'object' && Object.keys(productsData).length > 0
      )
    ) {
      return res
        .status(400)
        .json({ error: 'No se proporcionaron productos válidos' });
    }

    const createdProducts = [];

    const processProduct = async (productData) => {
      try {
        const createdProduct = await logica.createProduct(productData);
        createdProducts.push(createdProduct);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    };

    if (Array.isArray(productsData)) {
      for (const productData of productsData) {
        await processProduct(productData);
      }
    } else {
      await processProduct(productsData);
    }

    res.send({
      status: 'success',
      message: 'Nuevos productos cargados correctamente',
      data: createdProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al guardar los productos' });
  }
};

const updateProduct = async (req, res) => {
  const _id = req.params.pid;
  const updatedData = req.body;

  try {
    const updatedProduct = await logica.updateProduct(_id, updatedData);

    return res.json({
      status: 'success',
      message: 'Producto actualizado correctamente',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const _id = req.params.pid;

  try {
    await logica.deleteProduct(_id);

    return res.json({
      status: 'success',
      message: 'El producto ha sido eliminado correctamente',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getProducts,
  getProductById,
  createProducts,
  updateProduct,
  deleteProduct,
};
