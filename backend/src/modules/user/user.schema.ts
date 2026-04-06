import { Role } from "@prisma/client";
import * as z from "zod";

const roleSchema = z
    .string()
    .toUpperCase()
    .refine((val) => Object.values(Role).includes(val as Role), {
        message: "Role must be either 'VIEWER', 'ANALYST' or 'ADMIN'."
    });

export const baseUserSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    role: roleSchema.optional(),
    status: z.boolean().optional()
});

export const createUserSchema = baseUserSchema;

export const editUserSchema = baseUserSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field must be provided for update"
        }
    );