import { useCallback, useEffect, useMemo, useState } from "react";
import { Expense, Category } from "../models/Expense";
import { ExpenseRepository } from "../repo/ExpenseRepository";

// add near the top of the file
function makeId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** SOLID: SRP — manages expense state + operations; no rendering here */
export type Range = "This Month" | "All";

export function useExpenses(repo: ExpenseRepository) {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>("This Month");

  const refresh = useCallback(async () => {
    setLoading(true);
    const xs = await repo.getAll();

    // sort by date desc
    xs.sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
    setItems(xs);
    setLoading(false);
  }, [repo]);

  useEffect(() => { refresh(); }, [refresh]);

  const add = useCallback(async (title: string, amountCents: number, category: Category, dateISO: string) => {
    const exp: Expense = { id: makeId(), title, amountCents, category, dateISO };
    await repo.add(exp);

    const after = await repo.getAll();
    console.log("Saved items:", after.length, after);

    await refresh();
  }, [repo, refresh]);

  const remove = useCallback(async (id: string) => {
    await repo.remove(id);
    await refresh();
  }, [repo, refresh]);

  const update = useCallback(async (exp: Expense) => {
    await repo.update(exp);
    await refresh();
  }, [repo, refresh]);

  // filter by range
  const visible = useMemo(() => {
    if (range === "All") return items;
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return items.filter(e => e.dateISO.startsWith(ym));
  }, [items, range]);

  const totalCents = useMemo(() => visible.reduce((sum, e) => sum + e.amountCents, 0), [visible]);

  return { items, visible, loading, range, setRange, totalCents, add, remove, update, refresh };
}
