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
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

export type ExpenseRow = {
  id: number | string;
  date: string;                 // YYYY-MM-DD
  description: string;
  category?: string | null;
  category_color?: string | null;
  amount: number;
};

// Safe formatter for YYYY-MM-DD -> "November 10, 2025"
function fmtLongDate(isoDate: string) {
  // Avoid timezone shift by forcing midnight
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

  const filtered = React.useMemo(() => {
    if (loading) return [];
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.description.toLowerCase().includes(q) ||
        (r.category ?? "").toLowerCase().includes(q)
    );
  }, [rows, query, loading]);

  return (
    <Card className="overflow-hidden rounded-2xl">
      {/* small utility bar (no title/header) */}
      <div className="flex justify-end p-4">
        <Input
          placeholder="Search description/category..."
          className="h-9 w-full sm:w-80"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Body */}
      <div className="space-y-2 p-3 sm:p-4 pt-0">
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
                {/* Left – date + description + category */}
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="shrink-0 text-sm text-muted-foreground leading-6">
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

                {/* Right – amount + actions */}
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
