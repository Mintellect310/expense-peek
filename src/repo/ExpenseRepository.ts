import { Expense } from "../models/Expense";

/** SOLID: DIP — screens/hooks depend on this interface, not storage details */
export interface ExpenseRepository {
  getAll(): Promise<Expense[]>;
  add(exp: Expense): Promise<void>;
  update(exp: Expense): Promise<void>;
  remove(id: string): Promise<void>;
  replaceAll(exps: Expense[]): Promise<void>;
}
