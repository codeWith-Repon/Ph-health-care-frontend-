/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import jwt, { JwtPayload } from "jsonwebtoken"

export const verifyAccessToken = async (token: string) => {
    try {
        const verifiedAccessToken = jwt.verify(
            token,
            process.env.JWT_ACCESS_TOKEN_SECRET as string
        ) as JwtPayload

        return {
            success: true,
            message: "Access token verified",
            payload: verifiedAccessToken
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Invalid access token",
        }
    }
}