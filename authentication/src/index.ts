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
import router from './app/routes';
import passport from 'passport';
import './strategies/google-strategy';

import config from './config';

import cookieParser from 'cookie-parser';

const index = express();

// Used to handle authentication
index.use(passport.initialize());
// Log stack trace of errors (to be used only on development phases!)
index.use(errorHandler());
// Log HTTP requests
index.use(logger('dev'));
// Compress all responses
index.use(compression());
// Decode body responses
index.use(bodyParser.json());
index.use(bodyParser.urlencoded({ extended: true }));
// Enable Cross-Origin Resource Sharing
index.use(cors());
// Cookie parser
index.use(cookieParser());

// Uses router for all routes (we split the server logics and the routes definition)
index.use('/', router);

// Start listening for requests! :)
index.listen(config.PORT, config.HOST);
console.log(`API running on http://${config.HOST}:${config.PORT}`);
