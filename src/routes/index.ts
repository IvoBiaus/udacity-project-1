import express, { Request, Response } from 'express';

import api from './api';

import { ResponseReturn } from '../interfaces/responseReturn';

const routes = express.Router();

routes.get('/', (req: Request, res: Response): ResponseReturn => res.sendStatus(200));
routes.use('/api', api);

export default routes;
