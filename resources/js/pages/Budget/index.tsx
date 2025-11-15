import * as React from "react";
import { Head, router, usePage } from "@inertiajs/react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Modals
import ViewBudgetModal from "@/components/modal/ViewBudgetModal";
import EditBudgetModal from "@/components/modal/EditBudgetModal";

type LineItem = { id: string; title: string; amount: string };

interface BudgetPageProps {
  budgets: {
    id: number;
    title: string;
    amount: number;
    balance: number;
    date: string;
    lineItems?: any[];
  }[];
}

export default function Index() {
  const { budgets } = usePage().props as unknown as BudgetPageProps;

  const [items, setItems] = React.useState<LineItem[]>([
    { id: crypto.randomUUID(), title: "", amount: "" },
  ]);
  const [initialBudget, setInitialBudget] = React.useState<number>(0);
  const [budget, setBudget] = React.useState<number>(0);
  const [budgetTitle, setBudgetTitle] = React.useState<string>("");

  const [modalOpen, setModalOpen] = React.useState(false);
  const [successModal, setSuccessModal] = React.useState(false);
  const [errorModal, setErrorModal] = React.useState(false);

  // VIEW + EDIT MODALS
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedBudget, setSelectedBudget] = React.useState<any>(null);

  // --- calculate remaining balance
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
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: "", amount: "" },
    ]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  // Modal handlers
  function onEnterBudget() {
    setModalOpen(true);
  }

  function handleBudgetSave() {
    if (!initialBudget || initialBudget <= 0) {
      setErrorModal(true);
      return;
    }
    setModalOpen(false);
  }

  function onSave() {
    const totalSpent = items.reduce(
      (acc, item) => acc + (parseFloat(item.amount) || 0),
      0
    );
    const remainingBalance = initialBudget - totalSpent;

    if (!budgetTitle) {
      setErrorModal(true);
      return;
    }

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
        setErrorModal(true);
      },
    });
  }

  function handleBudgetChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value.replace(/[^\d.]/g, "");
    const parsedValue = parseFloat(inputValue) || 0;
    setInitialBudget(parsedValue);
    setBudget(parsedValue);
  }

  function handleBudgetTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBudgetTitle(e.target.value);
  }

  const handleAmountChange = (id: string, value: string) => {
    const sanitized = value.replace(/[^\d.]/g, "");
    updateItem(id, { amount: sanitized });
  };

  const handleDelete = (item: any) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      router.delete(`/budget/${item.id}`);
    }
  };

  const handleView = (item: any) => {
    setSelectedBudget(item);
    setViewModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedBudget(item);
    setEditModalOpen(true);
  };

  // ⭐ NEW: HANDLE UPDATE FROM EDIT MODAL (VERY IMPORTANT)
  const handleUpdateBudget = (updated: any) => {
    router.put(`/budget/${updated.id}`, updated, {
        onSuccess: () => {
            setEditModalOpen(false);
        },
        onError: () => {
            alert("Error updating budget.");
        },
    });
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
              <h2 className="text-lg font-semibold tracking-tight">
                Line Items
              </h2>
              <p className="text-sm text-muted-foreground">
                Add a title and amount for each budget entry.
              </p>
            </div>

            <div className="mb-3">
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
                <Plus className="size-4" /> Add field
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <BudgetTable
            items={budgets}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Enter Budget Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Budget Amount</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="grid gap-1.5">
              <Label htmlFor="budgetAmountModal">Budget Amount</Label>
              <Input
                id="budgetAmountModal"
                placeholder="Enter initial amount"
                value={initialBudget || ""}
                onChange={handleBudgetChange}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBudgetSave}>Save Budget</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successModal} onOpenChange={setSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Budget Saved Successfully</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Your budget has been saved successfully in the system.
          </p>
          <DialogFooter>
            <Button onClick={() => setSuccessModal(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={errorModal} onOpenChange={setErrorModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Error Saving Budget</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            There was an issue saving your budget. Please check your entries and try again.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setErrorModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW MODAL */}
      <ViewBudgetModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        data={selectedBudget}
      />

      {/* EDIT MODAL */}
      <EditBudgetModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        data={selectedBudget}
        onSave={handleUpdateBudget}   // ⭐ FIXED
      />
    </AppLayout>
  );
}
