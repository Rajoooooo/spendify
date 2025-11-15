// resources/js/components/expense/ExpenseTable.tsx
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MoreVertical, Pencil, Trash2, SlidersHorizontal } from "lucide-react";

export type ExpenseRow = {
  id: number | string;
  date: string; // YYYY-MM-DD
  description: string;
  category?: string | null;
  category_color?: string | null;
  amount: number;
};

// Format "YYYY-MM-DD" safely as long date
function fmtLongDate(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(d);
}

export default function ExpenseTable({
  rows = [],
  loading = false,
  onEdit,
  onDelete,
}: {
  rows?: ExpenseRow[];
  loading?: boolean;
  onEdit?: (row: ExpenseRow) => void;
  onDelete?: (row: ExpenseRow) => void;
}) {
  const [query, setQuery] = React.useState("");

  // Drawer open state
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  // Applied filters (used for actual filtering)
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [dateFrom, setDateFrom] = React.useState<string>("");
  const [dateTo, setDateTo] = React.useState<string>("");

  // Draft filters (inside drawer)
  const [draftCategory, setDraftCategory] = React.useState<string>("all");
  const [draftDateFrom, setDraftDateFrom] = React.useState<string>("");
  const [draftDateTo, setDraftDateTo] = React.useState<string>("");

  // Unique categories for dropdown
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return Array.from(set).sort();
  }, [rows]);

  // When drawer opens, copy applied filters into drafts
  React.useEffect(() => {
    if (filtersOpen) {
      setDraftCategory(categoryFilter);
      setDraftDateFrom(dateFrom);
      setDraftDateTo(dateTo);
    }
  }, [filtersOpen, categoryFilter, dateFrom, dateTo]);

  const handleApplyFilters = () => {
    setCategoryFilter(draftCategory);
    setDateFrom(draftDateFrom);
    setDateTo(draftDateTo);
    setFiltersOpen(false);
  };

  const handleClearDraft = () => {
    setDraftCategory("all");
    setDraftDateFrom("");
    setDraftDateTo("");
  };

  // Final filtered rows
  const filtered = React.useMemo(() => {
    if (loading) return [];

    const q = query.toLowerCase();

    return rows.filter((r) => {
      const matchesText =
        r.description.toLowerCase().includes(q) ||
        (r.category ?? "").toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "all" ||
        !categoryFilter ||
        (r.category ?? "") === categoryFilter;

      const matchesFrom = !dateFrom || r.date >= dateFrom;
      const matchesTo = !dateTo || r.date <= dateTo;

      return matchesText && matchesCategory && matchesFrom && matchesTo;
    });
  }, [rows, query, loading, categoryFilter, dateFrom, dateTo]);

  return (
    <Card className="overflow-hidden rounded-2xl">
      {/* Top bar: Filters (left) + Search (right) */}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="inline-flex items-center gap-2"
              disabled={loading}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-full max-w-sm px-6 py-6 sm:px-8 sm:py-8 flex flex-col gap-6"
          >
            <SheetHeader className="space-y-1">
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filter expenses
              </SheetTitle>
              <SheetDescription>
                Narrow down your expense list by category and date range.
              </SheetDescription>
            </SheetHeader>

            {/* Drawer body */}
            <div className="flex-1 space-y-6">
              {/* Category filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Category
                  </label>
                  {categories.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {categories.length} option
                      {categories.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={draftCategory}
                  onChange={(e) => setDraftCategory(e.target.value)}
                  disabled={loading}
                >
                  <option value="all">All categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date range */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Date range
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">From</label>
                    <Input
                      type="date"
                      value={draftDateFrom}
                      onChange={(e) => setDraftDateFrom(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">To</label>
                    <Input
                      type="date"
                      value={draftDateTo}
                      onChange={(e) => setDraftDateTo(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            <SheetFooter className="pt-2 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleClearDraft}
                disabled={loading}
              >
                Clear
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={handleApplyFilters}
                disabled={loading}
              >
                Apply filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Search box */}
        <Input
          placeholder="Search description/category..."
          className="h-9 w-full sm:w-80"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2 p-3 pt-0 sm:p-4">
        {loading ? (
          <ul className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-xl border bg-card/50 p-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-5 w-64" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </li>
            ))}
          </ul>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border bg-muted/30 p-8 text-sm text-muted-foreground">
            No expenses found.
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((r) => (
              <li
                key={r.id}
                className="group flex items-center justify-between rounded-xl border bg-card/50 p-5 transition hover:bg-muted/40"
              >
                {/* Left side: date + description + category */}
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="shrink-0 text-sm leading-6 text-muted-foreground">
                    {fmtLongDate(r.date)}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-lg font-semibold leading-7">
                      {r.description}
                    </div>

                    <div className="mt-1">
                      {r.category ? (
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: r.category_color ?? "#334155",
                            color: "#fff",
                          }}
                          title={r.category ?? ""}
                        >
                          {r.category}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No category
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: amount + actions */}
                <div className="ml-3 flex items-center gap-2 sm:gap-3">
                  <div className="text-right text-lg font-semibold tabular-nums">
                    ₱{r.amount.toFixed(2)}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-muted"
                      >
                        <MoreVertical className="size-5" />
                        <span className="sr-only">Row actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        className="gap-2"
                        onClick={() => onEdit?.(r)}
                      >
                        <Pencil className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 text-red-600 focus:text-red-600"
                        onClick={() => onDelete?.(r)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
