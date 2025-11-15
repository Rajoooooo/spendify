import * as React from "react";
import { Button } from "@/components/ui/button";
import { BadgeInfo, Save } from "lucide-react";

export default function BudgetControls({
  onEnter,
  onSave,
}: {
  onEnter: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button className="gap-2" onClick={onEnter}>
        <BadgeInfo className="size-4" />
        Enter Budget
      </Button>
      <Button variant="secondary" className="gap-2" onClick={onSave}>
        <Save className="size-4" />
        Save
      </Button>
    </div>
  );
}
