import * as React from "react";
import { Head, router } from "@inertiajs/react";
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
  const [items, setItems] = React.useState<LineItem[]>([
    { id: crypto.randomUUID(), title: "", amount: "" },
  ]);
  const [initialBudget, setInitialBudget] = React.useState<number>(0);
  const [budget, setBudget] = React.useState<number>(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [budgetTitle, setBudgetTitle] = React.useState<string>("");
  const [successModal, setSuccessModal] = React.useState(false);

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

  function addItem() {
    setItems((prev) => [...prev, { id: crypto.randomUUID(), title: "", amount: "" }]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function onEnterBudget() {
    setModalOpen(true);
  }

  function onSave() {
    const totalSpent = items.reduce(
      (acc, item) => acc + (parseFloat(item.amount) || 0),
      0
    );
    const remainingBalance = initialBudget - totalSpent;
    const budgetData = {
      title: budgetTitle,
      amount: initialBudget,
      balance: remainingBalance,
      line_items: items.map((item) => ({
        title: item.title,
        amount: parseFloat(item.amount) || 0,
      })),
    };
    router.post("/budget/store", budgetData, {
      onSuccess: () => {
        setSuccessModal(true);
        setItems([{ id: crypto.randomUUID(), title: "", amount: "" }]);
        setInitialBudget(0);
        setBudget(0);
        setBudgetTitle("");
      },
      onError: () => {
        alert("Error saving budget, Please Enter Budget Line Items.");
      },
    });
  }

  function handleBudgetChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value.replace(/[^\d.]/g, "");
    const parsedValue = parseFloat(inputValue) || 0;
    setInitialBudget(parsedValue);
    setBudget(parsedValue);
  }

  function handleBudgetSave() {
    setModalOpen(false);
  }

  function handleBudgetTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBudgetTitle(e.target.value);
  }

  const handleAmountChange = (id: string, value: string) => {
    const sanitized = value.replace(/[^\d.]/g, "");
    updateItem(id, { amount: sanitized });
  };

  return (
    <AppLayout>
      <Head title="Budget" />
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <BudgetHeader budget={budget} />
            <BudgetControls onEnter={onEnterBudget} onSave={onSave} />
          </div>
          <Card className="rounded-2xl border bg-card/60 p-5">
            <div className="mb-3">
              <h2 className="text-lg font-semibold tracking-tight">Line Items</h2>
              <p className="text-sm text-muted-foreground">
                Add a title and amount for each budget entry.
              </p>
            </div>
            <div className="grid gap-1.5 mb-4">
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
                  onChangeAmount={(v) => handleAmountChange(item.id, v)}
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
        <div className="mt-6">
          <BudgetTable />
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold">Enter Budget Amount</h3>
            <input
              type="text"
              placeholder="Enter total budget"
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

      {successModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm">
            <h3 className="text-lg font-semibold text-green-600">Success!</h3>
            <p className="mt-2 text-sm text-gray-600">
              Your budget has been saved successfully.
            </p>
            <div className="mt-4">
              <Button onClick={() => setSuccessModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
