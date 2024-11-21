require('dotenv').config();
const RedisStore = require('connect-redis').default;
const redisClient = require('../redisClient');

const env = process.env.NODE_ENV || 'development';

const config = {
  production: {
    store: new RedisStore({ client: redisClient }),
    proxy: true,
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 8 * 60 * 60 * 1000, // 共 8 個小時
      secure: true,
      sameSite: 'none',
    },
  },
  development: {
    store: new RedisStore({ client: redisClient }),
    proxy: true,
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 8 * 60 * 60 * 1000, // 共 8 個小時
      secure: false,
      sameSite: 'lax',
    },
  },
  test: {
    store: new RedisStore({ client: redisClient }),
    proxy: true,
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 8 * 60 * 60 * 1000, // 共 8 個小時
      secure: false,
      sameSite: 'lax',
    },
  },
};

module.exports = config[env];
