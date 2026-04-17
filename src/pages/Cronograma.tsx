import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { useEtapas, useObras } from "@/hooks/useData";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";
import { Link } from "react-router-dom";

const Cronograma = () => {
  const { items: obras } = useObras();
  const { items: etapas } = useEtapas();

  return (
    <AppLayout subtitle="Planejamento" title="Cronograma geral">
      <div className="space-y-6">
        {obras.map((o) => {
          const obraEtapas = etapas.filter((e) => e.obraId === o.id).sort((a, b) => a.ordem - b.ordem);
          if (obraEtapas.length === 0) return null;
          return (
            <Card key={o.id} className="p-6 surface border-border/60">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <Link to={`/obras/${o.id}`} className="font-semibold text-lg hover:text-primary transition-colors">{o.nome}</Link>
                  <p className="text-sm text-muted-foreground">{o.cliente}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
              <div className="space-y-2">
                {obraEtapas.map((e) => (
                  <div key={e.id} className="grid grid-cols-12 gap-3 items-center p-3 rounded-md bg-muted/30 border border-border/50">
                    <div className="col-span-12 md:col-span-4">
                      <div className="font-medium text-sm">{e.nome}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(e.inicio)} → {formatDate(e.fim)}</div>
                    </div>
                    <div className="col-span-9 md:col-span-6">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${e.status === "concluida" ? "bg-success" : e.status === "em_andamento" ? "bg-primary" : "bg-muted-foreground/30"}`} style={{ width: e.status === "concluida" ? "100%" : e.status === "em_andamento" ? "55%" : "0%" }} />
                      </div>
                    </div>
                    <div className="col-span-3 md:col-span-2 flex justify-end">
                      <StatusBadge status={e.status} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
        {obras.length === 0 && (
          <Card className="p-12 text-center surface border-dashed border-border/60">
            <p className="text-muted-foreground">Nenhuma obra cadastrada.</p>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Cronograma;
