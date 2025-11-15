import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

type BudgetLineItemProps = {
  title: string;
  amount: string;
  onChangeTitle: (v: string) => void;
  onChangeAmount: (v: string) => void;
  onRemove: () => void;
};

const BudgetLineItem: React.FC<BudgetLineItemProps> = ({
  title,
  amount,
  onChangeTitle,
  onChangeAmount,
  onRemove,
}) => {
  return (
    <div className="rounded-2xl border bg-card/50 p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto] sm:items-end">
        <div className="grid gap-1.5">
          <Label htmlFor="title">Budget Item</Label>
          <Input
            id="title"
            placeholder="e.g., Groceries, Utilities"
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="text"
            placeholder="e.g., 1000"
            value={amount}
            onChange={(e) => onChangeAmount(e.target.value)}
          />
        </div>

        <div className="flex justify-end sm:justify-start">
          <Button variant="ghost" onClick={onRemove} className="mt-6 sm:mt-0">
            <X className="size-4" />
            <span className="sr-only">Remove row</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BudgetLineItem;
