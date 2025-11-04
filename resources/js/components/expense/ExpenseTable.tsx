import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type Row = {
  id: number | string;
  date: string;
  description: string;
  category?: string;
  amount: number;
};

export default function ExpenseTable({
  rows = [],
  loading = false,
}: {
  rows?: Row[];
  loading?: boolean;
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
    <Card className="rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4">
        <h3 className="text-sm font-medium">Table</h3>
        <Input
          placeholder="Search description/category..."
          className="h-9 w-64"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* body */}
      <div className="max-h-[520px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[180px]">Category</TableHead>
              <TableHead className="w-[140px] text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-64" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              : filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-muted-foreground">
                      {r.date}
                    </TableCell>
                    <TableCell className="font-medium">
                      {r.description}
                    </TableCell>
                    <TableCell>
                      {r.category ? (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                          {r.category}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      ₱{r.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
