
export const getInputFieldError = (
    fieldName: string,
    state: { errors?: { field: string; message: string }[] } | null
) => {
    if (!state?.errors) return null;

    const error = state.errors.find((err) => err.field === fieldName);
    return error ? error.message : null;
};
