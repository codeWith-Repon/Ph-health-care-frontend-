import z from "zod";

export const createAdminZodSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email("Valid email is required"),
    contactNumber: z.string().min(10, "Contact number must be at least 10 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    profilePhoto: z.instanceof(File).refine((file) => file.size > 0, "Profile photo is required"),
})

export const updateAdminZodSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    contactNumber: z.string().min(10, "Contact number must be at least 10 characters long"),
})