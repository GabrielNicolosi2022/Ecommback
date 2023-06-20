# EcommBack
EcommBack es una aplicación backend para un e-commerce, basada en [Node.js](https://nodejs.org/en "Node.js") y Express, la cual cuenta con controladores para productos y carritos, como tambien para un sistema de login basado en sesiones. Todos los controladores poseen un storage en la base de datos [MongoDB Atlas](https://www.mongodb.com/ "MongoDB").

**Tabla de Contenidos**

[TOCM]

## Librerias, Protocolos y Plantillas
La aplicación utiliza [express-handlebars ](https://www.npmjs.com/package/express-handlebars "express-handlebars ") como motor de plantillas, [Bootstrap 5](https://getbootstrap.com/ "Bootstrap 5") librería utilizada en las vistas frontend, [mongoose](https://mongoosejs.com/ "mongoose") como ODM para conectarse con MongoDB Atlas, [multer](https://www.npmjs.com/package/multer "multer") middleware utilizado para cargar archivos (imágenes), [ cookie-parser](https://expressjs.com/en/resources/middleware/cookie-parser.html " cookie-parser") para protección de las cookies de sesiones, [express-session](https://www.npmjs.com/package/express-session "express-session") para manejar el sistema de sesiones y [connect-mongo](https://www.npmjs.com/package/connect-mongo "connect-mongo") para almacenar  las sesiones de usuarios en la base de datos, para registro y login utiliza [passport](https://www.passportjs.org/) y [bcrypt](https://www.npmjs.com/package/bcrypt).

## Productos
Este apartado cuenta con una vista general paginada de todos los productos, la cual tiene la opcion de cambiarle tanto la cantidad de productos mostrados por página como asi también el número de página que se desea visualizar, cuenta también con un filtro por categoria y/o disponibilidad y ordenamiento ascendente o descendente basado en el precio.

**Rutas disponibles**
- Listar todos los productos
- Buscar un producto por ID
- Guardar un nuevo producto con hasta 5 imágenes
- Modificar productos por ID
- Eliminar productos

## Carritos
Este apartado cuenta con una vista general paginada de todos los carritos, la cual tiene la opcion de cambiarle tanto la cantidad de carritos mostrados por página como asi también el número de página que se desea visualizar.

**Rutas disponibles**
- Listar todos los carritos
- Buscar un carrito por ID
- Guardar un nuevo carrito sin límite de productos
- Modificar carrito por ID (agregar productos)
- Modificar producto/s en un carrito 
- Eliminar un producto del carrito
- Eliminar un carrito

## Login
Este apartado se encarga de todo lo referido a la validación de usuarios y los permisos que los mismos tienen para acceder a las distintas funcionalidades del sistema.
El sistema cuanta con registro, login y vista de perfil de usuario, los mismos cuentan con un sistema de permisos según su rol (user / admin).
Tanto el registro como el login se hacen mediante passport como sistema de validación, tambien cuenta con login y registro automático mediante github, en todos los casos los passwords son hasheados mediante bcrypt.


###Images

![](https://)

>Vistas de la aplicación



###End