import * as React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderOpen, MoreVertical, Pencil, Archive, Eye, CheckCircle2, Undo2 } from "lucide-react";
import EditCategoryModal from "./EditCategoryModal";

type Category = { id: number | string; name: string; color?: string | null; archived?: boolean };

function csrf(): string {
  const m = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
  return m?.content ?? "";
}

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
  const [showArchived, setShowArchived] = React.useState(false);

  // edit modal
  const [editOpen, setEditOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Category | null>(null);

  // success dialogs
  const [archiveSuccessOpen, setArchiveSuccessOpen] = React.useState(false);
  const [unarchiveSuccessOpen, setUnarchiveSuccessOpen] = React.useState(false);
  const [actionName, setActionName] = React.useState("");

  async function fetchRows(archived: boolean) {
    setLoading(true);
    try {
      const res = await fetch(`/expense/categories?archived=${archived ? 1 : 0}`, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
        cache: "no-store",
      });
      const data: Category[] = await res.json();
      setRows(data);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (open) fetchRows(showArchived);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, showArchived]);

  async function onArchive(cat: Category) {
    const res = await fetch(`/expense/category/${cat.id}/archive`, {
      method: "PUT",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-TOKEN": csrf(),
        "Accept": "application/json",
      },
    });
    if (res.ok) {
      setActionName(cat.name);
      setArchiveSuccessOpen(true);
      setShowArchived(true);     // switch to archived tab
      await fetchRows(true);     // refresh archived list
    }
  }

  async function onUnarchive(cat: Category) {
    const res = await fetch(`/expense/category/${cat.id}/unarchive`, {
      method: "PUT",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-TOKEN": csrf(),
        "Accept": "application/json",
      },
    });
    if (res.ok) {
      setActionName(cat.name);
      setUnarchiveSuccessOpen(true);
      setShowArchived(false);    // switch back to active tab
      await fetchRows(false);    // refresh active list
    }
  }

  function onEdit(cat: Category) {
    setEditing(cat);
    setEditOpen(true);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <FolderOpen className="size-5 text-muted-foreground" />
                Categories
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setShowArchived((v) => !v)}
              >
                <Eye className="size-4" />
                {showArchived ? "See active" : "See archived"}
              </Button>
            </div>
          </DialogHeader>

          <div className="max-h-[360px] overflow-auto pr-1">
            {loading ? (
              <ul className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="flex items-center justify-between rounded-xl border bg-card/30 p-3">
                    <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-10 animate-pulse rounded bg-muted" />
                  </li>
                ))}
              </ul>
            ) : rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No categories found.</p>
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

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="size-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        {!showArchived ? (
                          <>
                            <DropdownMenuItem className="gap-2" onClick={() => onEdit(c)}>
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
                          </>
                        ) : (
                          <DropdownMenuItem className="gap-2" onClick={() => onUnarchive(c)}>
                            <Undo2 className="size-4" />
                            Unarchive
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <hr className="my-2 border-border" />
          <p className="text-xs text-muted-foreground">
            Tip: Use “{showArchived ? "See active" : "See archived"}” to switch lists.
          </p>
        </DialogContent>
      </Dialog>

      {/* Edit modal */}
      <EditCategoryModal
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v);
          if (!v) fetchRows(showArchived);
        }}
        category={editing}
      />

      {/* Archive success */}
      <Dialog open={archiveSuccessOpen} onOpenChange={setArchiveSuccessOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green-600" />
              Archived
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            “{actionName}” has been archived.
          </div>
          <DialogFooter className="pt-1">
            <Button onClick={() => setArchiveSuccessOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unarchive success */}
      <Dialog open={unarchiveSuccessOpen} onOpenChange={setUnarchiveSuccessOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green-600" />
              Unarchived
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            “{actionName}” has been moved back to active.
          </div>
          <DialogFooter className="pt-1">
            <Button onClick={() => setUnarchiveSuccessOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
