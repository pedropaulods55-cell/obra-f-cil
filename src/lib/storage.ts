import { useEffect, useState, useCallback } from "react";

const PREFIX = "construo:";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(`storage:${key}`));
}

export function useLocalCollection<T extends { id: string }>(key: string, seed: T[] = []) {
  const [items, setItems] = useState<T[]>(() => {
    const existing = read<T[] | null>(key, null);
    if (existing === null) {
      write(key, seed);
      return seed;
    }
    return existing;
  });

  useEffect(() => {
    const handler = () => setItems(read<T[]>(key, []));
    window.addEventListener(`storage:${key}`, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(`storage:${key}`, handler);
      window.removeEventListener("storage", handler);
    };
  }, [key]);

  const add = useCallback((item: T) => {
    const next = [...read<T[]>(key, []), item];
    write(key, next);
  }, [key]);

  const update = useCallback((id: string, patch: Partial<T>) => {
    const next = read<T[]>(key, []).map((it) => (it.id === id ? { ...it, ...patch } : it));
    write(key, next);
  }, [key]);

  const remove = useCallback((id: string) => {
    const next = read<T[]>(key, []).filter((it) => it.id !== id);
    write(key, next);
  }, [key]);

  const replaceAll = useCallback((next: T[]) => write(key, next), [key]);

  return { items, add, update, remove, replaceAll };
}

export const storageKeys = {
  obras: "obras",
  etapas: "etapas",
  tarefas: "tarefas",
  membros: "membros",
  materiais: "materiais",
  lancamentos: "lancamentos",
  diarios: "diarios",
  propriedades: "propriedades",
} as const;
