import { useLocalCollection, storageKeys } from "@/lib/storage";
import {
  seedObras,
  seedEtapas,
  seedTarefas,
  seedMembros,
  seedMateriais,
  seedLancamentos,
  seedPropriedades,
} from "@/lib/seed";
import type { Obra, Etapa, Tarefa, Membro, Material, Lancamento, Diario, Propriedade } from "@/types";

export const useObras = () => useLocalCollection<Obra>(storageKeys.obras, seedObras);
export const useEtapas = () => useLocalCollection<Etapa>(storageKeys.etapas, seedEtapas);
export const useTarefas = () => useLocalCollection<Tarefa>(storageKeys.tarefas, seedTarefas);
export const useMembros = () => useLocalCollection<Membro>(storageKeys.membros, seedMembros);
export const useMateriais = () => useLocalCollection<Material>(storageKeys.materiais, seedMateriais);
export const useLancamentos = () => useLocalCollection<Lancamento>(storageKeys.lancamentos, seedLancamentos);
export const useDiarios = () => useLocalCollection<Diario>(storageKeys.diarios, []);
export const usePropriedades = () => useLocalCollection<Propriedade>(storageKeys.propriedades, seedPropriedades);
