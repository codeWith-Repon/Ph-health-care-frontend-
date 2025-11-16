/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { loginUser } from "./loginUser";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { registerPatientValidationZodSchema } from "@/zod/auth.validation";

export const registerPatient = async (_currentState: any, formData: any): Promise<any> => {
    try {

        const payload = {
            name: formData.get('name'),
            address: formData.get('address'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        }

        // const validatedFields = registerValidationZodSchema.safeParse(validationData);

        // if (!validatedFields.success) {
        //     return {
        //         success: false,
        //         errors: validatedFields.error.issues.map(issue => {
        //             return {
        //                 field: issue.path[0],
        //                 message: issue.message
        //             }
        //         })
        //     }
        // }


        const validateResult = zodValidator(payload, registerPatientValidationZodSchema)

        if (!validateResult.success) {
            return validateResult
        }

        const validatedPayload: any = validateResult.data

        const registerData = {
            password: validatedPayload.password,
            patient: {
                name: validatedPayload.name,
                email: validatedPayload.email,
                address: validatedPayload.address
            }
        }

        const newFromData = new FormData()

        newFromData.append("data", JSON.stringify(registerData))

        if (formData.get("file")) {
            newFromData.append("file", formData.get("file") as Blob)
        }

        const res = await serverFetch.post("/user/create-patient", {
            body: newFromData
        })

        const result = await res.json()

        if (result.success) {
            await loginUser(_currentState, formData)
        }

        return result
    } catch (error: any) {
        console.log(error);
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error
        }
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Registration failed. Please try again later.",
        }
    }
}