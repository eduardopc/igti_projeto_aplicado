import { Router } from 'express';

import GitController from './app/controllers/GitController';

const routes = new Router();

routes.post('/clone-repo', GitController.store);

export default routes;