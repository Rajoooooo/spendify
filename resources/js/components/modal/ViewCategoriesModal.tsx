import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderOpen, MoreVertical, Pencil, Archive } from "lucide-react";

type Category = { id: number | string; name: string; color?: string | null };

export default function ViewCategoriesModal({
  open,
  onOpenChange,
  categories: initial = [],
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  categories?: Category[];
}) {
  const [rows, setRows] = React.useState<Category[]>(initial);
  const [loading, setLoading] = React.useState(false);

  // Fetch fresh categories when the modal opens
  React.useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/expense/categories", {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        });
        if (!res.ok) throw new Error("Failed to load categories");
        const data: Category[] = await res.json();
        if (!ignore) setRows(data);
      } catch {
        if (!ignore) setRows([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (open) load();
    return () => {
      ignore = true;
    };
  }, [open]);

  // Wire these to your real routes/modals later
  function onEdit(cat: Category) {
    console.log("Edit category", cat);
    // e.g., open an EditCategoryModal with cat prefilled
  }
  function onArchive(cat: Category) {
    console.log("Archive category", cat);
    // e.g., POST /expense/category/{id} -> archive
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="size-5 text-muted-foreground" />
            Categories
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[360px] overflow-auto pr-1">
          {loading ? (
            <ul className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-xl border bg-card/30 p-3"
                >
                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-10 animate-pulse rounded bg-muted" />
                </li>
              ))}
            </ul>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          ) : (
            <ul className="space-y-2">
              {rows.map((c) => (
                <li
                  key={c.id}
                  className="group flex items-center justify-between rounded-xl border bg-card/30 p-3 transition hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block size-3 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: c.color ?? "#e2e8f0" }}
                    />
                    <div className="font-medium">{c.name}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {c.color?.toUpperCase() ?? "—"}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="size-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => onEdit(c)}
                        >
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-amber-700 focus:text-amber-700"
                          onClick={() => onArchive(c)}
                        >
                          <Archive className="size-4" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <hr className="my-2 border-border" />
        <p className="text-xs text-muted-foreground">
          Tip: Add or manage categories anytime.
        </p>
      </DialogContent>
    </Dialog>
  );
}
