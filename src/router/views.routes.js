import { Router } from 'express';
import productsModel from '../dao/models/ProductModel.js';
import CartManager from '../dao/controllers/cartManagerDB.js';

const router = Router();
const cartManager = new CartManager();


router.get('/', (req, res) => {
  res.render('index', { title: 'EcommBack' });
});

router.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort; // Aún no implementado
    const query = req.query; // Aún no implementado

    const products = await productsModel.find().lean();

    // Lógica de paginación
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const currentProducts = products.slice(startIndex, endIndex);

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
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
});

router.get('/product/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productsModel.findById(productId).lean();

    res.render('productDetail', { pageTitle: 'Detalle del Producto', title: 'EcommBack', product });
    
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener los detalles del producto', error });
  }
});

router.get('/cart/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.render('cart', {
      pageTitle: 'Carrito',
      products: cart.products,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error });
  }
});

export default router;
