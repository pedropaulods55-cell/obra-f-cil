import { v4 as uuid } from "uuid";
import type { Obra, Etapa, Membro, Material, Lancamento, Tarefa, Propriedade } from "@/types";

const obraId1 = uuid();
const obraId2 = uuid();

export const seedObras: Obra[] = [
  {
    id: obraId1,
    nome: "Residencial Vista Verde",
    cliente: "Construtora Horizonte",
    endereco: "Rua das Palmeiras, 240 — São Paulo/SP",
    descricao: "Edifício residencial de 8 pavimentos com 32 unidades.",
    status: "em_andamento",
    dataInicio: "2025-01-15",
    dataFimPrevista: "2026-09-30",
    orcamento: 4_800_000,
    progresso: 42,
    createdAt: new Date().toISOString(),
  },
  {
    id: obraId2,
    nome: "Galpão Logístico Norte",
    cliente: "Mercado Logix",
    endereco: "Av. Industrial, 1500 — Guarulhos/SP",
    descricao: "Galpão de 4.200 m² com mezanino administrativo.",
    status: "planejamento",
    dataInicio: "2026-05-01",
    dataFimPrevista: "2027-02-28",
    orcamento: 2_100_000,
    progresso: 8,
    createdAt: new Date().toISOString(),
  },
];

export const seedEtapas: Etapa[] = [
  { id: uuid(), obraId: obraId1, nome: "Fundação", inicio: "2025-01-15", fim: "2025-04-30", status: "concluida", ordem: 1 },
  { id: uuid(), obraId: obraId1, nome: "Estrutura", inicio: "2025-05-01", fim: "2025-10-15", status: "em_andamento", ordem: 2 },
  { id: uuid(), obraId: obraId1, nome: "Alvenaria", inicio: "2025-09-01", fim: "2026-01-30", status: "em_andamento", ordem: 3 },
  { id: uuid(), obraId: obraId1, nome: "Instalações", inicio: "2026-02-01", fim: "2026-05-30", status: "pendente", ordem: 4 },
  { id: uuid(), obraId: obraId1, nome: "Acabamento", inicio: "2026-06-01", fim: "2026-09-30", status: "pendente", ordem: 5 },
];

export const seedTarefas: Tarefa[] = [
  { id: uuid(), obraId: obraId1, titulo: "Concretagem laje 5º pavimento", responsavel: "Equipe A", prazo: "2025-11-20", concluida: false },
  { id: uuid(), obraId: obraId1, titulo: "Liberar acesso de caminhão betoneira", responsavel: "Mestre João", prazo: "2025-11-18", concluida: true },
  { id: uuid(), obraId: obraId1, titulo: "Inspeção de armaduras pilares P12-P18", responsavel: "Eng. Carla", prazo: "2025-11-22", concluida: false },
];

export const seedMembros: Membro[] = [
  { id: uuid(), obraId: obraId1, nome: "Carla Mendes", funcao: "engenheiro", telefone: "(11) 99000-1010", diaria: 850 },
  { id: uuid(), obraId: obraId1, nome: "João Batista", funcao: "mestre", telefone: "(11) 98888-2020", diaria: 380 },
  { id: uuid(), obraId: obraId1, nome: "Pedro Alves", funcao: "pedreiro", diaria: 220 },
  { id: uuid(), obraId: obraId1, nome: "Lucas Souza", funcao: "servente", diaria: 150 },
];

export const seedMateriais: Material[] = [
  { id: uuid(), obraId: obraId1, nome: "Cimento CP-II", unidade: "saco 50kg", quantidade: 320, precoUnit: 38, status: "entregue", fornecedor: "Construbase", data: "2025-10-12" },
  { id: uuid(), obraId: obraId1, nome: "Vergalhão 10mm", unidade: "barra 12m", quantidade: 180, precoUnit: 62, status: "comprado", fornecedor: "Aço Forte", data: "2025-10-20" },
  { id: uuid(), obraId: obraId1, nome: "Areia média", unidade: "m³", quantidade: 45, precoUnit: 95, status: "solicitado", data: "2025-11-01" },
];

export const seedLancamentos: Lancamento[] = [
  { id: uuid(), obraId: obraId1, tipo: "receita", categoria: "outro", descricao: "Medição parcial #3", valor: 620_000, data: "2025-09-30", pago: true },
  { id: uuid(), obraId: obraId1, tipo: "despesa", categoria: "material", descricao: "Cimento + vergalhão", valor: 23_360, data: "2025-10-12", pago: true },
  { id: uuid(), obraId: obraId1, tipo: "despesa", categoria: "mao_de_obra", descricao: "Folha equipe outubro", valor: 142_000, data: "2025-10-31", pago: true },
  { id: uuid(), obraId: obraId1, tipo: "despesa", categoria: "equipamento", descricao: "Locação grua", valor: 18_500, data: "2025-11-05", pago: false },
];

export const seedPropriedades: Propriedade[] = [
  {
    id: uuid(),
    nome: "Villa Marbella Luxury",
    tipo: "moradia",
    status: "disponivel",
    endereco: "Calle Los Monteros, 15",
    cidade: "Marbella",
    area: 450,
    preco: 2500000,
    descricao: "Villa de luxo com vista para o mar.",
  },
  {
    id: uuid(),
    nome: "Terreno Golden Mile",
    tipo: "terreno",
    status: "analise",
    endereco: "Av. Bulevar Príncipe Alfonso de Hohenlohe",
    cidade: "Marbella",
    area: 1200,
    preco: 1800000,
    descricao: "Terreno prime para desenvolvimento de villa.",
  },
  {
    id: uuid(),
    nome: "Apartamento Puerto Banús",
    tipo: "apartamento",
    status: "vendido",
    endereco: "Muelle de Ribera",
    cidade: "Marbella",
    area: 120,
    preco: 850000,
    descricao: "Apartamento renovado no porto.",
  },
];
