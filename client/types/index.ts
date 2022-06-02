
export type AuthFormValues = {
    username: string;
    password: string;
};

export type SetSubmitting<T> = (values: T, actions: { setSubmitting: (isSubmitting: boolean) => void }) => void;