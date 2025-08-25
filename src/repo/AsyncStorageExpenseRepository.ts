import AsyncStorage from "@react-native-async-storage/async-storage";
import { Expense } from "../models/Expense";
import { ExpenseRepository } from "./ExpenseRepository";

const KEY = "EXPENSES_V1";

export class AsyncStorageExpenseRepository implements ExpenseRepository {
  private async read(): Promise<Expense[]> {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Expense[]) : [];
  }
  private async write(xs: Expense[]) { await AsyncStorage.setItem(KEY, JSON.stringify(xs)); }

  async getAll(): Promise<Expense[]> { return this.read(); }
  async add(exp: Expense): Promise<void> {
    const xs = await this.read();
    xs.push(exp);
    await this.write(xs);
  }
  async update(exp: Expense): Promise<void> {
    const xs = await this.read();
    const idx = xs.findIndex(e => e.id === exp.id);
    if (idx >= 0) xs[idx] = exp;
    await this.write(xs);
  }
  async remove(id: string): Promise<void> {
    const xs = await this.read();
    await this.write(xs.filter(e => e.id !== id));
  }
  async replaceAll(exps: Expense[]): Promise<void> { await this.write(exps); }
}
