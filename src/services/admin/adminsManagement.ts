/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/server-fetch"
import { zodValidator } from "@/lib/zodValidator"
import { createAdminZodSchema, updateAdminZodSchema } from "@/zod/admin.validation"

export async function createAdmin(_prevState: any, formData: FormData) {
    const validationPayload = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        contactNumber: formData.get("contactNumber") as string,
        password: formData.get("password") as string,
        profilePhoto: formData.get("file") as File
    }

    const validatedPayload = zodValidator(validationPayload, createAdminZodSchema)

    if (!validatedPayload.success && validatedPayload.errors) {
        return {
            success: false,
            message: "Validation failed",
            formData: validationPayload,
            errors: validatedPayload.errors
        }
    }

    if (!validatedPayload.data) {
        return {
            success: false,
            message: "Validation failed",
            formData: validationPayload,
        }
    }

    const backendPayload = {
        password: validatedPayload.data.password,
        admin: {
            name: validatedPayload.data.name,
            email: validatedPayload.data.email,
            contactNumber: validatedPayload.data.contactNumber,
            profilePhoto: validatedPayload.data.profilePhoto
        }
    }
    const newFormData = new FormData()
    newFormData.append('data', JSON.stringify(backendPayload))
    newFormData.append('file', formData.get("file") as Blob)

    try {
        const response = await serverFetch.post("/user/create-admin", { body: newFormData })
        const result = await response.json();
        return result
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`,
            formData: validationPayload
        }
    }
}

export async function getAdmins(queryString?: string) {
    try {
        const response = await serverFetch.get(`/admin${queryString ? `?${queryString}` : ""}`)
        const result = await response.json();

        return result
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        }
    }
}

export async function getAdminById(id: string) {
    try {
        const response = await serverFetch.get(`/admin/${id}`)
        const result = await response.json();

        return result
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        }
    }
}

export async function updateAdmin(id: string, _prevState: any, formData: FormData) {
    const validationPayload: any = {
        name: formData.get("name") as string,
        contactNumber: formData.get("contactNumber") as string,
    }

    const validatedPayload = zodValidator(validationPayload, updateAdminZodSchema)

    if (!validatedPayload.success && validatedPayload.errors) {
        return {
            success: false,
            message: 'Validation failed',
            formData: validationPayload,
            errors: validatedPayload.errors
        }
    }

    if (!validatedPayload.data) {
        return {
            success: false,
            message: 'Validation failed',
            formData: validationPayload,
        }
    }

    try {
        const response = await serverFetch.patch(`/admin/${id}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(validatedPayload.data)
        })

        const result = await response.json();
        return result
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`,
            formData: validationPayload
        }
    }
}

export async function softDeleteAdmin(id: string) {
    try {
        const response = await serverFetch.delete(`/admin/soft/${id}`)
        const result = await response.json();
        return result
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`,
        }
    }
}

export async function deleteAdmin(id: string) {
    try {
        const response = await serverFetch.delete(`/admin/${id}`)
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        };
    }
}