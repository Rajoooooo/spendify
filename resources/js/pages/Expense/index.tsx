// resources/js/Pages/Expense/Index.tsx
import * as React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Wallet, Calendar, Coins, Tag, Plus, FolderPlus } from "lucide-react";

import ExpenseCard from "@/components/expense/ExpenseCard";
import ExpenseTable, { ExpenseRow } from "@/components/expense/ExpenseTable";
import AddExpenseModal from "@/components/modal/AddExpenseModal";
import AddCategoryModal from "@/components/modal/AddCategoryModal";
import EditExpenseModal from "@/components/modal/EditExpenseModal";
import ConfirmDeleteModal from "@/components/modal/ConfirmDeleteModal";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";

type Category = { id: number | string; name: string; color?: string | null };

export default function ExpenseIndex({
  expenses,
  categories,
}: {
  expenses: ExpenseRow[];
  categories: Category[];
}) {
  const loading = false;

  // Totals
  const monthTotal = React.useMemo(
    () => expenses.reduce((a, b) => a + (b.amount || 0), 0),
    [expenses]
  );
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayTotal = React.useMemo(
    () =>
      expenses
        .filter((e) => e.date === todayStr)
        .reduce((a, b) => a + (b.amount || 0), 0),
    [expenses, todayStr]
  );
  const avg = expenses.length ? monthTotal / expenses.length : 0;

  // Edit + Delete state
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<ExpenseRow | null>(null);

  const delForm = useForm({});

  function handleEdit(row: ExpenseRow) {
    setSelected(row);
    setEditOpen(true);
  }
  function handleDelete(row: ExpenseRow) {
    setSelected(row);
    setDeleteOpen(true);
  }
  function confirmDelete() {
    if (!selected) return;
    delForm.delete(`/expense/${selected.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteOpen(false);
        setSelected(null);
      },
    });
  }

  return (
    <AppLayout>
      <Head title="Expense" />

      <div className="mx-auto w-full max-w-6xl px-4 py-3">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              <Wallet className="size-5" />
              Expense
            </h1>

            <div className="flex gap-2">
              <AddExpenseModal categories={categories}>
                <Button className="gap-2">
                  <Plus className="size-4" />
                  Add expense
                </Button>
              </AddExpenseModal>

              <AddCategoryModal categories={categories}>
                <Button variant="secondary" className="gap-2">
                  <FolderPlus className="size-4" />
                  Add category
                </Button>
              </AddCategoryModal>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ExpenseCard
              loading={loading}
              title="This month"
              value={`₱${monthTotal.toFixed(2)}`}
              hint="Total expenses"
              icon={<Wallet className="size-4" />}
              variant="green"
            />
            <ExpenseCard
              loading={loading}
              title="Today"
              value={`₱${todayTotal.toFixed(2)}`}
              hint="Spent today"
              icon={<Calendar className="size-4" />}
              variant="blue"
            />
            <ExpenseCard
              loading={loading}
              title="Average"
              value={`₱${avg.toFixed(2)}`}
              hint="Per entry"
              icon={<Coins className="size-4" />}
              variant="amber"
            />
            <ExpenseCard
              loading={loading}
              title="Entries"
              value={`${expenses.length}`}
              hint="All time"
              icon={<Tag className="size-4" />}
              variant="rose"
            />
          </div>

          {/* List with actions */}
          <ExpenseTable
            loading={loading}
            rows={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Modals */}
      <EditExpenseModal
        open={editOpen}
        onOpenChange={setEditOpen}
        expense={selected}
        categories={categories}
      />

      <ConfirmDeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete expense"
        message="This will permanently remove the expense. This action cannot be undone."
        onConfirm={confirmDelete}
        loading={delForm.processing}
      />
    </AppLayout>
  );
}
