import { Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";
import { Role } from "@prisma/client";

// @desc Create a new user
// @route POST /api/v1/users
// @access Admin only
export const createUser = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, password, role, status } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || Role.VIEWER,
                status: status ?? true,
            },
            omit: {
                password: true,
                deletedAt: true
            }
        });

        return res.status(201).json({
            message: "User created successfully",
            user: newUser
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc Get list of users with pagination and filters
// @route GET /api/v1/users
// @access Admin only
export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const { page, limit, status } = req.query as {
            page?: string;
            limit?: string;
            status?: string;
        };
        const includeDeleted = req.query.includeDeleted === "true";

        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const skip = (pageNum - 1) * limitNum;

        // filters
        const where: any = {};

        // deleted user filter
        if (!includeDeleted) {
            where.deletedAt = null;
        }

        // status filter, default 'all'
        if (status === "active") {
            where.status = true;
        } else if (status === "inactive") {
            where.status = false;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { createdAt: "desc" },
                omit: {
                    password: true,
                    deletedAt: true
                }
            }),
            prisma.user.count({ where })
        ]);

        return res.status(200).json({
            message: "Users fetched successfully",
            page: pageNum,
            limit: limitNum,
            total,
            data: users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc Edit user details
// @route PUT /api/v1/users/:id
// @access Admin can edit any user, users can edit their own profile
export const editUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id: currentUserId, role: currentUserRole } = req.user as { id: string; role: string; };
        const { id: targetUserId } = req.params as { id: string; };
        const { name, email, password, role, status } = req.body;

        if (currentUserRole !== Role.ADMIN && currentUserId !== targetUserId) {
            return res.status(403).json({ message: "Forbidden: You can only edit your own profile." });
        }

        const existingUser = await prisma.user.findUnique({ where: { id: targetUserId } });

        if (!existingUser || existingUser.deletedAt) {
            return res.status(404).json({ message: "User not found" });
        }

        const updateUser = await prisma.user.update({
            where: {
                id: (currentUserRole === Role.ADMIN ? targetUserId : currentUserId)
            },
            data: {
                name,
                email,
                password: password ? await bcrypt.hash(password, 10) : undefined,
                role: currentUserRole === Role.ADMIN ? role : undefined,
                status: currentUserRole === Role.ADMIN ? status : undefined
            },
            omit: {
                password: true,
                deletedAt: true
            }
        });

        return res.status(200).json({
            message: "User updated successfully.",
            user: updateUser
        });
    } catch (error) {
        console.error("Error editing user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc Soft delete a user
// @route DELETE /api/v1/users/:id
// @access Admin only (cannot delete own account)
export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id: userId } = req.params as { id: string; };
        const { id: currentUserId } = req.user as { id: string; };

        if (userId === currentUserId) {
            return res.status(400).json({ message: "You cannot delete your own account." });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date() }
        });

        return res.status(200).json({
            message: "User deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};