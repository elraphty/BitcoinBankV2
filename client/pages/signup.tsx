import type { NextPage } from 'next';
import Head from 'next/head';
import { useMemo, useCallback, useState, useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from "yup";
import Link from 'next/link';
import axios from 'axios';
import { BASE_URL } from '../helpers/axios';
import { setToStorage } from '../helpers/localstorage';
import { useRouter } from 'next/router';
import { SetSubmitting , AuthFormValues} from '../types';

const validationSchema = Yup.object().shape({
    username: Yup.string().required('This field is required!').min(3, 'Username must be up to four(4) letters'),
    password: Yup.string().required('This field is required!').min(6, 'Password must be up to six(6) characters')
});

const Signup: NextPage = () => {
    const router = useRouter();
    const [signupError, setSignupError] = useState('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const inputClassName = useMemo(
        () =>
            "px-5 h-9 2xl:h-10 w-full flex items-center text-xs font-normal text-brand-text border border-solid border-[#F1F1F1] rounded-lg 2xl:text-sm",
        [],
    );

    const initialValues = useMemo(
        (): AuthFormValues => ({
            username: username || '',
            password: password || '',
        }),
        [username, password],
    );

    const formSubmit: SetSubmitting<AuthFormValues> = useCallback((values: AuthFormValues, { setSubmitting }) => {
        const body: AuthFormValues = {
            username: values.username,
            password: values.password
        };

        setUsername(values.username);
        setPassword(values.password);

        axios.post(`${BASE_URL}user/register`, body)
            .then(async res => {
                router.push('/login');
            })
            .catch(err => {
                setSignupError('Could not create account');
            });

        setSubmitting(false);
    }, []);

    return (
        <div className="container">
            <Head>
                <title>Bitcoin wallet signup</title>
                <meta name="description" content="Bitcoinwallet Signup" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="main">
                <div className="wrap">
                    <h2 className="form_heading">User Signup</h2>
                </div>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={formSubmit}>{({ values, errors, isSubmitting, handleChange }) => (
                    <Form>
                        {signupError ? <p className="formErrors">{signupError}</p> : null}
                        <div className="wrap">
                            <section className="inputgroup">
                                <label htmlFor="Username" className="form__label">
                                    Username
                                </label>
                                <div className="flex items-center w-full">
                                    <input
                                        id="username"
                                        className={inputClassName}
                                        type="text"
                                        value={values.username}
                                        placeholder="Your username"
                                        autoComplete="off"
                                        onChange={handleChange}
                                    />
                                </div>
                            </section>
                            {errors.username ? <p className="formErrors">{errors.username}</p> : null}
                        </div>
                        <div className="wrap">
                            <section className="inputgroup">
                                <label htmlFor="Password" className="form__label">
                                    Password
                                </label>
                                <div className="flex items-center w-full">
                                    <input
                                        id="password"
                                        className={inputClassName}
                                        type="password"
                                        autoComplete="off"
                                        value={values.password}
                                        onChange={handleChange}
                                        placeholder="Your password"
                                    />
                                </div>
                            </section>
                            {errors.password ? <p className="formErrors">{errors.password}</p> : null}
                        </div>
                        <section className="wrap">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="font-bold mt-4 bg-green-400 text-black rounded-lg p-2 w-full">
                                Create account
                            </button>
                        </section>
                        <p className="form_btm_link"> <Link href="/">{"Already have an account? Login"}</Link></p>
                    </Form>
                )}</Formik>
            </main>
        </div>
    )
}

export default Signup;