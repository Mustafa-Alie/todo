import * as z from "zod";

export const loginSchema = z.object({
  email: z.email("invalid email format").max(30),

  password: z.string().min(8, "Password must be at least 8 characters").max(25),
});

export type loginType = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.email("invalid email format").max(30),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(25, "Password can't exceed 25 characters"),

  firstName: z
    .string()
    .max(20, "First name can't exceed 20 characters")
    .optional(),

  lastName: z
    .string()
    .max(20, "Last name can't exceed 20 characters ")
    .optional(),
});
