import { Router } from 'express';

import GitController from './app/controllers/GitController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/session', SessionController.store);

// JWT Authentication
routes.use(authMiddleware);

routes.post('/clone-repo', GitController.store);

export default routes;