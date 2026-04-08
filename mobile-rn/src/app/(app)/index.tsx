import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS, RADIUS } from "../../themes/colors";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- Header Section (Apple Style) --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateHeader}>LUNDI 7 AVRIL</Text>
            <Text style={styles.userName}>Bonjour Aminata</Text>
          </View>
          <Pressable style={({ pressed }) => [styles.avatarPress, pressed && styles.btnPressed]}>
            <Image 
              source={{ uri: "https://i.pravatar.cc/150?u=aminata" }} 
              style={styles.headerAvatar} 
            />
            <View style={styles.statusBadge} />
          </Pressable>
        </View>

        {/* --- Hero: Progressive Next Session --- */}
        <Pressable
          style={({ pressed }) => [
            styles.heroCard,
            pressed && styles.cardPressed
          ]}
          onPress={() => router.push("/(app)/schedule")}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.heroHeader}>
              <View style={styles.liveTag}>
                <View style={styles.pulseDot} />
                <Text style={styles.liveTagText}>EN COURS</Text>
              </View>
              <Text style={styles.roomTag}>Amphi B</Text>
            </View>
            
            <Text style={styles.heroTitle}>Algorithmique Avancée</Text>
            <Text style={styles.heroSubtitle}>L3 Informatique • Groupe A</Text>

            {/* Progress Bar (Visual Polish) */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "65%" }]} />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressText}>08:00</Text>
                <Text style={styles.progressText}>Termine dans 45m</Text>
                <Text style={styles.progressText}>10:00</Text>
              </View>
            </View>
          </View>
        </Pressable>

        {/* --- Bento Grid 2.0 (Asymmetrical) --- */}
        <View style={styles.grid}>
          <View style={styles.gridColumn}>
            <BentoCard 
              title="Émargement" 
              icon="qr-code" 
              color={COLORS.primary} 
              height={200}
              onPress={() => router.push("/(app)/attendance")}
              count="124 élèves"
            />
            <BentoCard 
              title="Cahier" 
              icon="book" 
              color={COLORS.success} 
              height={140}
              onPress={() => router.push("/(app)/lesson-log")}
            />
          </View>
          <View style={styles.gridColumn}>
            <BentoCard 
              title="Planning" 
              icon="calendar" 
              color={COLORS.warning} 
              height={140}
              onPress={() => router.push("/(app)/schedule")}
            />
            <BentoCard 
              title="Rapports" 
              icon="stats-chart" 
              color={COLORS.accent} 
              height={200}
              onPress={() => {}}
              count="3 à valider"
            />
          </View>
        </View>

        {/* --- Quick Overview Section --- */}
        <Text style={styles.sectionHeader}>Dernières Activités</Text>
        <View style={styles.activityCard}>
          <ActivityItem 
            title="Saisie Cahier de Texte" 
            desc="M1 GL • Architecture Log"
            time="Il y a 12m"
            icon="checkmark-done"
            color={COLORS.success}
          />
          <View style={styles.divider} />
          <ActivityItem 
            title="Retard signalé" 
            desc="L3 Info • 5 étudiants"
            time="Il y a 1h"
            icon="alert-circle"
            color={COLORS.error}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function BentoCard({ title, icon, color, height, onPress, count }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.bentoCard,
        { height, backgroundColor: COLORS.surface },
        pressed && styles.cardPressed
      ]}
    >
      <View style={[styles.bentoIconBg, { backgroundColor: color + "10" }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View>
        <Text style={styles.bentoTitle}>{title}</Text>
        {count && <Text style={styles.bentoCount}>{count}</Text>}
      </View>
      <View style={[styles.bentoIndicator, { backgroundColor: color }]} />
    </Pressable>
  );
}

function ActivityItem({ title, desc, time, icon, color }: any) {
  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIconBox, { backgroundColor: color + "10" }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityDesc}>{desc}</Text>
      </View>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 35 
  },
  dateHeader: { fontSize: 13, fontWeight: "800", color: COLORS.textTertiary, letterSpacing: 1.5, textTransform: "uppercase" },
  userName: { fontSize: 30, fontWeight: "900", color: COLORS.textPrimary, letterSpacing: -1 },
  avatarPress: { position: "relative" },
  headerAvatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 3, borderColor: COLORS.white },
  statusBadge: { position: "absolute", bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.white },
  
  heroCard: { 
    backgroundColor: COLORS.primary, 
    borderRadius: RADIUS.large, 
    overflow: "hidden",
    marginBottom: 30,
    ...SHADOWS.high,
  },
  heroOverlay: { padding: 25 },
  heroHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  liveTag: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.small, gap: 6 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.white },
  liveTagText: { color: COLORS.white, fontSize: 11, fontWeight: "900" },
  roomTag: { color: COLORS.white, opacity: 0.8, fontWeight: "700", fontSize: 12 },
  heroTitle: { fontSize: 28, fontWeight: "900", color: COLORS.white, marginBottom: 8, letterSpacing: -0.5 },
  heroSubtitle: { fontSize: 15, color: COLORS.white, opacity: 0.8, fontWeight: "600", marginBottom: 25 },
  
  progressContainer: { marginTop: 10 },
  progressBar: { height: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 3 },
  progressFill: { height: "100%", backgroundColor: COLORS.white, borderRadius: 3 },
  progressLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  progressText: { fontSize: 11, color: COLORS.white, opacity: 0.7, fontWeight: "700" },

  grid: { flexDirection: "row", gap: 15, marginBottom: 35 },
  gridColumn: { flex: 1, gap: 15 },
  bentoCard: { 
    borderRadius: RADIUS.medium, 
    padding: 20, 
    justifyContent: "space-between",
    ...SHADOWS.soft,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  bentoIconBg: { width: 48, height: 48, borderRadius: RADIUS.small, justifyContent: "center", alignItems: "center" },
  bentoTitle: { fontSize: 17, fontWeight: "800", color: COLORS.textPrimary },
  bentoCount: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "600", marginTop: 2 },
  bentoIndicator: { position: "absolute", top: 15, right: 15, width: 4, height: 20, borderRadius: 2 },

  sectionHeader: { fontSize: 20, fontWeight: "900", color: COLORS.textPrimary, marginBottom: 15, letterSpacing: -0.5 },
  activityCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.medium, padding: 5, ...SHADOWS.soft },
  activityItem: { flexDirection: "row", alignItems: "center", padding: 15, gap: 15 },
  activityIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  activityTitle: { fontSize: 15, fontWeight: "700", color: COLORS.textPrimary },
  activityDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  activityTime: { fontSize: 11, color: COLORS.textTertiary, fontWeight: "700" },
  divider: { height: 1, backgroundColor: COLORS.background, marginHorizontal: 15 },

  btnPressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  cardPressed: { transform: [{ scale: 0.98 }], opacity: 0.95 },
});
