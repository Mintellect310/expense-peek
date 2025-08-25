import { Expense } from "../models/Expense";

export interface ExpenseRepository {
  getAll(): Promise<Expense[]>;
  add(exp: Expense): Promise<void>;
  update(exp: Expense): Promise<void>;
  remove(id: string): Promise<void>;
  replaceAll(exps: Expense[]): Promise<void>;
}
