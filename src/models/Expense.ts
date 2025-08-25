export type Category = "Food" | "Transport" | "Bills" | "Shopping" | "Fun" | "Other";

export interface Expense {
  id: string;
  title: string;
  amountCents: number;   // store as integer cents
  category: Category;
  dateISO: string;       // e.g., "2025-08-24"
}
