import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Error:", err);

    // Zod validation error
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Validation error",
            errors: err.issues.map((issue) => ({
                path: issue.path,
                message: issue.message
            }))
        });
    }

    // Prisma database errors
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (err.code === 'P2002') {
            return res.status(400).json({
                message: "Duplicate field value (likely email already exists)"
            });
        }
    }

    // Custom errors (if you throw with statusCode)
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }

    // Fallback
    return res.status(500).json({
        message: "Internal server error"
    });
};