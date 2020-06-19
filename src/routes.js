const { Router } = require('express');
const SessionController = require('./app/controllers/SessionController');
const RecipientController = require('./app/controllers/RecipientController');
const authMiddleware = require('./app/middlewares/auth');
const adminMiddleware = require('./app/middlewares/admin');

const routes = new Router();

routes.post('/login', SessionController.store);
routes.post(
  '/recipient',
  authMiddleware,
  adminMiddleware,
  RecipientController.store,
);
routes.put(
  '/recipient/:id',
  authMiddleware,
  adminMiddleware,
  RecipientController.update,
);

module.exports = routes;
