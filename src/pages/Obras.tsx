import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { useObras } from "@/hooks/useData";
import { StatusBadge } from "@/components/StatusBadge";
import { NovaObraDialog } from "@/components/NovaObraDialog";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "@/lib/format";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Obras = () => {
  const { items: obras } = useObras();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("todas");

  const filtradas = obras.filter((o) => {
    const matchQ = !q || o.nome.toLowerCase().includes(q.toLowerCase()) || o.cliente.toLowerCase().includes(q.toLowerCase());
    const matchT = tab === "todas" || o.status === tab;
    return matchQ && matchT;
  });

  return (
    <AppLayout subtitle="Carteira" title="Obras" actions={<NovaObraDialog />}>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <Input placeholder="Buscar por nome ou cliente..." value={q} onChange={(e) => setQ(e.target.value)} className="md:max-w-xs" />
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-muted/40">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="planejamento">Planejamento</TabsTrigger>
            <TabsTrigger value="em_andamento">Em andamento</TabsTrigger>
            <TabsTrigger value="pausada">Pausadas</TabsTrigger>
            <TabsTrigger value="concluida">Concluídas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtradas.length === 0 && (
          <Card className="col-span-full p-12 text-center surface border-dashed border-border/60">
            <p className="text-muted-foreground">Nenhuma obra encontrada.</p>
          </Card>
        )}
        {filtradas.map((o) => (
          <Link key={o.id} to={`/obras/${o.id}`}>
            <Card className="p-5 surface border-border/60 hover:border-primary/40 hover:shadow-elegant transition-all group h-full">
              <div className="flex items-start justify-between mb-4">
                <StatusBadge status={o.status} />
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">{o.nome}</h3>
              <p className="text-sm text-muted-foreground mb-4">{o.cliente}</p>

              <div className="space-y-2 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{o.endereco || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(o.dataInicio)} → {formatDate(o.dataFimPrevista)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-mono font-medium">{o.progresso}%</span>
                </div>
                <Progress value={o.progresso} className="h-1.5" />
              </div>

              <div className="flex items-end justify-between mt-4 pt-4 border-t border-border/60">
                <span className="text-xs text-muted-foreground">Orçamento</span>
                <span className="font-mono font-semibold">{formatCurrency(o.orcamento)}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
};

export default Obras;
