import * as z from "zod";
import { Type } from "@prisma/client";

const typeSchema = z
    .string()
    .transform((val) => val.toUpperCase())
    .refine((val) => Object.values(Type).includes(val as Type), {
        message: "Invalid value for 'type'."
    });

const baseRecordSchema = z.object({
    amount: z.number().positive("Amount must be a positive number."),
    type: typeSchema,
    category: z.string().optional(),
    notes: z.string().optional(),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format."
    }),
});

export const createRecordSchema = baseRecordSchema;

export const editRecordSchema = baseRecordSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field must be provided for update"
    }
);;