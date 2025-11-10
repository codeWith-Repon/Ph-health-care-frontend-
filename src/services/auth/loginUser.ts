/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { z } from "zod"
import { parse } from "cookie"
import { JwtPayload } from "jsonwebtoken"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/auth-utils"
import { setCookie } from "./tokenHandlers"

const loginValidationZodSchema = z.object({
    email: z.email({
        error: "Email is required"
    }),
    password: z.string().min(6, "Password is required and must be at least 6 characters").max(100, "Password must be at most 100 characters")
})
export const loginUser = async (_currentState: any, fromData: any) => {

    try {
        const redirectTo = fromData.get("redirect") || null
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

        if (!result.success) {
            throw new Error(result.message || "Invalid email or password");
        }

        const setCookieHeaders = res.headers.getSetCookie();

        if (!setCookieHeaders) {
            throw new Error("No Set-Cookie header found in response");
        }

        for (const cookie of setCookieHeaders) {
            const parsed = parse(cookie);
            if (parsed.accessToken) accessTokenObj = parsed;
            if (parsed.refreshToken) refreshTokenObj = parsed;
        }

        if (!accessTokenObj || !refreshTokenObj) {
            throw new Error("Missing authentication tokens in cookies");
        }


        await setCookie("accessToken", accessTokenObj.accessToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(accessTokenObj["Max-Age"]),
            path: accessTokenObj.Path || "/",
            sameSite: accessTokenObj.SameSite
        })
        await setCookie("refreshToken", refreshTokenObj.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: parseInt(refreshTokenObj["Max-Age"]),
            path: refreshTokenObj.Path || "/",
            sameSite: refreshTokenObj.SameSite || "none"
        })

        const verifiedToken: string | JwtPayload = jwt.verify(accessTokenObj.accessToken, process.env.JWT_ACCESS_TOKEN_SECRET as string)

        if (!verifiedToken || typeof verifiedToken === "string") {
            throw new Error("Invalid or malformed token");
        }

        const userRole: UserRole = verifiedToken.role

        if (redirectTo) {
            const requestedPath = redirectTo.toString();
            if (isValidRedirectForRole(requestedPath, userRole)) {
                redirect(`${requestedPath}?loggedIn=true`)
            } else {
                redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`)
            }
        } else {
            redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`)
        }

    } catch (error: any) {
        // Re-throw Next_redirect errors so next.js can handle then 
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error
        }
        console.log(error);
        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Login failed. You might have entered incorrect email or password.",
        }
    }
}