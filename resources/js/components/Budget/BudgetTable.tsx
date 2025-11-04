import * as React from "react";
import { Card } from "@/components/ui/card";

export default function BudgetTable({ items = [] }: { items?: any[] }) {
  return (
    <Card className="rounded-2xl border bg-card/60 p-5">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-sm font-medium text-left">Date</th>
              <th className="px-4 py-2 text-sm font-medium text-left">Budget</th>
              <th className="px-4 py-2 text-sm font-medium text-left">Balance</th>
              <th className="px-4 py-2 text-sm font-medium text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-sm text-center text-muted-foreground">
                  No data available.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm">{item.date}</td>
                  <td className="px-4 py-2 text-sm">{item.amount}</td>
                  <td className="px-4 py-2 text-sm">{item.balance}</td>
                  <td className="px-4 py-2 text-sm">
                    {/* Add your action buttons here */}
                    <button>Edit</button> | <button>Delete</button>
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
