export const formatCurrency = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const formatCurrencyFull = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatDate = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
};

export const formatDateShort = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
};

export const statusLabel: Record<string, string> = {
  planejamento: "Planejamento",
  em_andamento: "Em andamento",
  pausada: "Pausada",
  concluida: "Concluída",
  pendente: "Pendente",
  solicitado: "Solicitado",
  comprado: "Comprado",
  entregue: "Entregue",
  usado: "Usado",
  disponivel: "Disponível",
  analise: "Em Análise",
  adquirido: "Adquirido",
  em_obra: "Em Obra",
  vendido: "Vendido",
};

export const funcaoLabel: Record<string, string> = {
  engenheiro: "Engenheiro(a)",
  mestre: "Mestre de obras",
  pedreiro: "Pedreiro",
  servente: "Servente",
  eletricista: "Eletricista",
  encanador: "Encanador",
  outro: "Outro",
};

export const categoriaLabel: Record<string, string> = {
  material: "Material",
  mao_de_obra: "Mão de obra",
  equipamento: "Equipamento",
  servico: "Serviço",
  imposto: "Imposto",
  outro: "Outro",
};
