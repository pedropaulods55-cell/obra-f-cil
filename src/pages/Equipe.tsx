import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { useMembros, useObras } from "@/hooks/useData";
import { formatCurrency, funcaoLabel } from "@/lib/format";

const Equipe = () => {
  const { items: membros } = useMembros();
  const { items: obras } = useObras();

  const totalDiaria = membros.reduce((s, m) => s + m.diaria, 0);

  return (
    <AppLayout subtitle="Recursos humanos" title="Equipe">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 surface border-border/60">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Total de profissionais</div>
          <div className="font-mono text-3xl font-bold">{membros.length}</div>
        </Card>
        <Card className="p-5 surface border-border/60">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Custo diário</div>
          <div className="font-mono text-3xl font-bold">{formatCurrency(totalDiaria)}</div>
        </Card>
        <Card className="p-5 surface border-border/60">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Estimado/mês</div>
          <div className="font-mono text-3xl font-bold">{formatCurrency(totalDiaria * 22)}</div>
        </Card>
      </div>

      <Card className="p-6 surface border-border/60">
        <h3 className="font-semibold text-lg mb-4">Membros por obra</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border/60">
                <th className="text-left py-2 font-medium">Nome</th>
                <th className="text-left font-medium">Função</th>
                <th className="text-left font-medium">Obra</th>
                <th className="text-left font-medium">Telefone</th>
                <th className="text-right font-medium">Diária</th>
              </tr>
            </thead>
            <tbody>
              {membros.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Nenhum membro cadastrado.</td></tr>}
              {membros.map((m) => {
                const obra = obras.find((o) => o.id === m.obraId);
                return (
                  <tr key={m.id} className="border-b border-border/40 hover:bg-muted/20">
                    <td className="py-3 font-medium">{m.nome}</td>
                    <td className="text-muted-foreground">{funcaoLabel[m.funcao]}</td>
                    <td className="text-muted-foreground">{obra?.nome ?? "—"}</td>
                    <td className="text-muted-foreground">{m.telefone ?? "—"}</td>
                    <td className="text-right font-mono">{formatCurrency(m.diaria)}</td>
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

export default Equipe;
