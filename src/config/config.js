import dotenv from 'dotenv';
let config = {};

const environment = 'development'; // cambiar environment: 'production' / 'development' / 'testing'

dotenv.config({
  path:
    environment === 'development'
      ? '.env.development'
      : environment === 'testing'
      ? '.env.testing'
      : '.env.production',
});

config.environment = {
  env: process.env.NODE_ENV,
};

config.server = {
  port: process.env.PORT,
};

config.db = {
  cs: process.env.MONGO_URI,
  dbName: process.env.DB_NAME,
};

config.session = {
  secret: process.env.SESSION_SECRET,
};

config.admin = {
  username: process.env.ADMIN_USER,
  password: process.env.ADMIN_PASS,
};

config.github = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
};

config.jwt = {
  token: process.env.jwtToken,
};

config.mail = {
  relay: process.env.relay,
  mailPort: process.env.mailPort,
  mailUser: process.env.mailUser,
  mailPass: process.env.mailPass,
};

config.url = {
  baseUrl: process.env.baseUrl,
  recoverPassword: process.env.recoverPassword,
};

// console.log(config);

export default config;
