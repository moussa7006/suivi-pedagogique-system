import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS, SHADOWS, RADIUS } from "../../themes/colors";

export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert("Déconnexion", "Souhaitez-vous vraiment quitter la session ?", [
      { text: "Rester", style: "cancel" },
      { text: "Quitter", style: "destructive", onPress: () => router.replace("/(auth)/login") },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- High-End Profile Header --- */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: "https://i.pravatar.cc/300?u=aminata" }} style={styles.avatar} />
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          </View>
          <Text style={styles.userName}>Aminata Traoré</Text>
          <Text style={styles.userEmail}>aminata.t@universite.edu</Text>
          <Pressable style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Modifier le profil</Text>
          </Pressable>
        </View>

        {/* --- Quick Insight Stats --- */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Cours</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>Présence</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Note</Text>
          </View>
        </View>

        {/* --- Settings Section (Grouped Style) --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences Système</Text>
          <View style={styles.groupCard}>
            <SettingsItem icon="notifications-outline" title="Notifications" color="#3B82F6" />
            <View style={styles.divider} />
            <SettingsItem icon="color-palette-outline" title="Thème & Apparence" color="#8B5CF6" />
            <View style={styles.divider} />
            <SettingsItem icon="language-outline" title="Langue" color="#F59E0B" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sécurité & Légal</Text>
          <View style={styles.groupCard}>
            <SettingsItem icon="lock-closed-outline" title="Confidentialité" color="#10B981" />
            <View style={styles.divider} />
            <SettingsItem icon="document-text-outline" title="Conditions Générales" color="#64748B" />
          </View>
        </View>

        {/* --- Logout Action --- */}
        <View style={styles.logoutWrapper}>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutBtn,
              pressed && styles.logoutBtnPressed
            ]}
          >
            <Ionicons name="log-out-outline" size={24} color="#FFF" />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </Pressable>
        </View>

        <Text style={styles.versionText}>PedagoSuivi Cloud v2.1.5</Text>
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsItem({ icon, title, color }: any) {
  return (
    <Pressable style={({ pressed }) => [styles.settingsItem, pressed && styles.itemPressed]}>
      <View style={[styles.iconBox, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.settingsTitle}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingTop: 30 },
  header: { alignItems: "center", marginBottom: 35 },
  avatarWrapper: { position: "relative", marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 5, borderColor: COLORS.white, ...SHADOWS.medium },
  proBadge: { position: "absolute", top: 5, right: 5, backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 3, borderColor: COLORS.white },
  proBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: "900" },
  userName: { fontSize: 28, fontWeight: "900", color: COLORS.textPrimary, letterSpacing: -0.5 },
  userEmail: { fontSize: 15, color: COLORS.textSecondary, fontWeight: "600", marginTop: 4 },
  editProfileBtn: { marginTop: 15, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: COLORS.white, borderRadius: RADIUS.medium, borderWidth: 1, borderColor: COLORS.border },
  editProfileText: { fontSize: 13, fontWeight: "700", color: COLORS.textPrimary },
  
  statsRow: { flexDirection: "row", backgroundColor: COLORS.surface, marginHorizontal: 20, paddingVertical: 20, borderRadius: RADIUS.medium, marginBottom: 35, ...SHADOWS.soft },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "900", color: COLORS.textPrimary },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "700", marginTop: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.border, height: "70%", alignSelf: "center" },

  section: { paddingHorizontal: 20, marginBottom: 30 },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: COLORS.textTertiary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, marginLeft: 10 },
  groupCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.medium, overflow: "hidden", ...SHADOWS.soft },
  settingsItem: { flexDirection: "row", alignItems: "center", padding: 16, gap: 15 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  settingsTitle: { flex: 1, fontSize: 16, fontWeight: "700", color: COLORS.textPrimary },
  divider: { height: 1, backgroundColor: COLORS.background, marginLeft: 70 },
  
  logoutWrapper: { paddingHorizontal: 20, marginTop: 10 },
  logoutBtn: { backgroundColor: "#FF3B30", height: 70, borderRadius: RADIUS.medium, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, ...SHADOWS.high, shadowColor: "#FF3B30" },
  logoutBtnPressed: { backgroundColor: "#D70015", transform: [{ scale: 0.98 }] },
  logoutText: { color: "#FFF", fontSize: 18, fontWeight: "900" },
  
  versionText: { textAlign: "center", color: COLORS.textTertiary, fontSize: 12, fontWeight: "700", marginTop: 25 },
  itemPressed: { backgroundColor: COLORS.background },
});
