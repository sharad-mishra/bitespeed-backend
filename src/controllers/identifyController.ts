import { Request, Response } from 'express';
import { IdentifyService } from '../services/identifyService';

interface IdentifyRequest {
  email?: string;
  phoneNumber?: string;
}

const identifyService = new IdentifyService();

export async function identify(req: Request, res: Response) {
  try {
    const { email, phoneNumber } = req.body as IdentifyRequest;
    const response = await identifyService.identify({ email, phoneNumber });
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}