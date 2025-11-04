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
import { Label } from "@/components/ui/label"; // Make sure this path is correct
import { Input } from "@/components/ui/input"; 

type LineItem = { id: string; title: string; amount: string };

export default function Index() {
  const [items, setItems] = React.useState<LineItem[]>([
    { id: crypto.randomUUID(), title: "", amount: "" },
  ]);

  const [budget, setBudget] = React.useState<number | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [budgetTitle, setBudgetTitle] = React.useState<string>("");

  function addItem() {
    setItems((s) => [...s, { id: crypto.randomUUID(), title: "", amount: "" }]);
  }

  function removeItem(id: string) {
    setItems((s) => (s.length > 1 ? s.filter((i) => i.id !== id) : s));
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((s) => s.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function onEnterBudget() {
    setModalOpen(true);
  }

  function onSave() {
    console.table(items);
  }

  function handleBudgetChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBudget(parseFloat(e.target.value));
  }

  function handleBudgetSave() {
    setModalOpen(false);
    // Placeholder to save budget to backend or state
  }

  function handleBudgetTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBudgetTitle(e.target.value);
  }

  return (
    <AppLayout>
      <Head title="Budget" />

      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Big title + controls */}
          <div className="space-y-4">
            <BudgetHeader budget={budget} />
            <BudgetControls onEnter={onEnterBudget} onSave={onSave} />
          </div>

          {/* Right: Form panel */}
          <Card className="rounded-2xl border bg-card/60 p-5">
            <div className="mb-3">
              <h2 className="text-lg font-semibold tracking-tight">Line Items</h2>
              <p className="text-sm text-muted-foreground">
                Add a title and amount for each budget entry. You can remove any extra row you added.
              </p>
            </div>

             {/* Add a Budget Title field at the bottom */}
            <div className="grid gap-1.5">
              <Label htmlFor="budgetTitle">Budget Title</Label>
              <Input
                id="budgetTitle"
                placeholder="Enter budget title"
                value={budgetTitle}
                onChange={handleBudgetTitleChange}
              />
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <BudgetLineItem
                  key={item.id}
                  title={item.title}
                  amount={item.amount}
                  onChangeTitle={(v) => updateItem(item.id, { title: v })}
                  onChangeAmount={(v) => updateItem(item.id, { amount: v })}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" className="gap-2" onClick={addItem}>
                <Plus className="size-4" />
                Add field
              </Button>
            </div>
          </Card>
        </div>

        {/* Table preview */}
        <div className="mt-6">
          <BudgetTable items={items} />
        </div>
      </div>

      {/* Budget Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold">Enter Budget</h3>
            <input
              type="number"
              placeholder="Enter budget"
              value={budget ?? ""}
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
