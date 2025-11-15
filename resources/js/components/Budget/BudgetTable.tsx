import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type BudgetTableProps = {
  items?: any[];
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
};

export default function BudgetTable({
  items = [],
  onView,
  onEdit,
  onDelete,
}: BudgetTableProps) {
  const [query, setQuery] = React.useState("");

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (value: number | string) => {
    if (value === null || value === undefined || value === "") return "0.00";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
  };

  const totalBudget = items.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );
  const totalBalance = items.reduce(
    (sum, item) => sum + (Number(item.balance) || 0),
    0
  );

  // Filter by title / budget_title
  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) => {
      const title = (item.title || item.budget_title || "").toLowerCase();
      return title.includes(q);
    });
  }, [items, query]);

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-gray-200 pb-3 dark:border-gray-800">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Budget Overview
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {items.length === 0
              ? "No budgets recorded yet."
              : `${items.length} budget${items.length > 1 ? "s" : ""} • ₱${formatAmount(
                  totalBudget
                )} total • ₱${formatAmount(totalBalance)} remaining`}
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-xs">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search budgets..."
            className="h-9 text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Title
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Budget
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Balance
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No data available. Create a budget to see it listed here.
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No budgets match your search.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => {
                  const balance = Number(item.balance) || 0;
                  const title = item.title || item.budget_title || "Untitled";

                  return (
                    <tr
                      key={index}
                      className={cn(
                        "transition-colors",
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-950"
                          : "bg-gray-50 dark:bg-gray-900",
                        "hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      {/* Date */}
                      <td className="whitespace-nowrap px-4 py-3 align-middle text-gray-700 dark:text-gray-300">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {formatDate(item.date)}
                        </span>
                      </td>

                      {/* Title */}
                      <td className="px-4 py-3 align-middle">
                        <div className="text-sm font-semibold tracking-wide text-gray-900 dark:text-gray-50">
                          {title}
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="px-4 py-3 text-right align-middle">
                        <span className="font-semibold text-gray-900 dark:text-gray-50">
                          ₱{formatAmount(item.amount)}
                        </span>
                      </td>

                      {/* Balance */}
                      <td className="px-4 py-3 text-right align-middle">
                        <span className="font-semibold text-gray-900 dark:text-gray-50">
                          ₱{formatAmount(balance)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center align-middle">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="mx-auto flex h-8 w-8 items-center justify-center p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            className="w-32 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                          >
                            <DropdownMenuItem
                              className="cursor-pointer text-gray-800 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
                              onClick={() =>
                                onView?.({
                                  ...item,
                                  lineItems: item.lineItems,
                                })
                              }
                            >
                              View
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="cursor-pointer text-gray-800 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
                              onClick={() =>
                                onEdit?.({
                                  ...item,
                                  lineItems: item.lineItems,
                                })
                              }
                            >
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="cursor-pointer text-gray-800 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-800"
                              onClick={() =>
                                onDelete?.({
                                  ...item,
                                  lineItems: item.lineItems,
                                })
                              }
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
