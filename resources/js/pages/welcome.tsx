import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    CreditCard,
    PieChart,
    CalendarDays,
    BarChart3,
    ShieldCheck,
    Sparkles,
    Users,
    Code2,
} from "lucide-react";

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

                {/* Main */}
                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="border-b border-gray-100 dark:border-gray-800">
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
                                    Spendify is your personal expense command
                                    center. Create expenses in seconds, assign
                                    them to categories, and plan budgets for
                                    trips, events, and everyday life — all in a
                                    simple, modern dashboard.
                                </p>

                                <div className="flex flex-wrap gap-4 mt-6">
                                    <Link href="/register">
                                        <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg dark:bg-green-500 dark:hover:bg-green-400">
                                            Get Started
                                            <ArrowRight className="ml-2 h-4 w-4" />
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

                                {/* Quick stats / selling points */}
                                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm">
                                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900/60">
                                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Visibility
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            All expenses in one place
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900/60">
                                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Control
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            Category-based tracking
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900/60">
                                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Planning
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            Budget events & goals
                                        </p>
                                    </div>
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
                    </section>

                    {/* Feature Grid */}
                    <section className="border-b border-gray-100 bg-gray-50/70 py-14 dark:border-gray-800 dark:bg-gray-950">
                        <div className="max-w-6xl mx-auto px-6 space-y-8">
                            <div className="max-w-2xl">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50">
                                    Built for everyday expenses and big events.
                                </h2>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    Whether you&apos;re budgeting a trip, a
                                    school event, or your monthly spending,
                                    Spendify gives you a structured way to
                                    capture every peso.
                                </p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                                {/* Track expenses */}
                                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/50">
                                            <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="font-semibold">
                                            Quick expense capture
                                        </h3>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                                        Add expenses in just a few clicks with
                                        date, description, and amount — no
                                        clutter, no spreadsheets.
                                    </p>
                                </div>

                                {/* Categories */}
                                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/50">
                                            <PieChart className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="font-semibold">
                                            Category-based insights
                                        </h3>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                                        Tag expenses to custom categories like
                                        food, transport, or events to see where
                                        your money actually goes.
                                    </p>
                                </div>

                                {/* Budgets / events */}
                                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/50">
                                            <CalendarDays className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="font-semibold">
                                            Budget events & goals
                                        </h3>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                                        Create budgets for specific events or
                                        timeframes and track remaining balance
                                        in real time.
                                    </p>
                                </div>

                                {/* Analytics */}
                                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/50">
                                            <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="font-semibold">
                                            Clear financial picture
                                        </h3>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                                        See totals, averages, and trends so you
                                        can make decisions with confidence — not
                                        guesses.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How it works */}
                    <section className="py-14 border-b border-gray-100 dark:border-gray-800">
                        <div className="max-w-6xl mx-auto px-6 space-y-8">
                            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50">
                                        Simple workflow, powerful results.
                                    </h2>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        Spendify is designed to feel familiar,
                                        so you can focus on your spending, not
                                        the software.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    Data stays in your own Spendify account.
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/70">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
                                        Step 1
                                    </p>
                                    <h3 className="mt-2 font-semibold">
                                        Create your budget
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        Set a total amount for a month, event,
                                        or project. Spendify keeps track of the
                                        remaining balance for you.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/70">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
                                        Step 2
                                    </p>
                                    <h3 className="mt-2 font-semibold">
                                        Log expenses & assign categories
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        Every time you spend, record it and pick
                                        a category. Over time you&apos;ll see
                                        patterns you can actually act on.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/70">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
                                        Step 3
                                    </p>
                                    <h3 className="mt-2 font-semibold">
                                        Review, adjust, and improve
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        Use balances and summaries to refine
                                        your habits, cut unnecessary spending,
                                        and hit your savings goals.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tech & Developers */}
                    <section className="py-14 bg-gray-50/70 dark:bg-gray-950">
                        <div className="max-w-6xl mx-auto px-6 space-y-10">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="space-y-2">
                                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
                                        <Sparkles className="h-4 w-4" />
                                        Built by developers who love clean
                                        financial tools
                                    </p>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50">
                                        Modern stack. Developer-crafted
                                        experience.
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Spendify is engineered with a
                                        production-ready stack to keep things
                                        fast, responsive, and secure.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3 text-sm">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 dark:border-gray-700 dark:bg-gray-900/70">
                                        <Code2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        Laravel 12
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 dark:border-gray-700 dark:bg-gray-900/70">
                                        <Code2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        React + Inertia.js
                                    </span>
                                </div>
                            </div>

                            {/* Developers row */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 flex items-center gap-4 dark:border-gray-800 dark:bg-gray-900/70">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white text-lg font-semibold dark:bg-green-500">
                                        RJ
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            Rafael John Castro
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Full-stack developer • System
                                            design, budgeting workflows
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-6 flex items-center gap-4 dark:border-gray-800 dark:bg-gray-900/70">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white text-lg font-semibold dark:bg-green-500">
                                        JV
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            Jansen Earl G. Venal
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Full-stack developer • Deployment, QA, and UI/UX
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <div className="inline-flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Designed for individuals, students, and
                                    small teams who need clarity around their
                                    spending.
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t py-6 bg-white/90 dark:bg-gray-950/90 dark:border-gray-800">
                    <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm dark:text-gray-400">
                        © {new Date().getFullYear()} Spendify — Rafael John
                        Castro &amp; Jansen Earl G. Venal
                    </div>
                </footer>
            </div>
        </>
    );
}
