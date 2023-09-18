import { getProductsById } from '../services/dataBase/prodServicesDB.js';
import config from '../config/config.js';
import { devLog, prodLog } from '../config/customLogger.js';

let log;
config.environment.env === 'production' ? (log = prodLog) : (log = devLog);

export const checkProductOwner = async (req, res, next) => {
  try {
    //   obtener id del producto de los parametros de la ruta
    const productId = req.params.pid;

    // Buscar el producto en la base de datos
    const product = await getProductsById(productId);
    if (!product) {
      log.info('Producto inexistente');
      return res.status(404).send('Producto inexistente');
    }
    // Si el usuario es 'admin', permitir continuar
    if (req.session.user.role === 'admin') {
      next();
      // Si el usuario es dueño del producto, permitir continuar
    } else if (product.owner.toString() === req.user._id.toString()) {
      next();
    } else {
      log.error(
        'Acceso denegado, solo el propietario del producto posee permisos para realizar esta acción'
      );
      return res.status(403).send('Acceso denegado');
    }
  } catch (e) {
    log.error('Error en el middleware checkProductOwner:', e);
    res.status(500).send('Error interno');
  }
};
