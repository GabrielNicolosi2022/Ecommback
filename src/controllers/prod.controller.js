import getLogger from '../utils/log.utils.js';
import * as prodServices from '../services/dataBase/prodServicesDB.js';
import * as usersServices from '../services/dataBase/usersServices.js';
import { deleteProductMail } from '../utils/mail.utils.js';
import customError from '../services/errors/customError.js';
import { EErrors, PErrors } from '../services/errors/enums.js';
import { createProductPropsErrorInfo } from '../services/errors/info.js';

const log = getLogger()

// Traer todos los productos
const getProducts = async (req, res) => {
  try {
    // Obtener los query params
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query;

    // ordenar los productos si se proporciona sort
    const sortOptions = {};
    if (sort) {
      if (sort === 'asc') {
        sortOptions.price = 1;
      } else if (sort === 'desc') {
        sortOptions.price = -1;
      }
    }

    // filtrar los productos si se proporciona query
    const filter = {};

    if (query) {
      if (query.category) {
        filter.$or = [{ category: query.category }];
      }
      if (query.title) {
        filter.$or = [{ title: query.title }];
      }
      if (query.status) {
        filter.$or = filter.$or || [];
        filter.$or.push({ status: query.status });
      }
    }

    // opciones de paginación
    const options = {
      limit: limit,
      page: page,
    };

    // Cargo los productos utilizando mongoose-paginate-v2
    const {
      docs,
      totalPages,
      prevPage,
      nextPage,
      Page,
      hasNextPage,
      hasPrevPage,
    } = await prodServices.getAllProductsPaginated(
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

    res.status(200).json({
      status: 'success',
      message: 'Productos encontrados',
      data: response,
    });
  } catch (error) {
    log.fatal('Error al obtener los productos.' + error.message);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

/**
 * getProductById - Obtiene un producto a partir un pid
 * @param {pid} req
 * @param {product} res
 * @returns
 */
const getProductById = async (req, res) => {
  try {
    // Obtengo el valor del parámetro de ruta 'pid'
    const _id = req.params.pid;

    // Obtener el producto por su ID utilizando la función getProductsById()
    const product = await prodServices.getProductsById(_id);

    if (req.get('User-Agent') && req.get('User-Agent').includes('Postman')) {
      if (!product) {
        log.error(`Producto con id ${_id} no encontrado`);
        return res
          .status(404)
          .json({ status: 'error', message: 'Producto no encontrado' });
      }

      res.status(200).json({
        status: 'success',
        message: 'Producto encontrado',
        data: product,
      });
    } else {
      if (!product) {
        return req.flash('Producto no encontrado');
      }
      if (!req.session.user) {
        res.render('productDetail', {
          pageTitle: 'Detalle del Producto',
          title: 'EcommBack',
          product: product,
        });
      } else {
        res.render('productDetail', {
          pageTitle: 'Detalle del Producto',
          title: 'EcommBack',
          product: product,
          userCart: req.session.user.cart,
        });
      }
    }
  } catch (error) {
    log.fatal('Error al obtener el producto. ' + error.message);
    res
      .status(500)
      .json({ status: 'error', message: 'Error al obtener el producto' });
  }
};

/**
 * createProducts - Crea un producto
 * @param {body} req
 * @param {createdProducts} res
 * @returns
 */
const createProducts = async (req, res) => {
  const productsData = req.body;
  const createdProducts = [];

  try {
    // Verificar que se proporcione un formato de producto válido
    if (
      !(Array.isArray(productsData) && productsData.length > 0) &&
      !(
        typeof productsData === 'object' && Object.keys(productsData).length > 0
      )
    ) {
      log.error('No se proporcionaron productos válidos');
      return res.status(400).send('No se proporcionaron productos válidos');
    }

    // Validar campos obligatorios para todos los productos antes de crearlos
    for (const productData of productsData) {
      const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        owner,
      } = productData;

      if (
        !title ||
        !description ||
        !code ||
        !price ||
        !status ||
        !stock ||
        !category
      ) {
        customError.createError({
          //! Luego de enviar el mensaje de error salta al catch, ademas no esta enviando al postman la custom res, sino la res del catch.
          name: 'Product creation error', // respuesta (res.json(message)) - sale por Postman
          cause: createProductPropsErrorInfo({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
          }), // respuesta por Terminal
          message: 'Error intentando crear el Producto',
          code: EErrors.INVALID_TYPES_ERROR,
        });
      }

      if (owner === 'premium' && req.user.role !== 'premium') {
        return res.status(403).send('No tienes permisos!');
      }
    }
    const processProduct = async (productData) => {
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

      // log.info('owner: ' + req.user); // clg
      const newProduct = {
        title,
        description,
        code,
        price,
        status: status || true,
        stock,
        category,
        thumbnails: thumbnails || [],
        owner: req.user.role === 'premium' ? req.user._id : 'admin',
      };

      const createdProduct = await prodServices.createProduct(newProduct);
      createdProducts.push(createdProduct);
    };

    if (Array.isArray(productsData)) {
      for (const productData of productsData) {
        await processProduct(productData);
      }
      res.status(200).send({
        status: 'success',
        message: 'Nuevos productos guardados correctamente',
        data: createdProducts,
      });
    } else {
      await processProduct(productsData);
      res.status(200).send({
        status: 'success',
        message: 'Nuevo producto guardado correctamente',
        data: createdProducts,
      });
    }
  } catch (error) {
    log.fatal('Error al guardar los productos ' + error.message); //! si quito el log no se muestra el custom en la consola
    return res.status(500).send('Error interno');
  }
};

const updateProduct = async (req, res) => {
  try {
    const _id = req.params.pid;
    const updatedData = req.body;

    // Guardo el producto por si se modificó por error
    const product = await prodServices.getProductsById(_id);

    if (!product) {
      log.error(`Producto con id ${_id} no encontrado`);
      return res.status(404).send('Producto no encontrado');
    }

    const updatedProduct = await prodServices.updateProduct(_id, updatedData);

    return res.status(200).json({
      status: 'success',
      message: 'Producto actualizado correctamente',
      data: updatedProduct,
    });
  } catch (error) {
    log.fatal('Error al actualizar el producto. ' + error.message);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

const deleteProduct = async (req, res) => {
  const _id = req.params.pid;

  try {
    // Guardo el producto por si se eliminó por error
    const product = await prodServices.getProductsById(_id);
    const ownerId = product.owner;
    const { role, email } = await usersServices.getUserById(ownerId);

    if (!product) {
      log.error(`Producto con id ${_id} no encontrado`);
      return res.status(404).send('Producto no encontrado');
    }

    await prodServices.deleteProduct(_id);

    // enviar un email al propietario indicando que el producto fue eliminado de la base de datos
    if (role === 'premium') {
      deleteProductMail(email);
      log.info(`Producto eliminado exitosamente, mail enviado a ${email}.`);
    }

    return res.status(200).json({
      status: 'success',
      message: 'El producto ha sido eliminado correctamente',
    });
  } catch (error) {
    log.fatal('Error al eliminar el producto. ' + error.message);
    res.status(500).send('Error interno del servidor');
  }
};

// VISTAS

const products = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query;

    // Lógica para obtener todos los productos desde la base de datos
    let products = await prodServices.getAllProducts();

    // Lógica para ordenar los productos si se proporciona sort
    const getSortedProducts = (products, sort) => {
      if (sort === 'asc') {
        return products.sort((a, b) => a.price - b.price);
      } else if (sort === 'desc') {
        return products.sort((a, b) => b.price - a.price);
      } else {
        return products;
      }
    };

    products = getSortedProducts(products, sort);

    // Lógica para filtrar los productos si se proporciona query
    const getFilteredProducts = (products, query) => {
      if (query.category) {
        return products.filter(
          (product) => product.category === query.category
        );
      }
      if (query.title) {
        filter.$or = [{ title: query.title }];
      }
      if (query.status) {
        return products.filter((product) => product.status === query.status);
      }
      return products;
    };

    products = getFilteredProducts(products, query);

    // Lógica de paginación
    const paginateProducts = (products, page, limit) => {
      const totalProducts = products.length;
      const totalPages = Math.ceil(totalProducts / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const currentProducts = products.slice(startIndex, endIndex);

      return {
        currentProducts,
        totalPages,
      };
    };
    const { currentProducts, totalPages } = paginateProducts(
      products,
      page,
      limit
    );

    // Enlaces de paginación
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;
    const prevLink = prevPage
      ? `/product?page=${prevPage}&limit=${limit}`
      : null;
    const nextLink = nextPage
      ? `/product?page=${nextPage}&limit=${limit}`
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
      // userCart: req.session.user.cart
    });
  } catch (error) {
    log.error('Error al obtener los productos', error);
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};


export {
  getProducts,
  getProductById,
  createProducts,
  updateProduct,
  deleteProduct,
  products,
};
