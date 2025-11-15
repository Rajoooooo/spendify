import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BudgetTable({
  items = [],
  onView,
  onEdit,
  onDelete,
}: {
  items?: any[];
  onView?: any;
  onEdit?: any;
  onDelete?: any;
}) {
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

  return (
    <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b border-gray-100">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Budget Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50/80 backdrop-blur-sm">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-left">
                  Date
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-left">
                  Title
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-left">
                  Budget
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-left">
                  Balance
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-sm text-center text-gray-500"
                  >
                    No data available.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr
                    key={index}
                    className={cn(
                      "transition-all hover:bg-amber-50/60",
                      index % 2 === 0 && "bg-white"
                    )}
                  >
                    <td className="px-5 py-3 text-sm text-gray-700 whitespace-nowrap align-middle">
                      {formatDate(item.date)}
                    </td>

                    <td className="px-5 py-3 text-sm align-middle">
                      <div className="text-lg font-extrabold text-amber-700 drop-shadow-sm tracking-wide">
                        {item.title}
                      </div>
                      {item.budget_title && (
                        <div className="text-xs text-gray-500 mt-1 tracking-wide">
                          {item.budget_title}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-3 text-sm text-gray-700 align-middle">
                      <span className="font-semibold text-green-600">
                        ₱{formatAmount(item.amount)}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-sm text-gray-700 align-middle">
                      <span className="font-semibold text-blue-600">
                        ₱{formatAmount(item.balance)}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-sm text-gray-700 text-center align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 mx-auto flex justify-center items-center"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="center" className="w-32">
                          <DropdownMenuItem
                            onClick={() =>
                              onView?.({
                                ...item,
                                lineItems: item.lineItems, // ✅ Added (ensures modal has line items)
                              })
                            }
                          >
                            View
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              onEdit?.({
                                ...item,
                                lineItems: item.lineItems, // ✅ Added
                              })
                            }
                          >
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              onDelete?.({
                                ...item,
                                lineItems: item.lineItems, // ✅ Added
                              })
                            }
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
