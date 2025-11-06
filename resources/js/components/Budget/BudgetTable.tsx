import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function BudgetTable({ items = [], onView, onEdit, onDelete }: { items?: any[]; onView?: any; onEdit?: any; onDelete?: any }) {
  return (
    <Card className="rounded-2xl border bg-card/60 p-5">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-sm font-medium text-left">Date</th>
              <th className="px-4 py-2 text-sm font-medium text-left">Title</th>
              <th className="px-4 py-2 text-sm font-medium text-left">Budget</th>
              <th className="px-4 py-2 text-sm font-medium text-left">Balance</th>
              <th className="px-4 py-2 text-sm font-medium text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-sm text-center text-muted-foreground">
                  No data available.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 text-sm">{item.date}</td>
                  <td className="px-4 py-2 text-sm">{item.title}</td>
                  <td className="px-4 py-2 text-sm">{item.amount}</td>
                  <td className="px-4 py-2 text-sm">{item.balance}</td>
                  <td className="px-4 py-2 text-sm">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(item)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(item)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete?.(item)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
