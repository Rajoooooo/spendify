import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 text-gray-900 dark:bg-gray-950 dark:text-gray-50">
            <Head title="Log in" />

            {/* Container */}
            <div className="w-full max-w-md space-y-8 bg-white/90 rounded-xl p-8 shadow-sm border border-gray-200 dark:bg-gray-900/90 dark:border-gray-800">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                        Welcome to{' '}
                        <span className="text-green-600 dark:text-green-400">
                            Spendify
                        </span>
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        A smart and simple budget tracker to manage your finances.
                    </p>
                </div>

                {/* Form */}
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Email */}
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
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="rounded-md border-gray-300 bg-white text-gray-900 focus:ring-green-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:focus:ring-green-400"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-1">
                                <div className="flex items-center">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-800 dark:text-gray-200"
                                    >
                                        Password
                                    </Label>

                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>

                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="rounded-md border-gray-300 bg-white text-gray-900 focus:ring-green-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:focus:ring-green-400"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm text-gray-800 dark:text-gray-200"
                                >
                                    Remember me
                                </Label>
                            </div>

                            {/* Login button */}
                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-all duration-200 disabled:opacity-70 dark:bg-green-500 dark:hover:bg-green-400"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>

                            {/* Register */}
                            {canRegister && (
                                <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                                    Don’t have an account?{' '}
                                    <TextLink
                                        href={register()}
                                        className="font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                        tabIndex={5}
                                    >
                                        Sign up
                                    </TextLink>
                                </div>
                            )}
                        </>
                    )}
                </Form>

                {/* Status message */}
                {status && (
                    <div className="text-center text-sm font-medium text-green-600 dark:text-green-400">
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}
