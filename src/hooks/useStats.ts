import { useMemo } from "react";
import { Expense } from "../models/Expense";

/** SRP: derives chart-ready data from a list of expenses */
export function useStats(expenses: Expense[]) {
  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + e.amountCents);
    // convert to array of {x, y}
    return Array.from(map.entries()).map(([cat, cents]) => ({ x: cat, y: Math.max(cents / 100, 0.01) }));
  }, [expenses]);

  const topLine = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amountCents, 0) / 100;
    return { total };
  }, [expenses]);

  return { byCategory, topLine };
}
