import ProductManager from '../productManagerDB.js';
import * as logica from '../../../services/routes/logicaProd.js';

const productManager = new ProductManager();

const getProducts = async (req, res) => {
  try {
    // Obtener los query params
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query;

    // ordenar los productos si se proporciona sort
    const sortOptions = await logica.getSortedProducts(sort);
    // filtrar los productos si se proporciona query
    const filter = logica.getFilteredProducts(query);
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



export { getProducts, getProductById };
