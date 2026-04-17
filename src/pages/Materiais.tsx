import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { useMateriais, useObras } from "@/hooks/useData";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

const Materiais = () => {
  const { items: materiais } = useMateriais();
  const { items: obras } = useObras();

  const total = materiais.reduce((s, m) => s + m.precoUnit * m.quantidade, 0);

  return (
    <AppLayout subtitle="Suprimentos" title="Materiais">
      <Card className="p-5 surface border-border/60 mb-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Custo total de materiais</div>
        <div className="font-mono text-3xl font-bold">{formatCurrency(total)}</div>
      </Card>

      <Card className="p-6 surface border-border/60">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border/60">
                <th className="text-left py-2 font-medium">Material</th>
                <th className="text-left font-medium">Obra</th>
                <th className="text-left font-medium">Qtd</th>
                <th className="text-right font-medium">Total</th>
                <th className="text-left pl-4 font-medium">Status</th>
                <th className="text-left font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {materiais.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Nenhum material cadastrado.</td></tr>}
              {materiais.map((m) => {
                const obra = obras.find((o) => o.id === m.obraId);
                return (
                  <tr key={m.id} className="border-b border-border/40 hover:bg-muted/20">
                    <td className="py-3">
                      <div className="font-medium">{m.nome}</div>
                      <div className="text-xs text-muted-foreground">{m.fornecedor || "—"}</div>
                    </td>
                    <td className="text-muted-foreground">{obra?.nome ?? "—"}</td>
                    <td className="font-mono">{m.quantidade} {m.unidade}</td>
                    <td className="text-right font-mono font-semibold">{formatCurrency(m.precoUnit * m.quantidade)}</td>
                    <td className="pl-4"><StatusBadge status={m.status} /></td>
                    <td className="font-mono text-xs">{formatDate(m.data)}</td>
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

export default Materiais;
