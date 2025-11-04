import * as React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BudgetHeader from "@/components/Budget/BudgetHeader";
import BudgetControls from "@/components/Budget/BudgetControls";
import BudgetLineItem from "@/components/Budget/BudgetLineItem";
import BudgetTable from "@/components/Budget/BudgetTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type LineItem = { id: string; title: string; amount: string };

export default function Index() {
  // 🔹 Initial budget starts at 0
  const [items, setItems] = React.useState<LineItem[]>([
    { id: crypto.randomUUID(), title: "", amount: "" },
  ]);

  const [initialBudget, setInitialBudget] = React.useState<number>(0);
  const [budget, setBudget] = React.useState<number>(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [budgetTitle, setBudgetTitle] = React.useState<string>("");

  // 🔹 Budget logic (for header only)
  const updateBudget = React.useCallback(() => {
    const totalAmount = items.reduce(
      (acc, item) => acc + (parseFloat(item.amount) || 0),
      0
    );
    setBudget(initialBudget - totalAmount);
  }, [items, initialBudget]);

  React.useEffect(() => {
    updateBudget();
  }, [items, updateBudget]);

  // 🔹 Add new line item (for form only)
  function addItem() {
    setItems((prev) => [...prev, { id: crypto.randomUUID(), title: "", amount: "" }]);
  }

  // 🔹 Remove item (for form only)
  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  // 🔹 Update form item (not linked to table)
  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  // 🔹 Open modal
  function onEnterBudget() {
    setModalOpen(true);
  }

  // 🔹 Save button (for now, just console log)
  function onSave() {
    console.table(items);
  }

  // 🔹 Handle user input for budget
  function handleBudgetChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value.replace(/[^\d.]/g, ""); // numbers and dots only
    const parsedValue = parseFloat(inputValue) || 0;
    setInitialBudget(parsedValue);
    setBudget(parsedValue);
  }

  // 🔹 Save modal
  function handleBudgetSave() {
    setModalOpen(false);
  }

  // 🔹 Handle title input
  function handleBudgetTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBudgetTitle(e.target.value);
  }

  // 🔹 Amount input (does not affect the table)
  const handleAmountChange = (id: string, value: string) => {
    const sanitized = value.replace(/[^\d.]/g, ""); // keep numbers and dots
    updateItem(id, { amount: sanitized });
  };

  return (
    <AppLayout>
      <Head title="Budget" />

      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Summary and controls */}
          <div className="space-y-4">
            <BudgetHeader budget={budget} />
            <BudgetControls onEnter={onEnterBudget} onSave={onSave} />
          </div>

          {/* Right: Budget Form */}
          <Card className="rounded-2xl border bg-card/60 p-5">
            <div className="mb-3">
              <h2 className="text-lg font-semibold tracking-tight">Line Items</h2>
              <p className="text-sm text-muted-foreground">
                Add a title and amount for each budget entry. You can remove any extra row you added.
              </p>
            </div>

            {/* Budget Title Field */}
            <div className="grid gap-1.5 mb-4">
              <Label htmlFor="budgetTitle">Budget Title</Label>
              <Input
                id="budgetTitle"
                placeholder="Enter budget title"
                value={budgetTitle}
                onChange={handleBudgetTitleChange}
              />
            </div>

            {/* Budget Line Items (form only) */}
            <div className="space-y-3">
              {items.map((item) => (
                <BudgetLineItem
                  key={item.id}
                  title={item.title}
                  amount={item.amount}
                  onChangeTitle={(v) => updateItem(item.id, { title: v })}
                  onChangeAmount={(v) => handleAmountChange(item.id, v)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>

            {/* Add Field Button */}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" className="gap-2" onClick={addItem}>
                <Plus className="size-4" />
                Add field
              </Button>
            </div>
          </Card>
        </div>

        {/* Static Table (not linked to form data) */}
        <div className="mt-6">
          <BudgetTable />
        </div>
      </div>

      {/* ✅ Budget Modal (Restored full logic) */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold">Enter Budget</h3>

            {/* ✅ Shows and updates exact input value */}
            <input
              type="text"
              placeholder="Enter budget"
              value={initialBudget === 0 ? "" : initialBudget}
              onChange={handleBudgetChange}
              className="mt-4 p-2 w-full border rounded"
            />

            <div className="flex justify-end mt-4">
              <Button onClick={handleBudgetSave}>Save Budget</Button>
              <Button
                variant="secondary"
                className="ml-2"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
