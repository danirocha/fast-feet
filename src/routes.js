const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('./config/multer');

const SessionController = require('./app/controllers/SessionController');
const FileController = require('./app/controllers/FileController');
const RecipientController = require('./app/controllers/RecipientController');
const DeliverymanController = require('./app/controllers/DeliverymanController');
const DeliveryController = require('./app/controllers/DeliveryController');
const DeliverymanDeliveriesController = require('./app/controllers/DeliverymanDeliveriesController');
const DeliveryProblemController = require('./app/controllers/DeliveryProblemController');
const ProblemController = require('./app/controllers/ProblemController');
const authMiddleware = require('./app/middlewares/auth');
const adminMiddleware = require('./app/middlewares/admin');

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/login', SessionController.store);

routes.use(authMiddleware);

routes.get('/deliveryman/:id/deliveries', DeliverymanDeliveriesController.list);
routes.put(
  '/deliveryman/:id/deliveries/:delivery_id',
  DeliverymanDeliveriesController.update,
);
routes.get('/delivery/:id/problem', DeliveryProblemController.list);
routes.post('/delivery/:id/problem', DeliveryProblemController.store);

routes.use(adminMiddleware);

routes.post('/file', upload.single('file'), FileController.store);
routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);
routes.get('/deliveryman/', DeliverymanController.list);
routes.post('/deliveryman/', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);
routes.get('/delivery/', DeliveryController.list);
routes.post('/delivery/', DeliveryController.store);
routes.put('/delivery/:id', DeliveryController.update);
routes.delete('/delivery/:id', DeliveryController.delete);
routes.get('/problem', ProblemController.list);
routes.delete('/problem/:id/cancel-delivery', ProblemController.delete);

module.exports = routes;
