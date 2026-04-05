import { Response } from "express";
import { prisma } from "../../config/prisma";
import { AuthRequest } from "../../types/auth.types";
import { Role, Type } from "@prisma/client";

export const createRecord = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id as string;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { amount, type, category, notes, date } = req.body;

        const newRecord = await prisma.record.create({
            data: {
                amount,
                type,
                category,
                notes,
                date: new Date(date),
                addedBy: { connect: { id: userId } }
            },
            omit: {
                deletedAt: true,
                addedBy: true
            }
        });

        return res.status(201).json({
            message: "Record created successfully",
            record: newRecord
        });

    } catch (error) {
        console.error("Error creating record:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const getRecords = async (req: AuthRequest, res: Response) => {
    try {
        const { id, role } = req.user as { id: string; role: string; };
        const { type, category, startDate, endDate, page, limit } = req.query as {
            type?: string;
            category?: string;
            startDate?: string;
            endDate?: string;
            page?: string;
            limit?: string;
        };

        const isAdmin = role === Role.ADMIN;

        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const skip = (pageNum - 1) * limitNum;


        const records = await prisma.record.findMany({
            where: {
                deletedAt: null,

                ...(isAdmin ? {} : { userId: id }),

                type: type ? type.toUpperCase() as Type : undefined,
                category: category || undefined,
                date: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined
                }
            },
            omit: {
                notes: true,
                deletedAt: true
            },
            orderBy: {
                date: 'desc'
            },
            skip,
            take: limitNum
        });

        return res.status(200).json({
            message: "Records fetched successfully.",
            page: pageNum,
            limit: limitNum,
            count: records.length,
            data: records
        });
    } catch (error) {
        console.error("Error fetching records:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const editRecord = async (req: AuthRequest, res: Response) => {
    try {
        const recordId = req.params.id as string;
        const { id: userId, role } = req.user as { id: string; role: string; };
        const { amount, type, category, notes, date } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!recordId) {
            return res.status(400).json({ message: "Record ID is required." });
        }

        const existingRecord = await prisma.record.findUnique({ where: { id: recordId } });

        if (!existingRecord || existingRecord.deletedAt) {
            return res.status(404).json({ message: "Record not found." });
        }

        if (existingRecord.userId !== userId && role !== Role.ADMIN) {
            return res.status(403).json({ message: "Forbidden. You can only edit your own records." });
        }

        const updatedRecord = await prisma.record.update({
            where: { id: recordId },
            data: {
                amount,
                type,
                category,
                notes,
                date: date ? new Date(date) : undefined
            },
            omit: {
                deletedAt: true
            }
        });

        return res.status(200).json({
            message: "Record updated successfully",
            record: updatedRecord
        });
    } catch (error) {
        console.error("Error editing record:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const deleteRecord = async (req: AuthRequest, res: Response) => {
    try {
        const recordId = req.params.id as string;
        const { id: userId, role } = req.user as { id: string; role: string; };

        if (!recordId) {
            return res.status(400).json({ message: "Record ID is required." });
        }

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const existingRecord = await prisma.record.findUnique({ where: { id: recordId } });

        if (!existingRecord || existingRecord.deletedAt) {
            return res.status(404).json({ message: "Record not found." });
        }

        if (existingRecord.userId !== userId && role !== Role.ADMIN) {
            return res.status(403).json({ message: "Forbidden. You can only delete your own records." });
        }

        await prisma.record.update({
            where: { id: recordId },
            data: {
                deletedAt: new Date()
            }
        });

        return res.status(200).json({ message: "Record deleted successfully." });

    } catch (error) {
        console.error("Error deleting record:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const restoreRecord = async (req: AuthRequest, res: Response) => {
    try {
        const recordId = req.params.id as string;
        const { id: userId, role } = req.user as { id: string; role: string; };

        if (!recordId) {
            return res.status(400).json({ message: "Record ID is required." });
        }

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const existingRecord = await prisma.record.findUnique({ where: { id: recordId } });

        if (!existingRecord || !existingRecord.deletedAt) {
            return res.status(404).json({ message: "Record not found." });
        }

        if (existingRecord.userId !== userId && role !== Role.ADMIN) {
            return res.status(403).json({ message: "Forbidden. You can only restore your own records." });
        }

        await prisma.record.update({
            where: { id: recordId },
            data: {
                deletedAt: null
            }
        });

        return res.status(200).json({ message: "Record restored successfully." });
    } catch (error) {
        console.error("Error restoring record:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};