/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { z } from "zod"
import { parse } from "cookie"
import { cookies } from "next/headers"

const loginValidationZodSchema = z.object({
    email: z.email({
        error: "Email is required"
    }),
    password: z.string().min(6, "Password is required and must be at least 6 characters").max(100, "Password must be at most 100 characters")
})
export const loginUser = async (_currentState: any, fromData: any) => {

    try {
        let accessTokenObj: null | any = null
        let refreshTokenObj: null | any = null

        const loginData = {
            email: fromData.get('email'),
            password: fromData.get('password')
        }

        const validatedFields = loginValidationZodSchema.safeParse(loginData);

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.issues.map(issue => {
                    return {
                        field: issue.path[0],
                        message: issue.message
                    }
                })
            }
        }

        const res = await fetch("http://localhost:5000/api/v1/auth/login", {
            method: "POST",
            body: JSON.stringify(loginData),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const result = await res.json()

        const setCookieHeaders = res.headers.getSetCookie()

        if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookie) => {
                const parsedCookie = parse(cookie)

                if (parsedCookie.accessToken) {
                    accessTokenObj = parsedCookie
                }

                if (parsedCookie.refreshToken) {
                    refreshTokenObj = parsedCookie
                }
            })
        } else {
            throw new Error("No Set-cookie header found")
        }

        if (!accessTokenObj) {
            throw new Error("Tokens not found in cookies")
        }
        if (!refreshTokenObj) {
            throw new Error("Tokens not found in cookies")
        }

        const cookieStore = await cookies()

        cookieStore.set("accessToken", accessTokenObj.accessToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(accessTokenObj["Max-Age"]),
            path: accessTokenObj.Path || "/",
            sameSite: accessTokenObj.SameSite
        })
        cookieStore.set("refreshToken", refreshTokenObj.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(refreshTokenObj["Max-Age"]),
            path: refreshTokenObj.Path || "/",
            sameSite: refreshTokenObj.SameSite || "none"
        })

        return result

    } catch (error) {
        console.log(error);
        return { error: "Login failed" }
    }
}