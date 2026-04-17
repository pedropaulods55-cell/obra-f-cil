export type ObraStatus = "planejamento" | "em_andamento" | "pausada" | "concluida";

export interface Obra {
  id: string;
  nome: string;
  cliente: string;
  endereco: string;
  descricao?: string;
  status: ObraStatus;
  dataInicio: string; // ISO
  dataFimPrevista: string; // ISO
  orcamento: number;
  progresso: number; // 0-100
  createdAt: string;
}

export type EtapaStatus = "pendente" | "em_andamento" | "concluida";

export interface Etapa {
  id: string;
  obraId: string;
  nome: string;
  descricao?: string;
  inicio: string;
  fim: string;
  status: EtapaStatus;
  ordem: number;
}

export interface Tarefa {
  id: string;
  obraId: string;
  etapaId?: string;
  titulo: string;
  responsavel?: string;
  prazo?: string;
  concluida: boolean;
}

export type MembroFuncao = "engenheiro" | "mestre" | "pedreiro" | "servente" | "eletricista" | "encanador" | "outro";

export interface Membro {
  id: string;
  obraId: string;
  nome: string;
  funcao: MembroFuncao;
  telefone?: string;
  diaria: number;
}

export type MaterialStatus = "solicitado" | "comprado" | "entregue" | "usado";

export interface Material {
  id: string;
  obraId: string;
  nome: string;
  unidade: string; // saco, m³, un...
  quantidade: number;
  precoUnit: number;
  status: MaterialStatus;
  fornecedor?: string;
  data: string;
}

export type LancamentoTipo = "receita" | "despesa";
export type LancamentoCategoria = "material" | "mao_de_obra" | "equipamento" | "servico" | "imposto" | "outro";

export interface Lancamento {
  id: string;
  obraId: string;
  tipo: LancamentoTipo;
  categoria: LancamentoCategoria;
  descricao: string;
  valor: number;
  data: string;
  pago: boolean;
}

export interface Diario {
  id: string;
  obraId: string;
  data: string;
  clima?: string;
  observacoes: string;
  ocorrencias?: string;
}

export type PropriedadeTipo = "terreno" | "apartamento" | "moradia" | "comercial";
export type PropriedadeStatus = "disponivel" | "analise" | "adquirido" | "em_obra" | "vendido";

export interface Propriedade {
  id: string;
  nome: string;
  tipo: PropriedadeTipo;
  status: PropriedadeStatus;
  endereco: string;
  cidade: string;
  area: number;
  preco: number;
  descricao?: string;
  coordenadas?: { lat: number; lng: number };
  fotos?: string[];
}
