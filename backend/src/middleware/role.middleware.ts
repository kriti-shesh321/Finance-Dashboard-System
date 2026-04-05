import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth.types";

export const roleMiddleware = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const userData = req.user as { id: string; role: string; };

        if (!userData) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        if (!allowedRoles.includes(userData.role)) {
            return res.status(403).json({ message: "Forbidden." });
        }

        next();
    };
};