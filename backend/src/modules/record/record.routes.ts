import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { createRecord, deleteRecord, editRecord, getRecords, restoreRecord, } from "./record.controller";
import { createRecordSchema, editRecordSchema } from "./record.schema";
import { roleMiddleware } from "../../middleware/role.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware([Role.ADMIN, Role.ANALYST]),
    validate(createRecordSchema),
    createRecord
);
router.get(
    "/",
    authMiddleware,
    getRecords
);
router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware([Role.ADMIN, Role.ANALYST]),
    validate(editRecordSchema),
    editRecord
);
router.patch(
    "/:id/restore",
    authMiddleware,
    roleMiddleware([Role.ADMIN, Role.ANALYST]),
    restoreRecord
);
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware([Role.ADMIN, Role.ANALYST]),
    deleteRecord);

export default router;