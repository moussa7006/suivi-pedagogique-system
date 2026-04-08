import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const COLORS = {
  background: "#F8FAFC",
  card: "#FFFFFF",
  primary: "#6366F1",
  primaryLight: "rgba(99, 102, 241, 0.1)",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  success: "#10B981",
};

export default function LessonLogScreen() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [homework, setHomework] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cahier de Texte</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.sessionInfoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="book" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Cours</Text>
                <Text style={styles.infoValue}>Algorithmique Avancée</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="people" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Groupe</Text>
                <Text style={styles.infoValue}>L3 Informatique</Text>
              </View>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Sujet du jour</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Les graphes et algorithmes de cheminement"
              value={topic}
              onChangeText={setTopic}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Résumé de la séance</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Détaillez les points abordés..."
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              placeholderTextColor={COLORS.textSecondary}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Devoirs / Prochaine étape</Text>
            <TextInput
              style={[styles.textInput, styles.homeworkInput]}
              placeholder="Travaux à faire pour la prochaine séance"
              value={homework}
              onChangeText={setHomework}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Enregistrer la séance</Text>
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.card,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textPrimary },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sessionInfoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "600" },
  infoValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: "700" },
  inputSection: { marginBottom: 20 },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginLeft: 4,
  },
  textInput: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 15,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: { height: 120, paddingTop: 15 },
  homeworkInput: { borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  submitBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  submitBtnText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
});
