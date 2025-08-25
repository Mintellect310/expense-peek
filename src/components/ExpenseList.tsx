import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Expense } from "../models/Expense";
import ExpenseItem from "./ExpenseItem";

interface Props {
  data: Expense[];
  onDelete(id: string): void;
}

const ExpenseList: React.FC<Props> = ({ data, onDelete }) => {
  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No expenses yet. Add your first one!</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={data}
      keyExtractor={(x) => x.id}
      renderItem={({ item }) => (
        <ExpenseItem item={item} onDelete={() => onDelete(item.id)} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  empty: { padding: 24, alignItems: "center" },
  emptyText: { color: "#6b7280" },
});

export default ExpenseList;
