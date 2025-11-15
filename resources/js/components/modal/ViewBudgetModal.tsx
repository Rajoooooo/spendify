import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

const formatAmount = (value: number | string) =>
  `₱${Number(value || 0).toLocaleString()}`;

const formatDate = (value: string) => {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ViewBudgetModal({ open, onClose, data }: Props) {
  const hasItems = !!data?.lineItems && data.lineItems.length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[96vw] 
          max-w-screen-xl 
          sm:max-w-[1100px]
          rounded-2xl border border-gray-200 
          bg-white/95 p-5 shadow-xl backdrop-blur-sm 
          dark:border-gray-800 dark:bg-gray-950 
          sm:p-7 lg:p-8
        "
      >
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 sm:flex-row sm:items-center sm:justify-between">
            <span>Budget Details</span>
            {data && (
              <Badge className="w-fit bg-gray-900 text-xs font-medium text-white dark:bg-gray-100 dark:text-gray-900">
                {formatDate(data.date)}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {data ? (
          <div className="mt-5 space-y-7">
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Budget Title
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                {data.budget_title || data.title || "Untitled Budget"}
              </p>
            </div>

            <div className="grid gap-4 rounded-2xl border border-gray-200 bg-gray-50/80 p-4 text-sm dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-3 sm:gap-6 sm:p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Total Amount
                </p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-50">
                  {formatAmount(data.amount)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Remaining Balance
                </p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-50">
                  {formatAmount(data.balance)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Utilized
                </p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-50">
                  {formatAmount(data.amount - data.balance)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <p className="text-base font-semibold text-gray-900 dark:text-gray-50">
                  Line Items
                </p>
                {hasItems && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {data.lineItems!.length} item
                    {data.lineItems!.length > 1 ? "s" : ""} listed
                  </p>
                )}
              </div>

              {hasItems ? (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                  <div className="max-h-72 overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-900">
                        <TableRow>
                          <TableHead className="w-3/4 text-gray-600 dark:text-gray-300">
                            Item Title
                          </TableHead>
                          <TableHead className="w-1/4 text-right text-gray-600 dark:text-gray-300">
                            Amount
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.lineItems!.map((item, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-900"
                          >
                            <TableCell className="text-sm font-medium text-gray-900 dark:text-gray-50">
                              {item.Item_title || "Untitled Item"}
                            </TableCell>
                            <TableCell className="text-right text-sm font-semibold text-gray-900 dark:text-gray-50">
                              {formatAmount(item.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <p className="text-sm italic text-gray-500 dark:text-gray-400">
                  No items added for this budget.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-200">
            No budget selected.
          </p>
        )}

        <DialogFooter className="mt-7 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
