/* eslint-disable @typescript-eslint/no-explicit-any */

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { IDoctor } from "@/types/doctor.interface";
import { createDoctorZodSchema, updateDoctorZodSchema } from "@/zod/doctors.validation";


export async function createDoctor(_prevState: any, formData: FormData) {
    try {

        //Parse specialties array 
        const specialtiesString = formData.get("specialties") as string
        let specialties: string[] = []
        if (specialtiesString) {
            try {
                specialties = JSON.parse(specialtiesString)
            } catch {
                specialties = []
            }
        }

        const payload: IDoctor = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            contactNumber: formData.get("contactNumber") as string,
            address: formData.get("address") as string,
            registrationNumber: formData.get("registrationNumber") as string,
            experience: Number(formData.get("experience") as string),
            gender: formData.get("gender") as "MALE" | "FEMALE",
            appointmentFee: Number(formData.get("appointmentFee") as string),
            qualification: formData.get("qualification") as string,
            currentWorkingPlace: formData.get("currentWorkingPlace") as string,
            designation: formData.get("designation") as string,
            password: formData.get("password") as string,
            specialties: specialties,
            profilePhoto: formData.get("file") as File,
        }

        const validatePayload = zodValidator(payload, createDoctorZodSchema)

        if (!validatePayload.success && validatePayload.errors) {
            return {
                success: validatePayload.success,
                message: "Validation failed",
                errors: validatePayload.errors
            }
        }

        if (!validatePayload.data) {
            return {
                success: false,
                message: "Validation failed",
                formData: validatePayload
            }
        }

        const validatePayloadData = validatePayload.data

        const newPayload = {
            password: validatePayloadData.password,
            doctor: {
                name: validatePayloadData.name,
                email: validatePayloadData.email,
                contactNumber: validatePayloadData.contactNumber,
                address: validatePayloadData.address,
                registrationNumber: validatePayloadData.registrationNumber,
                experience: validatePayloadData.experience,
                gender: validatePayloadData.gender,
                appointmentFee: validatePayloadData.appointmentFee,
                qualification: validatePayloadData.qualification,
                currentWorkingPlace: validatePayloadData.currentWorkingPlace,
                designation: validatePayloadData.designation,
                specialties: validatePayloadData.specialties
            }
        }

        const newFormData = new FormData()
        newFormData.append("data", JSON.stringify(newPayload))
        newFormData.append("file", formData.get("file") as Blob)

        try {
            const response = await serverFetch.post("/user/create-doctor", { body: newFormData })

            const result = await response.json()

            return result
        } catch (error: any) {
            console.log(error);
            return {
                success: false,
                message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`,
                formData: validatePayload
            }
        }
    } catch (error: any) {
        console.log(error);
        return { success: false, message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}` }
    }
}

export async function getDoctors(queryString?: string) {
    try {
        const response = await serverFetch.get(`/doctor${queryString ? `?${queryString}` : ""}`)
        const result = await response.json();

        return result
    } catch (error: any) {
        console.log(error);
        return { success: false, message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}` }
    }
}

export async function getDoctorById(id: string) {
    try {
        const response = await serverFetch.get(`/doctor/${id}`)
        const result = await response.json();

        return result
    } catch (error: any) {
        console.log(error);
        return { success: false, message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}` }
    }
}

export async function updateDoctor(id: string, _prevState: any, formData: FormData) {
    try {
        const experienceValue = formData.get("experience");
        const appointmentFeeValue = formData.get("appointmentFee");

        const payload: Partial<IDoctor> = {
            name: formData.get("name") as string,
            contactNumber: formData.get("contactNumber") as string,
            address: formData.get("address") as string,
            registrationNumber: formData.get("registrationNumber") as string,
            experience: experienceValue ? Number(experienceValue) : 0,
            gender: formData.get("gender") as "MALE" | "FEMALE",
            appointmentFee: appointmentFeeValue ? Number(appointmentFeeValue) : 0,
            qualification: formData.get("qualification") as string,
            currentWorkingPlace: formData.get("currentWorkingPlace") as string,
            designation: formData.get("designation") as string,
        }

        // Parse specialties array (for adding new specialties)
        const specialtiesValue = formData.get("specialties") as string
        if (specialtiesValue) {
            try {
                const parsed = JSON.parse(specialtiesValue)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    payload.specialties = parsed
                }
            } catch {
            }
        }
        const removeSpecialtiesValue = formData.get("removeSpecialties") as string
        if (removeSpecialtiesValue) {
            try {
                const parsed = JSON.parse(removeSpecialtiesValue)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    payload.removeSpecialties = parsed
                }
            } catch {
            }
        }

        const validatedPayload = zodValidator(payload, updateDoctorZodSchema);

        if (!validatedPayload.success && validatedPayload.errors) {
            return {
                success: validatedPayload.success,
                message: "Validation failed",
                formData: validatedPayload,
                errors: validatedPayload.errors
            }
        }

        if (!validatedPayload.data) {
            return {
                success: false,
                message: "Validation failed",
                formData: validatedPayload
            }
        }

        try {
            const validatedPayloadData = validatedPayload.data

            const response = await serverFetch.patch(`/doctor/${id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(validatedPayloadData)
            })

            const result = await response.json()
            return result
        } catch (error: any) {
            return {
                success: false,
                message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`,
                formData: validatedPayload
            }
        }
    } catch (error: any) {
        console.log(error);
        return { success: false, message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}` }
    }
}

export async function deleteDoctor(id: string) {
    try {
        const response = await serverFetch.delete(`/doctor/soft/${id}`)
        const result = await response.json();
        return result
    } catch (error: any) {
        console.log(error);
        return { success: false, message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}` }
    }
}