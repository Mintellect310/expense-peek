import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Category } from "../models/Expense";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES: Category[] = ["Food", "Transport", "Bills", "Shopping", "Fun", "Other"];

interface Props {
  visible: boolean;
  onClose(): void;
  onAdd(title: string, amountCents: number, category: Category, dateISO: string): void;
}

const AddExpenseModal: React.FC<Props> = ({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(""); // dollars string
  const [category, setCategory] = useState<Category>("Food");
  const [dateISO, setDateISO] = useState<string>(new Date().toISOString().slice(0, 10));

  const canAdd = title.trim().length > 0 && Number(amount) > 0;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.heading}>Add Expense</Text>

          <TextInput
            placeholder="Title (e.g., Coffee)"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Amount (e.g., 4.50)"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />
          <TextInput
            placeholder="Date (YYYY-MM-DD)"
            value={dateISO}
            onChangeText={setDateISO}
            style={styles.input}
          />

          <View style={styles.catRow}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  styles.chip,
                  category === c && styles.chipActive,
                ]}
              >
                <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={styles.btnGhost}>
              <Ionicons name="close" size={18} />
              <Text style={styles.btnGhostText}>Cancel</Text>
            </Pressable>
            <Pressable
              disabled={!canAdd}
              onPress={() => {
                const dollars = Number(amount.replace(/[^0-9.]/g, "")); // strips $, spaces, etc.
                const cents = Math.round(dollars * 100);
                if (!Number.isFinite(cents) || cents <= 0) return; // extra safety
                onAdd(title.trim(), cents, category, dateISO);
                setTitle(""); setAmount(""); setCategory("Food"); setDateISO(new Date().toISOString().slice(0,10));
                onClose();
              }}
              style={[styles.btnPrimary, !canAdd && { opacity: 0.5 }]}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.btnPrimaryText}>Add</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex:1, backgroundColor:"rgba(0,0,0,0.2)", justifyContent:"flex-end" },
  card: { backgroundColor:"#fff", padding:16, borderTopLeftRadius:16, borderTopRightRadius:16, gap:10 },
  heading: { fontSize:18, fontWeight:"800" },
  input: { borderWidth:1, borderColor:"#d1d5db", borderRadius:10, paddingHorizontal:12, paddingVertical:8 },
  catRow: { flexDirection:"row", flexWrap:"wrap", gap:8, marginTop:4 },
  chip: { borderWidth:1, borderColor:"#d1d5db", borderRadius:999, paddingHorizontal:10, paddingVertical:6 },
  chipActive: { backgroundColor:"#eef2ff", borderColor:"#c7d2fe" },
  chipText: { color:"#374151" },
  chipTextActive: { color:"#1d4ed8", fontWeight:"700" },
  actions: { flexDirection:"row", justifyContent:"flex-end", gap:10, marginTop:6 },
  btnGhost: { flexDirection:"row", alignItems:"center", gap:6, paddingHorizontal:10, paddingVertical:8 },
  btnGhostText: { fontWeight:"600" },
  btnPrimary: { flexDirection:"row", alignItems:"center", gap:6, backgroundColor:"#2563eb", paddingHorizontal:14, paddingVertical:10, borderRadius:10 },
  btnPrimaryText: { color:"#fff", fontWeight:"700" },
});

export default AddExpenseModal;
