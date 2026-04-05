import { Router } from "express";
import { getSummary, getCategoryTotals, getTrends, recentRecords } from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/summary", authMiddleware, getSummary);
router.get("/category-totals", authMiddleware, getCategoryTotals);
router.get("/trends", authMiddleware, getTrends);
router.get("/recent", authMiddleware, recentRecords);

export default router;