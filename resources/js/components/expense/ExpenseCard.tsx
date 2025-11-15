import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "green" | "blue" | "amber" | "rose";

const palette: Record<
  Variant,
  { bg: string; border: string; text: string; ring: string }
> = {
  green: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    ring: "ring-emerald-100",
  },
  blue: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
    ring: "ring-sky-100",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    ring: "ring-amber-100",
  },
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    ring: "ring-rose-100",
  },
};

export default function ExpenseCard({
  title,
  value,
  hint,
  icon,
  loading,
  variant = "green",
}: {
  title: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  loading?: boolean;
  variant?: Variant;
}) {
  const c = palette[variant];

  return (
    <Card
      className={cn(
        "rounded-2xl shadow-sm ring-1",
        c.bg,
        c.border,
        c.ring,
        "border-0"
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle
          className={cn("text-sm/5 font-medium flex items-center gap-2", c.text)}
        >
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        {loading ? (
          <>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-2 h-4 w-40" />
          </>
        ) : (
          <>
            <div className={cn("text-3xl font-semibold", c.text)}>{value}</div>
            {hint && <p className={cn("mt-1 text-xs/5", c.text)}>{hint}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}
