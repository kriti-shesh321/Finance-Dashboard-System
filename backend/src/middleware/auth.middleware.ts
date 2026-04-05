import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth.types';
import jwt from 'jsonwebtoken';
import { ENV } from "../config/env";

const JWT_SECRET = ENV.JWT_SECRET;

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; };
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
