
export type AuthFormValues = {
    email: string;
    password: string;
};

export type SetSubmitting = (values: AuthFormValues, actions: { setSubmitting: (isSubmitting: boolean) => void }) => void;