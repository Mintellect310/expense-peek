import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Pie, PolarChart } from "victory-native";
import { AsyncStorageExpenseRepository } from "../repo/AsyncStorageExpenseRepository";
import { useExpenses } from "../hooks/useExpenses";
import { useStats } from "../hooks/useStats";

const repo = new AsyncStorageExpenseRepository();

function formatMoney(n: number) {
  return `$${n.toFixed(2)}`;
}

// Optional: stable colors per category
const CATEGORY_COLORS: Record<string, string> = {
  Food: "#ef4444",
  Transport: "#10b981",
  Bills: "#f59e0b",
  Shopping: "#8b5cf6",
  Fun: "#3b82f6",
  Other: "#6b7280",
};
function colorFor(label: string) {
  if (CATEGORY_COLORS[label]) return CATEGORY_COLORS[label];
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) | 0;
  const hex = ((h >>> 0) & 0xffffff).toString(16).padStart(6, "0");
  return `#${hex}`;
}

// Inline Legend
type LegendRow = { label: string; value: number; color: string };
const Legend: React.FC<{ data: LegendRow[] }> = ({ data }) => {
  if (data.length === 0) return null;
  return (
    <View style={legendStyles.wrap}>
      {data.map((d) => (
        <View key={d.label} style={legendStyles.row}>
          <View style={[legendStyles.dot, { backgroundColor: d.color }]} />
          <Text style={legendStyles.label} numberOfLines={1}>{d.label}</Text>
          <Text style={legendStyles.value}>{formatMoney(d.value)}</Text>
        </View>
      ))}
    </View>
  );
};

const InsightsScreen: React.FC = () => {
  // Pull visible items & range controls from the shared hook
  const { visible, loading, range, setRange } = useExpenses(repo);
  const { byCategory, topLine } = useStats(visible);

  // Transform to XL data format: { label, value, color }
  const chartData = useMemo(
    () =>
      byCategory.map((d) => ({
        label: d.x,
        value: Number(d.y.toFixed(2)),
        color: colorFor(d.x),
      })),
    [byCategory]
  );

  // Defer chart render by one frame for Skia
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Sizing
  const { width } = Dimensions.get("window");
  const chartSize = Math.min(width - 32, 360);
  const innerR = Math.round(chartSize * 0.28);
  const outerR = Math.round(chartSize * 0.45);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h1}>Spending by Category</Text>
        <Text style={styles.sub}>Total: {formatMoney(topLine.total)}</Text>
      </View>

      {/* Range filter */}
      <View style={filterStyles.row}>
        <Text style={filterStyles.label}>Range:</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => setRange("This Month")}
            android_ripple={{ color: "#e5e7eb", radius: 20 }}
            style={[filterStyles.chip, range === "This Month" && filterStyles.chipActive]}
          >
            <Text style={[filterStyles.chipText, range === "This Month" && filterStyles.chipTextActive]}>
              This Month
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setRange("All")}
            android_ripple={{ color: "#e5e7eb", radius: 20 }}
            style={[filterStyles.chip, range === "All" && filterStyles.chipActive]}
          >
            <Text style={[filterStyles.chipText, range === "All" && filterStyles.chipTextActive]}>
              All
            </Text>
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}><Text>Loading…</Text></View>
      ) : chartData.length === 0 ? (
        <View style={styles.center}><Text style={{ color: "#6b7280" }}>No data yet.</Text></View>
      ) : (
        <>
          <Legend data={chartData} />
          {mounted ? (
            <View style={{ height: chartSize, marginTop: 12 }}>
              <PolarChart
                data={chartData}
                labelKey="label"
                valueKey="value"
                colorKey="color"
                key={`pie-${chartData.length}-${topLine.total}-${range}`}
              >
                <Pie.Chart innerRadius={innerR} />
              </PolarChart>
            </View>
          ) : (
            <View style={{ height: chartSize, alignItems: "center", justifyContent: "center" }}>
              <Text>Preparing chart…</Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb" },
  h1: { fontSize: 18, fontWeight: "800" },
  sub: { color: "#6b7280", marginTop: 4 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});

const legendStyles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 12, gap: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
  },
  dot: { width: 12, height: 12, borderRadius: 6 },
  label: { flex: 1, fontWeight: "600" },
  value: { fontWeight: "800" },
});

const filterStyles = StyleSheet.create({
  row: {
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  label: { fontWeight: "700" },
  chip: {
    borderWidth: 1, borderColor: "#d1d5db",
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6,
  },
  chipActive: { backgroundColor: "#eff6ff", borderColor: "#bfdbfe" },
  chipText: { color: "#374151" },
  chipTextActive: { color: "#1e40af", fontWeight: "700" },
});

export default InsightsScreen;
