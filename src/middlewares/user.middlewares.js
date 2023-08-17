import { validateToken } from '../utils/validations.utils.js';
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
