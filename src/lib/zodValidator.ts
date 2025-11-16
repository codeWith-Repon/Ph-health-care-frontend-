import { ZodObject } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const zodValidator = <T>(payload: T, schema: ZodObject<any>) => {
    const validatedPayload = schema.safeParse(payload);

    if (!validatedPayload.success) {
        return {
            success: false,
            errors: validatedPayload.error.issues.map((issue) => {
                return {
                    field: String(issue.path[0]),
                    message: issue.message,
                };
            }),
        };
    }

    return {
        success: true,
        data: validatedPayload.data,
    };
};
