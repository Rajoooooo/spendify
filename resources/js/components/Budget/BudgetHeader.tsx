import * as React from "react";
import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function BudgetHeader({ budget }: { budget: number | null }) {
  return (
    <Card className="rounded-2xl border bg-gradient-to-br from-slate-50 to-white p-8 dark:from-slate-900/40 dark:to-slate-900/10">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-slate-900 p-3 text-white shadow-sm dark:bg-slate-200 dark:text-slate-900">
          <Wallet className="size-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Balance Amount</h3>
          <p className="text-sm text-muted-foreground">Enter your budget here</p>
          <h1 className="text-4xl font-extrabold tracking-tight mt-4">
            {budget !== null ? `₱${budget.toLocaleString()}` : "Set Your Budget"}
          </h1>
        </div>
      </div>
    </Card>
  );
}
