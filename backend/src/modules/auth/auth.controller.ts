import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from "../../config/prisma";
import { ENV } from "../../config/env";
import { AuthRequest } from "../../types/auth.types";
import { Role } from "@prisma/client";

const JWT_SECRET = ENV.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: Role.VIEWER
            }
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (!existingUser) return res.status(401).json({ message: "Invalid credentials." });

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials." });

        if (!existingUser.status || existingUser.deletedAt) return res.status(401).json({ message: "Unauthorized." });

        const token = jwt.sign(
            {
                id: existingUser.id,
                role: existingUser.role
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
        };

        return res.status(200).json({ token, user });

    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const getUser = async (req: AuthRequest, res: Response) => {
    try {
        const userData = req.user as { id: string; role: string; };

        if (!userData?.id) return res.status(401).json({ message: "Unauthorized" });

        const user = await prisma.user.findUnique({
            where: { id: userData.id }
        });

        if (!user) return res.status(404).json({ message: "User not found." });

        if (!user.status || user.deletedAt) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};