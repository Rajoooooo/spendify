import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

interface LineItem {
    id?: number;
    Item_title: string;
    amount: number | string;
}

interface Budget {
    id: number;
    title: string;
    budget_title?: string;
    amount: number;
    balance: number;
    lineItems: LineItem[];
}

// This is what we send back to the parent on save
export type EditBudgetPayload = {
    id: number;
    title: string;
    amount: number;
    balance: number;
    lineItems: {
        Item_title: string;
        amount: number;
    }[];
};

interface Props {
    open: boolean;
    onClose: () => void;
    data: Budget | null;
    onSave: (updated: EditBudgetPayload) => void;
}

// FUNCTION TO REMOVE .00 OR TRAILING ZEROS
const cleanAmount = (value: string | number): string => {
    let str = String(value);

    if (isNaN(Number(str))) return str;

    if (str.includes(".")) {
        str = str.replace(/\.0+$/, "");
        str = str.replace(/(\.\d*[1-9])0+$/, "$1");
    }

    return str;
};

export default function EditBudgetModal({ open, onClose, data, onSave }: Props) {
    const [form, setForm] = useState({
        title: "",
        amount: "" as number | string,
        lineItems: [] as LineItem[],
        balance: 0,
    });

    // Load selected budget
    useEffect(() => {
        if (!data) return;

        const used = (data.lineItems ?? []).reduce(
            (sum, item) => sum + Number(item.amount),
            0
        );

        const initialTitle = data.budget_title || data.title || "";

        setForm({
            title: initialTitle,
            amount: cleanAmount(data.amount),
            lineItems: (data.lineItems ?? []).map((i) => ({
                Item_title: i.Item_title,
                amount: cleanAmount(i.amount),
            })),
            balance: data.amount - used,
        });
    }, [data]);

    if (!open || !data) return null;

    const recalcBalance = (items: LineItem[], amount: number | string) => {
        const used = items.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );
        return (Number(amount) || 0) - used;
    };

    // UNIVERSAL UPDATE (title, amount)
    const update = (field: "title" | "amount", value: any) => {
        const cleaned = field === "amount" ? cleanAmount(value) : value;

        setForm((prev) => ({
            ...prev,
            [field]: cleaned,
            balance: recalcBalance(
                prev.lineItems,
                field === "amount" ? cleaned : prev.amount
            ),
        }));
    };

    // UPDATE ONE LINE ITEM
    const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
        const cleaned = field === "amount" ? cleanAmount(value) : value;

        const updated = [...form.lineItems];
        updated[index] = { ...updated[index], [field]: cleaned };

        setForm({
            ...form,
            lineItems: updated,
            balance: recalcBalance(updated, form.amount),
        });
    };

    const addNewLineItem = () => {
        const updated = [...form.lineItems, { Item_title: "", amount: "" }];

        setForm({
            ...form,
            lineItems: updated,
            balance: recalcBalance(updated, form.amount),
        });
    };

    const removeLineItem = (index: number) => {
        const updated = form.lineItems.filter((_, i) => i !== index);

        setForm({
            ...form,
            lineItems: updated,
            balance: recalcBalance(updated, form.amount),
        });
    };

    // FINAL SUBMIT – shape must match EditBudgetPayload
    const handleSubmit = () => {
        const payload: EditBudgetPayload = {
            id: data.id,
            title: form.title,
            amount: Number(form.amount),
            balance: form.balance,
            lineItems: form.lineItems.map((i) => ({
                Item_title: i.Item_title,
                amount: Number(i.amount),
            })),
        };

        onSave(payload);
        onClose();
    };

    const displayTitle = data.budget_title || data.title;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-2xl border border-gray-300 bg-white p-6 shadow-2xl sm:p-8 lg:p-10 dark:border-gray-800 dark:bg-gray-950">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-50">
                    Edit Budget –{" "}
                    <span className="font-semibold">
                        {displayTitle}
                    </span>
                </h2>

                {/* TITLE + AMOUNT */}
                <div className="mb-7 flex flex-col gap-4 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                        <label className="font-semibold text-gray-900 dark:text-gray-100">
                            Budget Title
                        </label>
                        <input
                            type="text"
                            placeholder={displayTitle}
                            value={form.title}
                            onChange={(e) => update("title", e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-gray-200"
                        />
                    </div>

                    {/* TOTAL BUDGET AMOUNT */}
                    <div className="w-full sm:w-1/2">
                        <label className="font-semibold text-gray-900 dark:text-gray-100">
                            Total Budget Amount
                        </label>
                        <input
                            type="number"
                            placeholder={String(data.amount)}
                            value={form.amount}
                            onChange={(e) => update("amount", e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-gray-200"
                        />
                    </div>
                </div>

                {/* BALANCE */}
                <div className="mb-6 rounded-xl border border-gray-300 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Remaining Balance
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                        ₱{form.balance.toLocaleString()}
                    </p>
                </div>

                {/* LINE ITEMS */}
                <div className="mb-5 rounded-2xl border border-gray-300 bg-gray-50 p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-900">
                    <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                            Line Items
                        </p>

                        <button
                            onClick={addNewLineItem}
                            className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                        >
                            + Add Item
                        </button>
                    </div>

                    <div className="max-h-[350px] space-y-4 overflow-y-auto pr-1 sm:pr-2">
                        {form.lineItems.map((item, index) => (
                            <div
                                key={index}
                                className="relative rounded-xl border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950"
                            >
                                <button
                                    onClick={() => removeLineItem(index)}
                                    className="absolute right-3 top-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <div className="w-full sm:w-2/3">
                                        <label className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                            Item Title
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={item.Item_title}
                                            value={item.Item_title}
                                            onChange={(e) =>
                                                updateLineItem(
                                                    index,
                                                    "Item_title",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-gray-200"
                                        />
                                    </div>

                                    {/* ITEM AMOUNT */}
                                    <div className="w-full sm:w-1/3">
                                        <label className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                            Amount
                                        </label>
                                        <input
                                            type="number"
                                            placeholder={String(item.amount)}
                                            value={item.amount}
                                            onChange={(e) =>
                                                updateLineItem(
                                                    index,
                                                    "amount",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-gray-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
                    <button
                        onClick={handleSubmit}
                        className="rounded-lg bg-black px-6 py-2.5 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                    >
                        Save Changes
                    </button>

                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-600 px-6 py-2.5 text-sm text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
