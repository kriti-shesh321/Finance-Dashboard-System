import { Router } from "express";
import { createUser, deleteUser, editUser, getUsers } from "./user.controller";
import { roleMiddleware } from "../../middleware/role.middleware";
import { Role } from "@prisma/client";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createUserSchema, editUserSchema } from "./user.schema";

const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware([Role.ADMIN]),
    getUsers
);
router.post(
    "/",
    authMiddleware,
    roleMiddleware([Role.ADMIN]),
    validate(createUserSchema),
    createUser
);
router.patch(
    "/:id",
    authMiddleware,
    validate(editUserSchema),
    editUser
);
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware([Role.ADMIN]),
    deleteUser
);

export default router;