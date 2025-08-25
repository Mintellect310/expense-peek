import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { AsyncStorageExpenseRepository } from "../repo/AsyncStorageExpenseRepository";
import { useExpenses, Range } from "../hooks/useExpenses";
import ExpenseList from "../components/ExpenseList";
import AddExpenseModal from "../components/AddExpenseModal";
import type { RootStackParamList } from "../../App";

const repo = new AsyncStorageExpenseRepository();

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { visible, loading, totalCents, range, setRange, add, remove } = useExpenses(repo);
  const [showAdd, setShowAdd] = useState(false);

  const rangeToggleLabel = useMemo<Range>(() => (range === "This Month" ? "All" : "This Month"), [range]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar: total + filter + insights */}
      <View style={styles.topRow}>
        <Text style={styles.totalText}>Total: {formatMoney(totalCents)}</Text>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => setRange(rangeToggleLabel)}
            android_ripple={{ color: "#fee2e2", radius: 20 }}
            style={({ pressed }) => [styles.filterBtn, pressed && { opacity: 0.85 }]}
          >
            <Ionicons name="calendar-outline" size={18} color="#9a3412" />
            <Text style={styles.filterText}>{range}</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Insights")}
            android_ripple={{ color: "#dbeafe", radius: 20 }}
            style={({ pressed }) => [styles.insightsBtn, pressed && { opacity: 0.9 }]}
          >
            <Ionicons name="pie-chart-outline" size={18} color="#1e40af" />
            <Text style={styles.insightsText}>Insights</Text>
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator /></View>
      ) : (
        <ExpenseList data={visible} onDelete={remove} />
      )}

      {/* FAB */}
      <Pressable
        accessibilityLabel="Add expense"
        onPress={() => setShowAdd(true)}
        android_ripple={{ color: "#93c5fd", radius: 28 }}
        style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.96 }] }]}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      <AddExpenseModal visible={showAdd} onClose={() => setShowAdd(false)} onAdd={add} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#ffe4d6",
  },
  totalText: { fontSize: 18, fontWeight: "800" },
  filterBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1, borderColor: "#fed7aa", backgroundColor: "#fff7ed", borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  filterText: { color: "#9a3412", fontWeight: "700" },
  insightsBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1, borderColor: "#bfdbfe", backgroundColor: "#eff6ff", borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  insightsText: { color: "#1e40af", fontWeight: "700" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  fab: {
    position: "absolute", right: 16, bottom: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#2563eb", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
  },
});

export default HomeScreen;
