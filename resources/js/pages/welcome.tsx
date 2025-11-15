import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function Welcome({ canRegister }: { canRegister: boolean }) {
    return (
        <>
            <Head title="Spendify" />

            <div className="min-h-screen bg-white text-gray-900 flex flex-col dark:bg-gray-950 dark:text-gray-50">

                {/* Navigation */}
                <header className="border-b bg-white/90 backdrop-blur-sm dark:bg-gray-950/90 dark:border-gray-800">
                    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            Spendify
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/login">
                                <Button
                                    variant="ghost"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-950/40"
                                >
                                    Log in
                                </Button>
                            </Link>

                            {canRegister && (
                                <Link href="/register">
                                    <Button className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-400">
                                        Sign up
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="flex-1">
                    <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
                        {/* Left Side */}
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-gray-50">
                                Manage your{" "}
                                <span className="text-green-600 dark:text-green-400">
                                    budget
                                </span>
                                <br />
                                the smart way.
                            </h1>

                            <p className="text-gray-600 text-lg leading-relaxed dark:text-gray-300">
                                Spendify helps you track expenses, create budgets,
                                and stay in control of your finances — all in one
                                clean and simple dashboard.
                            </p>

                            <div className="flex flex-wrap gap-4 mt-6">
                                <Link href="/register">
                                    <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg dark:bg-green-500 dark:hover:bg-green-400">
                                        Get Started
                                    </Button>
                                </Link>

                                <Link href="/login">
                                    <Button
                                        variant="outline"
                                        className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-2 rounded-lg dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950/40"
                                    >
                                        Log in
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Side – Logo Shape */}
                        <div className="relative w-full h-72 md:h-full flex items-center justify-center">
                            <div className="w-72 h-72 md:w-96 md:h-96 rounded-3xl bg-green-100 shadow-lg flex items-center justify-center overflow-hidden dark:bg-green-900/30 dark:shadow-black/40">
                                <img
                                    src="/logo/_logo_no_bg.png"
                                    alt="Spendify Logo"
                                    className="w-48 md:w-64 object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t py-6 bg-white/90 dark:bg-gray-950/90 dark:border-gray-800">
                    <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm dark:text-gray-400">
                        © {new Date().getFullYear()} Spendify — Rafael John Castro & Jansen Earl Venal
                    </div>
                </footer>
            </div>
        </>
    );
}
