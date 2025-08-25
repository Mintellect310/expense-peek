import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Expense } from "../models/Expense";
import { Ionicons } from "@expo/vector-icons";

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

// Parse "YYYY-MM-DD" as LOCAL date (not UTC) to avoid off-by-one
function fromLocalISODate(s: string) {
  const [y, m, d] = s.split("-").map((x) => parseInt(x, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}

interface Props {
  item: Expense;
  onDelete(): void;
}

const ExpenseItem: React.FC<Props> = ({ item, onDelete }) => {
  const date = fromLocalISODate(item.dateISO).toLocaleDateString();
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.meta}>{item.category} · {date}</Text>
      </View>
      <Text style={styles.amount}>{formatMoney(item.amountCents)}</Text>
      <Pressable
        onPress={onDelete}
        android_ripple={{ color: "#fee2e2", radius: 18 }}
        style={({ pressed }) => [styles.delBtn, pressed && { opacity: 0.8 }]}
      >
        <Ionicons name="trash-outline" size={18} color="#b91c1c" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 10, paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb",
  },
  title: { fontWeight: "700" },
  meta: { color: "#6b7280", marginTop: 2 },
  amount: { fontWeight: "800", width: 90, textAlign: "right" },
  delBtn: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
});

export default ExpenseItem;
