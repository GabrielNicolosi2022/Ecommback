const root = (req, res) => {
  res.redirect('/login');
};

const register = (req, res) => {
  res.render('register', {
    title: 'Registro de usuario',
    view: 'Crear usuario',
  });
};

const failregister = async (req, res) => {
  console.log('Failed Strategy');
  res.render('register', {
    title: 'Registro de usuario',
    view: 'Crear usuario',
    message: 'El email ya se encuentra en uso',
  });
};

const login = (req, res) => {
  res.render('login', {
    title: 'Login de usuario',
    view: 'Login',
  });
};

const faillogin = async (req, res) => {
  console.log('Failed Login');
  res.render('login', {
    title: 'Login de usuario',
    view: 'Login',
    message: 'Inicio de sesión incorrecto',
  });
};

const profile = (req, res) => {
  res.render('profile', {
    title: 'Profile de usuario',
    view: 'Perfil',
    userSession: req.session.user,
    isAdmin: req.session.user.role === 'admin', // Agregar una variable 'isAdmin' según el rol del usuario
  });
};

// ! Reestructurar
import productsModel from "../models/ProductModel.js";
import CartManager from "./cartManagerDB.js";
const cartManager = new CartManager();

const products = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query;

    let products = await productsModel.find().lean();

    // Lógica para ordenar los productos si se proporciona sort
    if (sort) {
      if (sort === 'asc') {
        products = products.sort((a, b) => a.price - b.price);
      } else if (sort === 'desc') {
        products = products.sort((a, b) => b.price - a.price);
      }
    }

    // Lógica para filtrar los productos si se proporciona query
    if (query) {
      if (query.category) {
        products = products.filter(
          (product) => product.category === query.category
        );
      }
      if (query.status) {
        products = products.filter(
          (product) => product.status === query.status
        );
      }
    }

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

const cart = (req, res) => {
  res.render('cart', { title: 'EcommBack' });
}

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


export { root, register, failregister, login, faillogin, profile, products, productsById, cart, cartById };
