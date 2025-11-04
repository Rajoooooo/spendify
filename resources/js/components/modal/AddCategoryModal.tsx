import * as React from "react";
import { useForm } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Palette, PlusCircle, ListChecks, CheckCircle2 } from "lucide-react";
import ViewCategoriesModal from "./ViewCategoriesModal";

type Category = { id: number | string; name: string; color?: string | null };

export default function AddCategoryModal({
  children,
  categories = [],
}: {
  children?: React.ReactNode; // usually a Button
  categories?: Category[];    // pass from page for the viewer modal
}) {
  const [open, setOpen] = React.useState(false);
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);

  const form = useForm({
    name: "",
    color: "#94a3b8",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.post("/expense/category", {
      preserveScroll: true,
      onSuccess: () => {
        setOpen(false);
        setSuccessOpen(true);
        form.reset();
      },
    });
  }

  const canSave = form.data.name.trim().length > 0 && !form.processing;

  return (
    <>
      {/* Add category modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children ?? (
            <Button variant="secondary" className="gap-2">
              <PlusCircle className="size-4" />
              Add category
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="size-5 text-muted-foreground" />
              New category
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="grid gap-4">
            {/* 2-column row: big Name field + short Color swatch */}
            <div className="grid grid-cols-[1fr_auto] items-end gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="cat-name">Name</Label>
                <Input
                  id="cat-name"
                  autoFocus
                  placeholder="e.g., Groceries"
                  value={form.data.name}
                  onChange={(e) => form.setData("name", e.target.value)}
                />
                {form.errors.name && (
                  <p className="text-xs text-red-600">{form.errors.name}</p>
                )}
              </div>

              <div className="grid justify-items-center gap-1.5">
                <Label
                  htmlFor="cat-color"
                  className="text-xs text-muted-foreground"
                >
                  Color
                </Label>
                <input
                  id="cat-color"
                  type="color"
                  value={form.data.color}
                  onChange={(e) => form.setData("color", e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-md border p-0"
                />
                <span className="text-[10px] tracking-wide text-muted-foreground">
                  {form.data.color.toUpperCase()}
                </span>
                {form.errors.color && (
                  <p className="text-xs text-red-600">{form.errors.color}</p>
                )}
              </div>
            </div>

            <DialogFooter className="pt-1">
              <Button
                type="button"
                variant="ghost"
                className="mr-auto gap-2"
                onClick={() => setViewerOpen(true)}
              >
                <ListChecks className="size-4" />
                View categories
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={form.processing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canSave} className="gap-2">
                {form.processing ? "Saving..." : "Add category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green-600" />
              Successfully created
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            Your category has been added. You can now assign expenses to it.
          </div>
          <DialogFooter className="pt-1">
            <Button onClick={() => setSuccessOpen(false)} autoFocus>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Viewer modal */}
      <ViewCategoriesModal
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        categories={categories}
      />
    </>
  );
}
