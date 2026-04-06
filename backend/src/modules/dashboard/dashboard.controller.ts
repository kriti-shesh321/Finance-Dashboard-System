import { Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { prisma } from "../../config/prisma";

// @desc Get dashboard summary (total income, expenses, net balance)
// @route GET /api/v1/dashboard/summary
// @access All authenticated users (data filtered by role)
export const getSummary = async (req: AuthRequest, res: Response) => {
    try {
        const { id: userId, role } = req.user as { id: string; role: string; };

        const [totalIncome, totalExpenses] = await prisma.$transaction([
            prisma.record.aggregate({
                where: {
                    ...(role === "ADMIN" ? {} : { userId }),
                    type: "INCOME",
                    deletedAt: null
                },
                _sum: { amount: true }
            }),
            prisma.record.aggregate({
                where: {
                    ...(role === "ADMIN" ? {} : { userId }),
                    type: "EXPENSE",
                    deletedAt: null
                },
                _sum: { amount: true }
            })
        ]);

        const income = Number(totalIncome._sum.amount ?? 0);
        const expenses = Number(totalExpenses._sum.amount ?? 0);
        const netBalance = income - expenses;

        return res.status(200).json({
            totalIncome: income,
            totalExpenses: expenses,
            netBalance
        });

    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        return res.status(500).json({ message: "Internal server error." });
    };
};

// @desc Get totals by category
// @route GET /api/v1/dashboard/category-totals
// @access All authenticated users (data filtered by role)
export const getCategoryTotals = async (req: AuthRequest, res: Response) => {
    try {
        const { id: userId, role } = req.user as { id: string; role: string; };

        const filteredData = await prisma.record.groupBy({
            by: ['category', 'type'],
            where: {
                ...(role === "ADMIN" ? {} : { userId }),
                deletedAt: null
            },
            _sum: {
                amount: true
            }
        });

        const result: Record<string, { income: number; expense: number; }> = {};

        for (const item of filteredData) {
            const category = item.category || "uncategorized";

            if (!result[category]) {
                result[category] = { income: 0, expense: 0 };
            }

            if (item.type === "INCOME") {
                result[category].income += Number(item._sum.amount || 0);
            } else {
                result[category].expense += Number(item._sum.amount || 0);
            }
        }

        const categoryTotals = Object.entries(result).map(([category, value]) => ({
            category,
            totalIncome: value.income,
            totalExpense: value.expense,
            balance: value.income - value.expense
        }));

        return res.status(200).json(categoryTotals);
    } catch (error) {
        console.error("Error fetching category totals:", error);
        return res.status(500).json({ message: "Internal server error." });
    };
};

// @desc Get trends over time (income vs expenses)
// @route GET /api/v1/dashboard/trends?period=weekly|monthly
// @access All authenticated users (data filtered by role)
export const getTrends = async (req: AuthRequest, res: Response) => {
    try {
        const { id: userId, role } = req.user as { id: string; role: string; };
        const period = (req.query.period as string || "monthly").toLowerCase();

        const records = await prisma.record.findMany({
            where: {
                ...(role === "ADMIN" ? {} : { userId }),
                deletedAt: null
            },
            select: {
                amount: true,
                type: true,
                date: true
            }
        });

        const grouped: Record<string, { income: number; expense: number; }> = {};

        for (const record of records) {
            let key: string;

            if (period === "weekly") {
                const week = Math.ceil(record.date.getDate() / 7);
                key = `${record.date.getFullYear()}-W${week}`;
            } else {
                key = record.date.toISOString().slice(0, 7); // YYYY-MM
            }

            if (!grouped[key]) {
                grouped[key] = { income: 0, expense: 0 };
            }

            if (record.type === "INCOME") {
                grouped[key].income += Number(record.amount);
            } else {
                grouped[key].expense += Number(record.amount);
            }
        }

        const result = Object.entries(grouped).map(([key, value]) => ({
            period: key,
            income: value.income,
            expense: value.expense
        }));

        return res.status(200).json(result);

    } catch (error) {
        console.error("Error fetching trends:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc Get recent records (latest 5)
// @route GET /api/v1/dashboard/recent
// @access All authenticated users (data filtered by role)
export const recentRecords = async (req: AuthRequest, res: Response) => {
    try {
        const { id: userId, role } = req.user as { id: string; role: string; };

        const recentRecords = await prisma.record.findMany({
            where: {
                ...(role === "ADMIN" ? {} : { userId }),
                deletedAt: null
            },
            orderBy: {
                date: 'desc'
            },
            take: 5,
            select: {
                id: true,
                amount: true,
                type: true,
                category: true,
                date: true,
            }
        });

        return res.status(200).json(recentRecords);
    } catch (error) {
        console.error("Error fetching recent records:", error);
        return res.status(500).json({ message: "Internal server error." });
    };
};