import { Router } from 'express';

import RunnerController from './app/controllers/RunnerController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';
import gitMiddleware from './app/middlewares/git';

const routes = new Router();

routes.post('/session', SessionController.store);

// JWT Authentication
routes.use(authMiddleware);
routes.use(gitMiddleware);

routes.post('/runner', RunnerController.store);

export default routes;