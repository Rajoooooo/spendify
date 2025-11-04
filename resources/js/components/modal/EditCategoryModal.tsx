import * as React from "react";
import { useForm } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

type Category = { id: number | string; name: string; color?: string | null };

export default function EditCategoryModal({
  open,
  onOpenChange,
  category,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  category: Category | null;
}) {
  const [successOpen, setSuccessOpen] = React.useState(false);

  const form = useForm({
    name: category?.name ?? "",
    color: category?.color ?? "#94a3b8",
  });

  React.useEffect(() => {
    form.setData({
      name: category?.name ?? "",
      color: category?.color ?? "#94a3b8",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category?.id]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;
    form.put(`/expense/category/${category.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        onOpenChange(false);
        setSuccessOpen(true);
      },
      // ask Inertia to use XHR (will fallback anyway)
      only: [],
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={form.data.name}
                onChange={(e) => form.setData("name", e.target.value)}
              />
              {form.errors.name && (
                <p className="text-xs text-red-600">{form.errors.name}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="edit-color">Color</Label>
              <input
                id="edit-color"
                type="color"
                value={form.data.color}
                onChange={(e) => form.setData("color", e.target.value)}
                className="h-10 w-12 cursor-pointer rounded-md border p-0"
              />
              {form.errors.color && (
                <p className="text-xs text-red-600">{form.errors.color}</p>
              )}
            </div>

            <DialogFooter className="pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.processing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.processing}>
                {form.processing ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green-600" />
              Category updated
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            Your changes have been saved.
          </div>
          <DialogFooter className="pt-1">
            <Button onClick={() => setSuccessOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
