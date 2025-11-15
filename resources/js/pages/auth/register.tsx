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
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <Head title="Register" />

            {/* Container */}
            <div className="w-full max-w-md space-y-8">

                {/* HEADER */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Register to <span className="text-green-600">Spendify</span>
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
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
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    placeholder="Full name"
                                    className="rounded-md border-gray-300 focus:ring-green-600"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* EMAIL */}
                            <div className="grid gap-1">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="rounded-md border-gray-300 focus:ring-green-600"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* PASSWORD */}
                            <div className="grid gap-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    placeholder="Password"
                                    className="rounded-md border-gray-300 focus:ring-green-600"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div className="grid gap-1">
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                    className="rounded-md border-gray-300 focus:ring-green-600"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* SUBMIT BUTTON */}
                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-all duration-200 disabled:opacity-70"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>

                            {/* LOGIN LINK */}
                            <div className="text-center text-sm text-gray-600">
                                Already have an account?{" "}
                                <TextLink
                                    href={login()}
                                    tabIndex={6}
                                    className="text-green-600 hover:text-green-700 font-medium"
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
