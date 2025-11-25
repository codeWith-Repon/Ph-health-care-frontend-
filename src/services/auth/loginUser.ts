/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { parse } from "cookie"
import { JwtPayload } from "jsonwebtoken"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/auth-utils"
import { setCookie } from "./tokenHandlers"
import { serverFetch } from "@/lib/server-fetch"
import { zodValidator } from "@/lib/zodValidator"
import { loginValidationZodSchema } from "@/zod/auth.validation"

export const loginUser = async (_currentState: any, fromData: any) => {

    try {
        const redirectTo = fromData.get("redirect") || null
        let accessTokenObj: null | any = null
        let refreshTokenObj: null | any = null

        const payload = {
            email: fromData.get('email'),
            password: fromData.get('password')
        }

        // const validatedFields = loginValidationZodSchema.safeParse(loginData);

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


        const validateResult = zodValidator(payload, loginValidationZodSchema)

        if (!validateResult.success) {
            return {
                success: false,
                errors: validateResult.errors
            }
        }

        const validatedPayload = validateResult.data

        const res = await serverFetch.post("/auth/login", {
            body: JSON.stringify(validatedPayload),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const result = await res.json()

        if (!result.success) {
            throw new Error(result.message || "Invalid email or password");
        }

        const setCookieHeaders = res.headers.getSetCookie();

        if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookie: string) => {
                const parsedCookie = parse(cookie);

                if (parsedCookie['accessToken']) {
                    accessTokenObj = parsedCookie;
                }
                if (parsedCookie['refreshToken']) {
                    refreshTokenObj = parsedCookie;
                }
            })
        } else {
            throw new Error("No Set-Cookie header found");
        }

        if (!accessTokenObj) {
            throw new Error("Tokens not found in cookies");
        }

        if (!refreshTokenObj) {
            throw new Error("Tokens not found in cookies");
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

        if (redirectTo && result.data.needPasswordChange) {
            const requestedPath = redirectTo.toString();
            if (isValidRedirectForRole(requestedPath, userRole)) {
                redirect(`/reset-password?redirect=${requestedPath}`);
            } else {
                redirect("/reset-password");
            }
        }

        if (result.data.needPasswordChange) {
            redirect("/reset-password");
        }

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