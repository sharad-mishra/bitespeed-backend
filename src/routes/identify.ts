import { Router, Request, Response } from 'express';
import { identify } from '../controllers/identifyController';

const router = Router();
router.post('/', (req: Request, res: Response) => identify(req, res));

export default router;