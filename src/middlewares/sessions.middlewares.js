import getLogger from '../utils/log.utils.js';

const log = getLogger();

export const verifyRequiredFields = (req, res, next) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    // Verificar si todos los campos requeridos están presentes
    if (!first_name || !last_name || !email || !age || !password) {
      log.error('All fields are required');
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required',
      });
    }
    next();
  } catch (error) {
    log.error('verifyRequiredFields: ' + error.message);
    res.status(500).send('Error interno del servidor');
  }
};

export const requireDocumentation = (req, res, next) => {
  const { role } = req.body;
  try {
    if (role === 'user') {
      return next();
    } else if (role === 'premium') {
      const uploadedDocs = req.files;
      log.info('uploadedDocs:', uploadedDocs);
      const requiredDocs = [
        'identificacion',
        'comprobanteDomicilio',
        'comprobanteEstadoCuenta',
      ];

      const uploadedFileNames = Object.keys(uploadedDocs);

      const missingDocs = requiredDocs.filter(
        (fileName) => !uploadedFileNames.includes(fileName)
      );

      if (missingDocs.length !== 0) {
        // Si faltan documentos requeridos, responde con un error.
        return res.status(403).send('Incomplete documentation');
      }
    }
    next();
  } catch (error) {
    log.error('requireDocumentation: ' + error.message);
    res.status(500).send('Error interno del servidor');
  }
};

export const passSessionToViews = (req, res, next) => {
  res.locals.userSession = req.session.user;
  next();
};
