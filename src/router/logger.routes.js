import { Router } from 'express';
import fs from 'fs';
import { join } from 'path';
import __dirname from '../utils.js';

const loggerRouter = new Router();

// Función para leer un archivo
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return 'Error al leer el archivo';
  }
}

loggerRouter.get('/', (req, res) => {
  const filePath = join(__dirname, '/logs/errors.log'); // Ruta al archivo de errores
  console.log(filePath);
  const fileContent = readFileContent(filePath);

  res.status(200).send(fileContent);
});

export default loggerRouter;
