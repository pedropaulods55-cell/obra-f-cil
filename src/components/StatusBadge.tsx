import { cn } from "@/lib/utils";
import { statusLabel } from "@/lib/format";

const styles: Record<string, string> = {
  planejamento: "bg-info/10 text-info border-info/30",
  em_andamento: "bg-primary/10 text-primary border-primary/30",
  pausada: "bg-muted text-muted-foreground border-border",
  concluida: "bg-success/10 text-success border-success/30",
  pendente: "bg-muted text-muted-foreground border-border",
  solicitado: "bg-info/10 text-info border-info/30",
  comprado: "bg-warning/10 text-warning border-warning/30",
  entregue: "bg-success/10 text-success border-success/30",
  usado: "bg-muted text-muted-foreground border-border",
  disponivel: "bg-success/10 text-success border-success/30",
  analise: "bg-info/10 text-info border-info/30",
  adquirido: "bg-primary/10 text-primary border-primary/30",
  em_obra: "bg-warning/10 text-warning border-warning/30",
  vendido: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        styles[status] ?? "bg-muted text-muted-foreground border-border",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel[status] ?? status}
    </span>
  );
}
