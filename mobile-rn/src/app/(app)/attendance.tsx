import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS, RADIUS } from "../../themes/colors";

const { width } = Dimensions.get("window");

export default function AttendanceScreen() {
  const [isValidated, setIsValidated] = useState(false);

  const handleValidation = () => {
    Alert.alert(
      "Confirmation d'émargement",
      "Voulez-vous signer votre présence pour la séance : Algorithmique Avancée ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Signer maintenant", 
          onPress: () => setIsValidated(true) 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* --- Massive Header --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Émargement</Text>
          <Text style={styles.headerSubtitle}>Certification de présence enseignant</Text>
        </View>
        <View style={[styles.statusPill, isValidated ? styles.statusPillValid : styles.statusPillPending]}>
          <Text style={[styles.statusPillText, isValidated ? styles.statusPillTextValid : styles.statusPillTextPending]}>
            {isValidated ? "CERTIFIÉ" : "EN ATTENTE"}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- Current Session Card --- */}
        <View style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <View style={styles.subjectIcon}>
              <Ionicons name="school" size={28} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.subjectTitle}>Algorithmique Avancée</Text>
              <Text style={styles.groupText}>L3 Informatique • Groupe A</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsGrid}>
            <DetailItem icon="time-outline" label="Horaire" value="08:00 - 10:00" />
            <DetailItem icon="location-outline" label="Lieu" value="Amphi B (Salle 204)" />
          </View>

          {/* Location Verification Badge */}
          <View style={styles.locationBadge}>
            <Ionicons name="navigate-circle" size={20} color={COLORS.success} />
            <Text style={styles.locationText}>Position vérifiée : Dans l'établissement</Text>
          </View>
        </View>

        {/* --- MAIN SIGNATURE ACTION --- */}
        {!isValidated ? (
          <View style={styles.actionSection}>
            <Text style={styles.actionInstruction}>Action requise pour valider votre séance</Text>
            
            <Pressable
              onPress={handleValidation}
              style={({ pressed }) => [
                styles.mainSignBtn,
                pressed && styles.btnPressed
              ]}
            >
              <View style={styles.btnIconBg}>
                <Ionicons name="finger-print" size={32} color={COLORS.white} />
              </View>
              <View style={styles.btnTextContent}>
                <Text style={styles.btnTitle}>Signer ma présence</Text>
                <Text style={styles.btnSubtitle}>Appuyez pour certifier la séance</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.white} opacity={0.6} />
            </Pressable>

            <View style={styles.secondaryActions}>
              <Pressable style={styles.altBtn}>
                <Ionicons name="qr-code-outline" size={20} color={COLORS.textPrimary} />
                <Text style={styles.altBtnText}>Scanner Code Salle</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-seal" size={48} color={COLORS.success} />
            </View>
            <Text style={styles.successTitle}>Séance Émargée</Text>
            <Text style={styles.successDesc}>Votre présence a été certifiée le 07/04 à 08:02.</Text>
            <Pressable style={styles.receiptBtn}>
              <Ionicons name="download-outline" size={18} color={COLORS.primary} />
              <Text style={styles.receiptText}>Télécharger le reçu</Text>
            </Pressable>
          </View>
        )}

        {/* --- History Section --- */}
        <Text style={styles.sectionHeader}>Historique récent</Text>
        <View style={styles.historyList}>
          <HistoryItem title="Bases de Données" date="Hier, 10:30" status="Validé" />
          <HistoryItem title="Génie Logiciel" date="5 Avr, 14:00" status="Validé" />
          <HistoryItem title="Architecture Web" date="4 Avr, 08:00" status="Validé" />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailItem({ icon, label, value }: any) {
  return (
    <View style={styles.detailItem}>
      <View style={styles.detailIconBg}>
        <Ionicons name={icon} size={18} color={COLORS.textSecondary} />
      </View>
      <View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

function HistoryItem({ title, date, status }: any) {
  return (
    <View style={styles.historyItem}>
      <View style={styles.historyIcon}>
        <Ionicons name="document-text-outline" size={20} color={COLORS.textTertiary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.historyTitle}>{title}</Text>
        <Text style={styles.historyDate}>{date}</Text>
      </View>
      <View style={styles.historyStatus}>
        <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
        <Text style={styles.historyStatusText}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingVertical: 20 },
  headerTitle: { fontSize: 34, fontWeight: "900", color: COLORS.textPrimary, letterSpacing: -1 },
  headerSubtitle: { fontSize: 16, fontWeight: "600", color: COLORS.textSecondary, marginTop: 4 },
  statusPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusPillPending: { backgroundColor: COLORS.warning + "15" },
  statusPillValid: { backgroundColor: COLORS.success + "15" },
  statusPillText: { fontSize: 11, fontWeight: "900" },
  statusPillTextPending: { color: COLORS.warning },
  statusPillTextValid: { color: COLORS.success },

  scrollContent: { paddingHorizontal: 24, paddingTop: 10 },
  
  sessionCard: { 
    backgroundColor: COLORS.surface, 
    borderRadius: RADIUS.large, 
    padding: 25, 
    marginBottom: 30, 
    ...SHADOWS.soft,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)"
  },
  sessionHeader: { flexDirection: "row", gap: 18, alignItems: "center", marginBottom: 20 },
  subjectIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: COLORS.primaryLight, justifyContent: "center", alignItems: "center" },
  subjectTitle: { fontSize: 22, fontWeight: "900", color: COLORS.textPrimary, letterSpacing: -0.5 },
  groupText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: "600", marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.background, marginBottom: 20 },
  detailsGrid: { flexDirection: "row", gap: 20, marginBottom: 20 },
  detailItem: { flex: 1, flexDirection: "row", gap: 12, alignItems: "center" },
  detailIconBg: { width: 36, height: 36, borderRadius: 12, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center" },
  detailLabel: { fontSize: 11, fontWeight: "700", color: COLORS.textTertiary, textTransform: "uppercase" },
  detailValue: { fontSize: 13, fontWeight: "800", color: COLORS.textPrimary, marginTop: 2 },
  
  locationBadge: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: COLORS.success + "10", padding: 12, borderRadius: 15 },
  locationText: { fontSize: 12, fontWeight: "700", color: COLORS.success },

  actionSection: { marginTop: 10 },
  actionInstruction: { fontSize: 15, fontWeight: "800", color: COLORS.textPrimary, marginBottom: 20, textAlign: "center" },
  mainSignBtn: { 
    backgroundColor: COLORS.primary, 
    height: 90, 
    borderRadius: 28, 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 20, 
    gap: 15,
    ...SHADOWS.high,
    shadowColor: COLORS.primary,
  },
  btnIconBg: { width: 56, height: 56, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  btnTextContent: { flex: 1 },
  btnTitle: { color: COLORS.white, fontSize: 18, fontWeight: "900" },
  btnSubtitle: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "600", marginTop: 2 },

  secondaryActions: { flexDirection: "row", gap: 15, marginTop: 20 },
  altBtn: { flex: 1, height: 60, borderRadius: 20, backgroundColor: COLORS.white, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.soft },
  altBtnText: { fontSize: 14, fontWeight: "800", color: COLORS.textPrimary },

  successCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.large, padding: 30, alignItems: "center", ...SHADOWS.medium },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.success + "15", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  successTitle: { fontSize: 24, fontWeight: "900", color: COLORS.textPrimary },
  successDesc: { fontSize: 14, color: COLORS.textSecondary, fontWeight: "600", textAlign: "center", marginTop: 8, lineHeight: 20 },
  receiptBtn: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 25, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.primaryLight },
  receiptText: { color: COLORS.primary, fontWeight: "800", fontSize: 14 },

  sectionHeader: { fontSize: 20, fontWeight: "900", color: COLORS.textPrimary, marginBottom: 15, marginTop: 40, letterSpacing: -0.5 },
  historyList: { gap: 12 },
  historyItem: { flexDirection: "row", alignItems: "center", padding: 16, backgroundColor: COLORS.surface, borderRadius: RADIUS.medium, gap: 15, ...SHADOWS.soft },
  historyIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center" },
  historyTitle: { fontSize: 15, fontWeight: "800", color: COLORS.textPrimary },
  historyDate: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "600", marginTop: 2 },
  historyStatus: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: COLORS.success + "10", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  historyStatusText: { fontSize: 11, fontWeight: "900", color: COLORS.success },

  btnPressed: { transform: [{ scale: 0.96 }], opacity: 0.9 },
});
