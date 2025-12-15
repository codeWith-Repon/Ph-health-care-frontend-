/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export async function getAppointments(queryString?: string) {
    try {
        const searchParams = new URLSearchParams(queryString)
        const page = searchParams.get('page') || '1'
        const searchTerm = searchParams.get('searchTerm') || 'all'
        const response = await serverFetch.get(`/appointment${queryString ? `?${queryString}` : ""}`, {
            next: {
                tags: [
                    "admins-list",
                    `admins-page-${page}`,
                    `admins-search-${searchTerm}`
                ],
                revalidate: 180
            }
        })
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

export async function getAppointmentById(id: string) {
    try {
        const response = await serverFetch.get(`/appointment/${id}`)
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


export async function changeAppointmentStatus(id: string, status: string) {
    try {
        const response = await serverFetch.patch(`/appointment/status/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        const result = await response.json();

        if (result.success) {
            revalidateTag('appointments-list', { expire: 0 });
            revalidateTag(`appointment-${id}`, { expire: 0 });
            revalidateTag('my-appointments', { expire: 0 });
            // Update dashboard meta for all roles (appointment status affects stats)
            revalidateTag('admin-dashboard-meta', { expire: 0 });
            revalidateTag('doctor-dashboard-meta', { expire: 0 });
            revalidateTag('patient-dashboard-meta', { expire: 0 });
            revalidateTag('dashboard-meta', { expire: 0 });
        }
        return result;
    } catch (error: any) {
        console.error("Change appointment status error:", error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to change status'
        };
    }
}