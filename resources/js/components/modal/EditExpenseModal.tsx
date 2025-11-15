import * as React from "react";
import { useForm } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

type Category = { id: number | string; name: string };
type Expense = {
  id: number | string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  category_id?: number | string | null;
};

export default function EditExpenseModal({
  open,
  onOpenChange,
  expense,
  categories = [],
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  expense: Expense | null;
  categories?: Category[];
}) {
  const [successOpen, setSuccessOpen] = React.useState(false);

  const form = useForm({
    date: expense?.date ?? new Date().toISOString().slice(0, 10),
    description: expense?.description ?? "",
    amount: String(expense?.amount ?? ""),
    category_id: (expense?.category_id ?? "") as string | number | "",
  });

  React.useEffect(() => {
    form.setData({
      date: expense?.date ?? new Date().toISOString().slice(0, 10),
      description: expense?.description ?? "",
      amount: String(expense?.amount ?? ""),
      category_id: (expense?.category_id ?? "") as string | number | "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expense?.id]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!expense) return;
    form.put(`/expense/${expense.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        onOpenChange(false);
        setSuccessOpen(true); // ← show success dialog
      },
    });
  }

  const canSave =
    form.data.description.trim().length > 0 &&
    String(form.data.amount).length > 0 &&
    !form.processing;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit expense</DialogTitle>
            <DialogDescription id="edit-expense-desc" className="sr-only">
              Update the fields below and save to apply changes to this expense.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={submit}
            className="grid gap-3"
            aria-describedby="edit-expense-desc"
          >
            <div className="grid gap-1.5">
              <Label htmlFor="e-date">Date</Label>
              <Input
                id="e-date"
                type="date"
                value={form.data.date}
                onChange={(e) => form.setData("date", e.target.value)}
              />
              {form.errors.date && (
                <p className="text-xs text-red-600">{form.errors.date}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="e-desc">Description</Label>
              <Input
                id="e-desc"
                value={form.data.description}
                onChange={(e) => form.setData("description", e.target.value)}
              />
              {form.errors.description && (
                <p className="text-xs text-red-600">{form.errors.description}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="e-amt">Amount</Label>
              <Input
                id="e-amt"
                type="number"
                min="0"
                step="0.01"
                value={form.data.amount}
                onChange={(e) => form.setData("amount", e.target.value)}
              />
              {form.errors.amount && (
                <p className="text-xs text-red-600">{form.errors.amount}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label>Category</Label>
              <Select
                value={
                  form.data.category_id
                    ? String(form.data.category_id)
                    : undefined
                }
                onValueChange={(v) => form.setData("category_id", Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.errors.category_id && (
                <p className="text-xs text-red-600">
                  {form.errors.category_id}
                </p>
              )}
            </div>

            <DialogFooter className="pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.processing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canSave}>
                {form.processing ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green-600" />
              Expense updated
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Your changes have been saved successfully.
          </p>
          <DialogFooter className="pt-1">
            <Button onClick={() => setSuccessOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
