import { validateToken } from '../utils/validations.utils.js';
import { getUserById } from '../services/dataBase/usersServices.js';
import config from '../config/config.js';
import { devLog, prodLog } from '../config/customLogger.js';

let log;
config.environment.env === 'production' ? (log = prodLog) : (log = devLog);

export const isUserOrTokenValid = (req, res, next) => {
  if (req.user) {
    return next();
  }

  const authToken = req.headers.authorization;
  const checkToken = validateToken(authToken);

  if (checkToken) {
    return next();
  }
  log.warn('No autorizado!, invalid token: ' + authToken);
  return res.status(401).send('No autorizado!');
};

export const verifyDocuments = async (req, res, next) => {
  const uid = req.params.uid;
  try {
    const user = await getUserById(uid);
    if (user.role === 'admin' || user.role === 'premium') {
      next();
    } else {
      const requiredDocs = [
        'identificacion',
        'comprobanteDomicilio',
        'comprobanteEstadoCuenta',
      ];

      const uploadedDocs = [];
      user.documents.forEach((doc) => uploadedDocs.push(doc.name));
      // Obtener los nombres de los archivos subidos
      const uploadedFileNames = uploadedDocs.map((file) =>
        file.replace(/\.[^/.]+$/, '')
      );
      const missingDocs = requiredDocs.filter(
        (fileName) => !uploadedFileNames.includes(fileName)
      );

      if (missingDocs.length !== 0) {
        log.error('Faltan los siguientes archivos:', missingDocs);
        return res.status(403).send('Incomplete documentation');
      }
      log.info('Todos los archivos requeridos están presentes.');
      return next();
    }
  } catch (error) {
    log.fatal('verifyDocuments: ' + error.message);
    return res.status(500).send('Error interno de servidor');
  }
};
