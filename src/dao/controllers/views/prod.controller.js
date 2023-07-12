import productsModel from '../../../models/ProductModel.js';
import * as logica from '../../../services/views/logicaProd.js';

const products = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query;

    // ordenar los productos si se proporciona sort
    let products = await logica.getSortedProducts(sort);
    // filtrar los productos si se proporciona query
    products = logica.getFilteredProducts(products, query);
    // paginación
    const { currentProducts, totalPages } = logica.paginateProducts(
      products,
      page,
      limit
    );

    // Enlaces de paginación
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;
    const prevLink = prevPage
      ? `/products?page=${prevPage}&limit=${limit}`
      : null;
    const nextLink = nextPage
      ? `/products?page=${nextPage}&limit=${limit}`
      : null;

    res.render('products', {
      title: 'EcommBack',
      pageTitle: 'Lista de Productos',
      products: currentProducts,
      totalPages,
      prevPage,
      nextPage,
      prevLink,
      nextLink,
      user: req.session.user,
    });
  } catch (error) {
    console.error('Error al obtener los productos', error);
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};

const productsById = async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productsModel.findById(productId).lean();

    res.render('productDetail', {
      pageTitle: 'Detalle del Producto',
      title: 'EcommBack',
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener los detalles del producto', error });
  }
};

export { products, productsById };
