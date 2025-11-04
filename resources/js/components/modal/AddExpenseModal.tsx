import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Controlled by parent via children-as-trigger
export default function AddExpenseModal({
  children,
  categories = [],
}: {
  children: React.ReactNode; // usually a Button
  categories?: { id: number | string; name: string }[];
}) {
  const [open, setOpen] = React.useState(false);

  // local-only form (no submission yet)
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = React.useState(today);
  const [desc, setDesc] = React.useState("");
  const [amt, setAmt] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<string | undefined>(undefined);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add expense</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="exp-date">Date</Label>
            <Input id="exp-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="exp-desc">Description</Label>
            <Input id="exp-desc" placeholder="What was this for?" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="exp-amt">Amount</Label>
            <Input id="exp-amt" type="number" min="0" step="0.01" value={amt} onChange={(e) => setAmt(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="__none" disabled>No categories yet</SelectItem>
                ) : (
                  categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* footer left empty on purpose; hook your submit later */}
          <p className="pt-1 text-xs text-muted-foreground">
            (No backend wired yet – connect your submit handler when ready.)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
