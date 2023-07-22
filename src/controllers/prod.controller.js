import * as prodServices from '../services/dataBase/prodServicesDB.js';

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

    res.json({
      status: 'success',
      message: 'Productos encontrados',
      data: response,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

const getProductById = async (req, res) => {
  try {
    // Obtengo el valor del parámetro de ruta 'pid'
    const _id = req.params.pid;

    // Obtener el producto por su ID utilizando la función getProductsById()
    const product = await prodServices.getProductsById(_id);

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
    const createdProducts = [];
    // console.log(productsData);

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

    const processProduct = async (productData) => {
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
          return res
            .status(400)
            .json({ message: 'Faltan campos obligatorios' });
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

        const createdProduct = await prodServices.createProduct(newProduct);
        createdProducts.push(createdProduct);
      } catch (error) {
        return res.status(500).json({ message: 'Error al crear el producto' });
      }
    };

    if (Array.isArray(productsData)) {
      for (const productData of productsData) {
        await processProduct(productData);
      }
      res.send({
        status: 'success',
        message: 'Nuevos productos guardados correctamente',
        data: createdProducts,
      });
    } else {
      await processProduct(productsData);
      res.send({
        status: 'success',
        message: 'Nuevo producto guardado correctamente',
        data: createdProducts,
      });
    }
    console.log('createdProducts: ', createdProducts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error al guardar los productos' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const _id = req.params.pid;
    const updatedData = req.body;

    // Guardo el producto por si se modificó por error
    const product = await prodServices.getProductsById(_id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updatedProduct = await prodServices.updateProduct(_id, updatedData);

    return res.json({
      status: 'success',
      message: 'Producto actualizado correctamente',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

const deleteProduct = async (req, res) => {
  const _id = req.params.pid;

  try {
    // Guardo el producto por si se eliminó por error
    const product = await prodServices.getProductsById(_id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await prodServices.deleteProduct(_id);

    return res.json({
      status: 'success',
      message: 'El producto ha sido eliminado correctamente',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto' });
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
    const product = await prodServices.getProductsById(productId);
    console.log(product);
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

export {
  getProducts,
  getProductById,
  createProducts,
  updateProduct,
  deleteProduct,
  products,
  productsById,
};