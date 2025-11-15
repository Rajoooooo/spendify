import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 text-gray-900 dark:bg-gray-950 dark:text-gray-50">
            <Head title="Register" />

            {/* Container */}
            <div className="w-full max-w-md space-y-8 bg-white/90 rounded-xl p-8 shadow-sm border border-gray-200 dark:bg-gray-900/90 dark:border-gray-800">
                {/* HEADER */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                        Register to{' '}
                        <span className="text-green-600 dark:text-green-400">
                            Spendify
                        </span>
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Create your account and start tracking your budget.
                    </p>
                </div>

                {/* FORM */}
                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* NAME */}
                            <div className="grid gap-1">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium text-gray-800 dark:text-gray-200"
                                >
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    placeholder="Full name"
                                    className="rounded-md border-gray-300 bg-white text-gray-900 focus:ring-green-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:focus:ring-green-400"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* EMAIL */}
                            <div className="grid gap-1">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-800 dark:text-gray-200"
                                >
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="rounded-md border-gray-300 bg-white text-gray-900 focus:ring-green-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:focus:ring-green-400"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* PASSWORD */}
                            <div className="grid gap-1">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-gray-800 dark:text-gray-200"
                                >
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    placeholder="Password"
                                    className="rounded-md border-gray-300 bg-white text-gray-900 focus:ring-green-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:focus:ring-green-400"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div className="grid gap-1">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-medium text-gray-800 dark:text-gray-200"
                                >
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                    className="rounded-md border-gray-300 bg-white text-gray-900 focus:ring-green-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:focus:ring-green-400"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* SUBMIT BUTTON */}
                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-all duration-200 disabled:opacity-70 dark:bg-green-500 dark:hover:bg-green-400"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>

                            {/* LOGIN LINK */}
                            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                                Already have an account?{' '}
                                <TextLink
                                    href={login()}
                                    tabIndex={6}
                                    className="font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                >
                                    Log in
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}
