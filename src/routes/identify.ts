import { Router, Request, Response, NextFunction } from 'express';
import { identify } from '../controllers/identifyController';

// Async handler wrapper to catch promise rejections
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const router = Router();
router.post('/', asyncHandler(identify));

export default router;