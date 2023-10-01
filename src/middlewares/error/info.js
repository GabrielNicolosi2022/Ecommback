import {
  EErrors,
  DBErrors,
  PErrors,
  UErrors,
} from '../../services/errors/enums.js';
import getLogger from '../utils/log.utils.js';

const log = getLogger();

const errorResponses = {
  [EErrors.ROUTING_ERROR]: { status: 'error', error: 'ROUTING_ERROR' },
  [EErrors.INVALID_PARAM]: { status: 'error', error: 'INVALID_PARAM' },
  [EErrors.INVALID_QUERY]: { status: 'error', error: 'INVALID_QUERY' },
  [EErrors.INVALID_TYPES_ERROR]: { status: 'error', error: 'INVALID_TYPES_ERROR' },
  [DBErrors.CONNECTION_ERROR]: { status: 'error', error: 'CONNECTION_ERROR' },
  [DBErrors.DATABASE_ERROR]: { status: 'error', error: 'DATABASE_ERROR' },
  [DBErrors.NOT_FOUND_ERROR]: { status: 'error', error: 'NOT_FOUND_ERROR' },
  [PErrors.OUT_OF_STOCK]: { status: 'error', error: 'OUT_OF_STOCK' },
  [UErrors.ORDER_ERROR]: { status: 'error', error: 'ORDER_ERROR' },
};

export default (error, req, res, next) => {
  log.info(error.cause);
  const response = errorResponses[error.code] || { error: 'unhandled error' };
  res.send(response);
};
