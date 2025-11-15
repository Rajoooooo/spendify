import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface LineItem {
    id?: number;
    Budget_title?: string;
    Item_title: string;
    amount: number;
}

interface Budget {
    id: number;
    title: string;
    budget_title?: string;
    amount: number;
    balance: number;
    date: string;
    lineItems?: LineItem[];
}

interface Props {
    open: boolean;
    onClose: () => void;
    data: Budget | null;
}

export default function ViewBudgetModal({ open, onClose, data }: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="
                w-[90vw] max-w-[1100px] 
                bg-white rounded-xl 
                p-10 shadow-xl
            "
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold tracking-tight text-black">
                        Budget Details
                    </DialogTitle>
                </DialogHeader>

                {data ? (
                    <div className="mt-6 space-y-10">

                        {/* ========================================
                            BUDGET TITLE (Minimal)
                        ========================================= */}
                        <div>
                            <p className="text-sm text-black/60">Budget Title</p>
                            <p className="text-3xl font-semibold text-black mt-1">
                                {data.budget_title || data.title}
                            </p>
                        </div>

                        {/* ========================================
                            AMOUNT + BALANCE
                        ========================================= */}
                        <div className="grid grid-cols-2 gap-12">

                            <div>
                                <p className="text-sm text-black/60">Total Amount</p>
                                <p className="text-2xl font-semibold text-black mt-1">
                                    ₱{data.amount.toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-black/60">Balance</p>
                                <p className="text-2xl font-semibold text-black mt-1">
                                    ₱{data.balance.toLocaleString()}
                                </p>
                            </div>

                        </div>

                        {/* ========================================
                            ITEM LINE LIST
                        ========================================= */}
                        <div className="space-y-4">
                            <p className="text-lg font-semibold text-black">
                                Item Line
                            </p>

                            {data.lineItems && data.lineItems.length > 0 ? (
                                <div className="space-y-3">
                                    {data.lineItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="
                                            flex justify-between items-center 
                                            py-3
                                            border-b border-black/10
                                        "
                                        >
                                            <p className="text-black font-medium">
                                                {item.Item_title}
                                            </p>
                                            <p className="text-black font-semibold">
                                                ₱{item.amount.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-black/50 italic">No items added.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-black">No budget selected.</p>
                )}

                {/* ========================================
                    CLOSE BUTTON (Minimal)
                ========================================= */}
                <DialogFooter className="mt-10">
                    <button
                        onClick={onClose}
                        className="
                        px-6 py-2 rounded-md bg-black text-white 
                        hover:bg-black/80 transition
                    "
                    >
                        Close
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
