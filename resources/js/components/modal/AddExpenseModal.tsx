import * as React from "react";
import { useForm } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription, // ← add
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Cat = { id: number | string; name: string };

export default function AddExpenseModal({
  children,
  categories = [],
}: {
  children: React.ReactNode;
  categories?: Cat[];
}) {
  const [open, setOpen] = React.useState(false);

  const form = useForm({
    date: new Date().toISOString().slice(0, 10),
    description: "",
    amount: "",
    category_id: "" as string | number | "",
  });

  const canSave =
    form.data.description.trim().length > 0 &&
    String(form.data.amount).length > 0 &&
    !form.processing;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.post("/expense", {
      preserveScroll: true,
      onSuccess: () => {
        setOpen(false);
        form.reset("description", "amount", "category_id");
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add expense</DialogTitle>
          {/* fixes the Missing Description/aria-describedby warning */}
          <DialogDescription id="add-expense-desc" className="sr-only">
            Fill out the fields below to add a new expense entry.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-3" aria-describedby="add-expense-desc">
          <div className="grid gap-1.5">
            <Label htmlFor="exp-date">Date</Label>
            <Input
              id="exp-date"
              type="date"
              value={form.data.date}
              onChange={(e) => form.setData("date", e.target.value)}
            />
            {form.errors.date && (
              <p className="text-xs text-red-600">{form.errors.date}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="exp-desc">Description</Label>
            <Input
              id="exp-desc"
              placeholder="What was this for?"
              value={form.data.description}
              onChange={(e) => form.setData("description", e.target.value)}
            />
            {form.errors.description && (
              <p className="text-xs text-red-600">{form.errors.description}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="exp-amt">Amount</Label>
            <Input
              id="exp-amt"
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
            {/* Use undefined to show placeholder; DO NOT render an empty-value item */}
            <Select
              value={
                form.data.category_id ? String(form.data.category_id) : undefined
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
              <p className="text-xs text-red-600">{form.errors.category_id}</p>
            )}
          </div>

          <DialogFooter className="pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={form.processing}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSave}>
              {form.processing ? "Saving..." : "Add expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
