import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { useObras, useLancamentos, useMembros, useMateriais, usePropriedades } from "@/hooks/useData";
import { formatCurrency } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";
import { NovaObraDialog } from "@/components/NovaObraDialog";
import { Link } from "react-router-dom";
import { ArrowUpRight, HardHat, TrendingUp, TrendingDown, Users, Package, MapPin, Euro } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';

const Dashboard = () => {
  const { items: obras } = useObras();
  const { items: lancamentos } = useLancamentos();
  const { items: membros } = useMembros();
  const { items: materiais } = useMateriais();
  const { items: propriedades } = usePropriedades();

  const ativas = obras.filter((o) => o.status === "em_andamento").length;
  const orcamentoTotal = obras.reduce((s, o) => s + o.orcamento, 0);
  const receitas = lancamentos.filter((l) => l.tipo === "receita").reduce((s, l) => s + l.valor, 0);
  const despesas = lancamentos.filter((l) => l.tipo === "despesa").reduce((s, l) => s + l.valor, 0);

  // Dados para o gráfico de fluxo de caixa (mock baseado nos lançamentos reais)
  const chartData = [
    { name: 'Jan', receitas: receitas * 0.2, despesas: despesas * 0.3 },
    { name: 'Fev', receitas: receitas * 0.4, despesas: despesas * 0.5 },
    { name: 'Mar', receitas: receitas * 0.7, despesas: despesas * 0.6 },
    { name: 'Abr', receitas: receitas, despesas: despesas },
  ];

  const kpis = [
    { label: "Obras ativas", value: ativas, sub: `${obras.length} no total`, icon: HardHat, color: "text-primary" },
    { label: "Orçamento total", value: formatCurrency(orcamentoTotal), sub: "Carteira de obras", icon: TrendingUp, color: "text-blue-500" },
    { label: "Receitas", value: formatCurrency(receitas), sub: "Medições recebidas", icon: TrendingUp, color: "text-emerald-500" },
    { label: "Despesas", value: formatCurrency(despesas), sub: "Custos lançados", icon: TrendingDown, color: "text-rose-500" },
  ];

  return (
    <AppLayout
      subtitle="Costa del Sol Real Estate & Construction"
      title="Painel de Controle"
      actions={<NovaObraDialog />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5 surface border-border/60 hover:border-primary/30 transition-all shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{k.label}</span>
              <div className={`p-2 rounded-lg bg-muted/50 ${k.color}`}>
                <k.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight font-mono">{k.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{k.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 p-6 surface border-border/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold">Fluxo de Caixa</h2>
              <p className="text-sm text-muted-foreground">Evolução financeira consolidada.</p>
            </div>
            <div className="flex gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Receitas</div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-rose-500" /> Despesas</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="receitas" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRec)" />
                <Area type="monotone" dataKey="despesas" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorDes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 surface border-border/60 shadow-sm">
          <h2 className="text-lg font-bold mb-1">Propriedades</h2>
          <p className="text-sm text-muted-foreground mb-6">Mapeamento Costa del Sol.</p>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold">Total Mapeado</span>
                </div>
                <span className="font-mono text-xl font-bold">{propriedades.length}</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Imóveis e Terrenos</div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold">Valor em Análise</span>
                </div>
              </div>
              <div className="font-mono text-xl font-bold">
                {formatCurrency(propriedades.reduce((s, p) => s + p.preco, 0)).replace('R$', '€')}
              </div>
              <Link to="/propriedades" className="text-[10px] uppercase tracking-widest text-primary hover:underline mt-2 block">
                Ver portfólio completo →
              </Link>
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Recursos Ativos</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/40 text-center">
                  <Users className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                  <div className="text-lg font-bold font-mono">{membros.length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Equipe</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/40 text-center">
                  <Package className="h-4 w-4 mx-auto mb-1 text-amber-500" />
                  <div className="text-lg font-bold font-mono">{materiais.length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Materiais</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 surface border-border/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold">Obras em Andamento</h2>
              <p className="text-sm text-muted-foreground">Acompanhamento de execução.</p>
            </div>
            <Link to="/obras" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
              Ver todas <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-6">
            {obras.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhuma obra cadastrada ainda.</p>
            )}
            {obras.slice(0, 3).map((o) => (
              <Link key={o.id} to={`/obras/${o.id}`} className="block group">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-bold group-hover:text-primary transition-colors">{o.nome}</div>
                    <div className="text-xs text-muted-foreground">{o.cliente}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={o.status} />
                    <span className="font-mono text-sm font-bold">{o.progresso}%</span>
                  </div>
                </div>
                <Progress value={o.progresso} className="h-1.5" />
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6 surface border-border/60 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Saldo por Obra</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={obras.slice(0, 5).map(o => ({ name: o.nome.split(' ')[0], saldo: o.orcamento * 0.15 }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} />
                <Tooltip 
                  cursor={{fill: '#88888810'}}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Bar dataKey="saldo" radius={[4, 4, 0, 0]}>
                  {obras.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.6)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-1">Margem Provisória Total</div>
            <div className="font-mono text-xl font-bold text-emerald-700">{formatCurrency(receitas - despesas)}</div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
