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

interface Props {
    open: boolean;
    onClose: () => void;
    data: Budget | null;
    onSave: (updated: Budget) => void;
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
        if (data) {
            const used = data.lineItems.reduce(
                (sum, item) => sum + Number(item.amount),
                0
            );

            setForm({
                title: data.title,
                amount: cleanAmount(data.amount),
                lineItems: data.lineItems.map((i) => ({
                    Item_title: i.Item_title,
                    amount: cleanAmount(i.amount),
                })),
                balance: data.amount - used,
            });
        }
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
    const update = (field: string, value: any) => {
        const cleaned = cleanAmount(value);

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
        const cleaned = cleanAmount(value);

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

    // FINAL SUBMIT
    const handleSubmit = () => {
        onSave({
            id: data.id,
            title: form.title,
            amount: Number(form.amount),
            balance: form.balance,
            lineItems: form.lineItems.map((i) => ({
                Item_title: i.Item_title,
                amount: Number(i.amount),
            })),
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl w-[900px] shadow-2xl border border-gray-300">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                    Edit Budget –{" "}
                    <span className="font-semibold">
                        {data.budget_title || data.title}
                    </span>
                </h2>

                {/* TITLE + AMOUNT */}
                <div className="flex gap-6 mb-7">
                    <div className="w-1/2">
                        <label className="font-semibold text-gray-900">
                            Budget Title
                        </label>
                        <input
                            type="text"
                            placeholder={data.budget_title || data.title}
                            value={form.title}
                            onChange={(e) => update("title", e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg mt-1 bg-white text-gray-900 focus:ring-2 focus:ring-black"
                        />
                    </div>

                    {/* TOTAL BUDGET AMOUNT */}
                    <div className="w-1/2">
                        <label className="font-semibold text-gray-900">
                            Total Budget Amount
                        </label>
                        <input
                            type="number"
                            placeholder={String(data.amount)}
                            value={form.amount}
                            onChange={(e) => update("amount", e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg mt-1 bg-white text-gray-900 focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>

                {/* BALANCE */}
                <div className="bg-gray-50 p-5 border border-gray-300 rounded-xl mb-6">
                    <p className="text-sm text-gray-600">Remaining Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                        ₱{form.balance.toLocaleString()}
                    </p>
                </div>

                {/* LINE ITEMS */}
                <div className="bg-gray-50 p-6 border border-gray-300 rounded-2xl mb-5">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-xl font-semibold text-gray-900">
                            Line Items
                        </p>

                        <button
                            onClick={addNewLineItem}
                            className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                        >
                            + Add Item
                        </button>
                    </div>

                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                        {form.lineItems.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm relative"
                            >
                                <button
                                    onClick={() => removeLineItem(index)}
                                    className="absolute right-3 top-3 text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={20} />
                                </button>

                                <div className="flex gap-4">
                                    <div className="w-2/3">
                                        <label className="text-sm font-medium text-gray-800">
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
                                            className="w-full border border-gray-300 px-3 py-2 rounded-lg mt-1 bg-white text-gray-900 focus:ring-2 focus:ring-black"
                                        />
                                    </div>

                                    {/* ITEM AMOUNT */}
                                    <div className="w-1/3">
                                        <label className="text-sm font-medium text-gray-800">
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
                                            className="w-full border border-gray-300 px-3 py-2 rounded-lg mt-1 bg-white text-gray-900 focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-4 mt-8">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 bg-black text-white rounded-lg text-sm"
                    >
                        Save Changes
                    </button>

                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-600 text-white rounded-lg text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
