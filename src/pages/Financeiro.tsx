import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { useLancamentos, useObras } from "@/hooks/useData";
import { formatCurrency, formatDate, categoriaLabel } from "@/lib/format";
import { CheckCircle2, Circle, TrendingDown, TrendingUp, Wallet } from "lucide-react";

const Financeiro = () => {
  const { items: lancamentos } = useLancamentos();
  const { items: obras } = useObras();

  const receitas = lancamentos.filter((l) => l.tipo === "receita").reduce((s, l) => s + l.valor, 0);
  const despesas = lancamentos.filter((l) => l.tipo === "despesa").reduce((s, l) => s + l.valor, 0);
  const aPagar = lancamentos.filter((l) => l.tipo === "despesa" && !l.pago).reduce((s, l) => s + l.valor, 0);

  const kpis = [
    { label: "Receitas", value: formatCurrency(receitas), icon: TrendingUp, color: "text-success" },
    { label: "Despesas", value: formatCurrency(despesas), icon: TrendingDown, color: "text-destructive" },
    { label: "Saldo", value: formatCurrency(receitas - despesas), icon: Wallet, color: "text-primary" },
    { label: "A pagar", value: formatCurrency(aPagar), icon: Circle, color: "text-warning" },
  ];

  return (
    <AppLayout subtitle="Controle" title="Financeiro">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5 surface border-border/60">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{k.label}</span>
              <k.icon className={`h-4 w-4 ${k.color}`} />
            </div>
            <div className="font-mono text-2xl font-bold">{k.value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6 surface border-border/60">
        <h3 className="font-semibold text-lg mb-4">Lançamentos consolidados</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border/60">
                <th className="text-left py-2 font-medium">Data</th>
                <th className="text-left font-medium">Obra</th>
                <th className="text-left font-medium">Descrição</th>
                <th className="text-left font-medium">Categoria</th>
                <th className="text-right font-medium">Valor</th>
                <th className="text-center font-medium">Pago</th>
              </tr>
            </thead>
            <tbody>
              {lancamentos.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Nenhum lançamento.</td></tr>}
              {lancamentos.map((l) => {
                const obra = obras.find((o) => o.id === l.obraId);
                return (
                  <tr key={l.id} className="border-b border-border/40 hover:bg-muted/20">
                    <td className="py-3 font-mono text-xs">{formatDate(l.data)}</td>
                    <td className="text-muted-foreground">{obra?.nome ?? "—"}</td>
                    <td>{l.descricao}</td>
                    <td className="text-muted-foreground">{categoriaLabel[l.categoria]}</td>
                    <td className={`text-right font-mono font-semibold ${l.tipo === "receita" ? "text-success" : "text-destructive"}`}>
                      {l.tipo === "receita" ? "+" : "−"} {formatCurrency(l.valor)}
                    </td>
                    <td className="text-center">
                      {l.pago ? <CheckCircle2 className="h-4 w-4 text-success inline" /> : <Circle className="h-4 w-4 text-muted-foreground inline" />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
};

export default Financeiro;
