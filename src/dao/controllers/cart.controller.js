import CartManager from './cartManagerDB.js';
const cartManager = new CartManager();

const cart = (req, res) => {
  res.render('cart', { title: 'EcommBack' });
};

const cartById = async (req, res) => {
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
};

export { cart, cartById };