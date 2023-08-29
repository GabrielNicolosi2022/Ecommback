import config from '../config/config.js';
import { devLog, prodLog } from '../config/customLogger.js';

let log;
config.environment.env === 'production' ? (log = prodLog) : (log = devLog);

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
    log.error('Error de middleware: ' + error.message);
    res.status(500).send('Error interno del servidor');
  }
};
