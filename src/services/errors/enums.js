const EErrors = {
  ROUTING_ERROR: 1,       // ruta inexistente
  INVALID_PARAM_ERROR: 2, // parámetro invalido
  INVALID_QUERY_ERROR: 3, // query invalida
  INVALID_TYPES_ERROR: 4, // falta algún dato (body)
};

// Database Errors
const DBErrors = {
  CONNECTION_ERROR: 1,    // error de conexión
  DATABASE_ERROR: 2,      // documento inexistente
  NOT_FOUND_ERROR: 3,     // id inexistente
};

// Product Errors
const PErrors = {
  OUT_OF_STOCK: 1,        // stock insuficiente
};  

// User Errors
const UErrors = {
  ORDER_ERROR: 1,
}

export {
  EErrors,
  PErrors,
  DBErrors,
  UErrors
};
