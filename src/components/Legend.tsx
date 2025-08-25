import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Row = { label: string; value: number; color: string };

function formatMoney(n: number) { return `$${n.toFixed(2)}`; }

const Legend: React.FC<{ data: Row[] }> = ({ data }) => {
  if (data.length === 0) return null;
  return (
    <View style={styles.wrap}>
      {data.map((d) => (
        <View key={d.label} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: d.color }]} />
          <Text style={styles.label} numberOfLines={1}>{d.label}</Text>
          <Text style={styles.value}>{formatMoney(d.value)}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 12, gap: 8 },
  row: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#e5e7eb"
  },
  dot: { width: 12, height: 12, borderRadius: 6 },
  label: { flex: 1, fontWeight: "600" },
  value: { fontWeight: "800" },
});

export default Legend;
