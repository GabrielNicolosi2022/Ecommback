import { Router } from 'express';
import fs from 'fs';
import { join } from 'path';
import __dirname from '../utils.js';
import { checkRole } from '../middlewares/auth.js';
import getLogger from '../utils/log.utils.js';

const log = getLogger();

const loggerRouter = new Router();

// Función para leer un archivo
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return 'Error al leer el archivo';
  }
}

loggerRouter.get('/',checkRole('admin'), (req, res) => {
  const filePath = join(__dirname, '/logs/errors.log'); // Ruta al archivo de errores
  log.info(filePath);
  const fileContent = readFileContent(filePath);

  res.status(200).send(fileContent);
});

export default loggerRouter;
