/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { updatePatientZodSchema } from "@/zod/patient.validation";



export async function getPatients(queryString?: string) {
    try {
        const response = await serverFetch.get(`/patient${queryString ? `?${queryString}` : ''}`);
        const result = await response.json();

        return result;
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Unable to fetch patients at the moment'}`
        }
    }
}

export async function getPatientById(patientId: string) {
    try {
        const response = await serverFetch.get(`/patient/${patientId}`);
        const result = await response.json();

        return result;
    } catch (err: any) {
        console.log(err)
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? err.message : 'Unable to fetch patient at the moment'}`
        }
    }
}

export async function updatePatient(id: string, _prevState: any, formData: FormData) {

    const validationPayload: any = {
        name: formData.get('name'),
        contactNumber: formData.get('contactNumber'),
        address: formData.get('address'),
    }

    const validation = zodValidator(validationPayload, updatePatientZodSchema)
    if (!validation.success && validation.errors) {
        return {
            success: false,
            message: 'Validation Error',
            formData: validationPayload,
            errors: validation.errors
        }
    }

    if (!validation.data) {
        return {
            success: false,
            message: "Validation failed",
            formData: validationPayload,
            errors: [{ field: "unknown", message: "Invalid data" }],
        };
    }

    try {
        const response = await serverFetch.patch(`/patient/${id}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(validation.data)
        })
        const result = await response.json();
        return result;
    } catch (err: any) {
        console.error("Update patient error:", err);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? err.message : 'Unable to update patient at the moment'}`,
            formData: validationPayload
        }
    }
}

export async function softDeletePatient(id: string) {
    try {
        const response = await serverFetch.delete(`/patient/soft/${id}`)
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

export async function deletePatient(id: string) {
    try {
        const response = await serverFetch.delete(`/patient/${id}`)
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