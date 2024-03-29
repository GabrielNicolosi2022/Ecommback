import multer from 'multer';
import __dirname from '../utils.js';
import getLogger from '../utils/log.utils.js';

const log = getLogger();

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = `${__dirname}/public/images`;

    // Verificar el tipo de archivo y establecer la carpeta de destino
    if (file.fieldname === 'profileImage') {
      uploadPath = `${__dirname}/public/images/profiles`;
    } else if (file.fieldname === 'thumbnails') {
      uploadPath = `${__dirname}/public/images/products`;
    } else if (file.fieldname === 'documents') {
      uploadPath = `${__dirname}/public/images/documents`;
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    log.info(file);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploader = multer({
  storage,
  onError: (err, next) => {
    log.info(err);
    next();
  },
});
