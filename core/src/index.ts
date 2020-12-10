/*********
 * Index of the service
 *   Here we configure all the stuff that belongs to the service
 *   in general, such as global middlewares, libs initializations
 *   (if needed), etc.
 *   The code written in here is executed just once!
 */

import express from 'express';
import errorHandler from 'errorhandler';
import logger from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';

import config from './config';
import router from './app/routes';
import { createProxyMiddleware } from 'http-proxy-middleware';

const index = express();

// Log stack trace of errors (to be used only on development phases!)
index.use(errorHandler());
// Log HTTP requests
// @ts-ignore
index.use(logger('dev'));
// Compress all responses
index.use(compression());
// Decode body responses
index.use(bodyParser.json());
index.use(bodyParser.urlencoded({ extended: true }));
// Enable Cross-Origin Resource Sharing
index.use(cors());

// Redirections
index.use(
  '/auth',
  createProxyMiddleware({
    target: 'http://authentication',
    changeOrigin: true,
    pathRewrite: { '^/auth': '' },
  })
);
index.use(
  '/uni',
  createProxyMiddleware({
    target: 'http://universitites_gateway',
    changeOrigin: true,
    pathRewrite: { '^/uni': '' },
  })
);
index.use(
  '/courses',
  createProxyMiddleware({
    target: 'http://courses',
    changeOrigin: true,
    pathRewrite: { '^/courses': '' },
  })
);
index.use(
  '/user',
  createProxyMiddleware({
    target: 'http://user',
    changeOrigin: true,
    pathRewrite: { '^/user': '' },
  })
);

// Uses router for all routes (we split the server logics and the routes definition)
index.use('/', router);

// Start listening for requests! :)
index.listen(config.PORT, config.HOST);
console.log(`API running on http://${config.HOST}:${config.PORT}`);
