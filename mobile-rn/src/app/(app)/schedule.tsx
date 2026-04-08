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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS, RADIUS } from "../../themes/colors";

const { width } = Dimensions.get("window");

const DAYS = [
  { id: "1", label: "Lun", date: "07", full: "Lundi 7 Avril" },
  { id: "2", label: "Mar", date: "08", full: "Mardi 8 Avril" },
  { id: "3", label: "Mer", date: "09", full: "Mercredi 9 Avril" },
  { id: "4", label: "Jeu", date: "10", full: "Jeudi 10 Avril" },
  { id: "5", label: "Ven", date: "11", full: "Vendredi 11 Avril" },
];

const SESSIONS = [
  {
    id: "1",
    title: "Algorithmique Avancée",
    time: "08:00 - 10:00",
    room: "Amphi B",
    type: "COURS",
    group: "L3 INFO",
    status: "Terminé",
    color: COLORS.success,
  },
  {
    id: "2",
    title: "Bases de Données",
    time: "10:30 - 12:30",
    room: "Salle 204",
    type: "TD",
    group: "L2 INFO",
    status: "En cours",
    color: COLORS.primary,
  },
  {
    id: "3",
    title: "Génie Logiciel",
    time: "14:00 - 16:00",
    room: "Labo 3",
    type: "TP",
    group: "M1 GL",
    status: "À venir",
    color: COLORS.accent,
  },
  {
    id: "4",
    title: "Architecture Web",
    time: "16:15 - 18:15",
    room: "Salle 102",
    type: "COURS",
    group: "L3 INFO",
    status: "À venir",
    color: COLORS.textTertiary,
  },
];

export default function ScheduleScreen() {
  const [activeDay, setActiveDay] = useState("1");

  const selectedDayFull = DAYS.find(d => d.id === activeDay)?.full;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* --- Massive Header --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Planning</Text>
          <Text style={styles.headerSubtitle}>{selectedDayFull}</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.calendarBtn, pressed && styles.btnPressed]}>
          <Ionicons name="calendar-clear" size={24} color={COLORS.textPrimary} />
        </Pressable>
      </View>

      {/* --- High-End Day Picker --- */}
      <View style={styles.dayPickerContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
          {DAYS.map((day) => (
            <Pressable
              key={day.id}
              onPress={() => setActiveDay(day.id)}
              style={({ pressed }) => [
                styles.dayItem,
                activeDay === day.id && styles.dayItemActive,
                pressed && styles.btnPressed
              ]}
            >
              <Text style={[styles.dayLabel, activeDay === day.id && styles.dayLabelActive]}>{day.label}</Text>
              <Text style={[styles.dayDate, activeDay === day.id && styles.dayDateActive]}>{day.date}</Text>
              {activeDay === day.id && <View style={styles.activeDot} />}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* --- Timeline View --- */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {SESSIONS.map((item, index) => (
          <View key={item.id} style={styles.timelineItem}>
            {/* Left Timeline Guide */}
            <View style={styles.guideContainer}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              {index !== SESSIONS.length - 1 && <View style={styles.line} />}
            </View>

            {/* Right Content Card */}
            <Pressable
              style={({ pressed }) => [
                styles.sessionCard,
                pressed && styles.cardPressed
              ]}
            >
              <View style={styles.cardTop}>
                <View style={[styles.typeBadge, { backgroundColor: item.color + "15" }]}>
                  <Text style={[styles.typeText, { color: item.color }]}>{item.type}</Text>
                </View>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>

              <Text style={styles.sessionTitle}>{item.title}</Text>
              
              <View style={styles.cardBottom}>
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.infoText}>{item.time}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.infoText}>{item.room}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="people-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.infoText}>{item.group}</Text>
                </View>
              </View>
            </Pressable>
          </View>
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingVertical: 20 },
  headerTitle: { fontSize: 34, fontWeight: "900", color: COLORS.textPrimary, letterSpacing: -1 },
  headerSubtitle: { fontSize: 16, fontWeight: "600", color: COLORS.textSecondary, marginTop: 4 },
  calendarBtn: { width: 56, height: 56, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: "center", alignItems: "center", ...SHADOWS.soft },
  
  dayPickerContainer: { height: 110, marginBottom: 10 },
  dayScroll: { paddingHorizontal: 20, gap: 12, alignItems: "center" },
  dayItem: { width: 68, height: 88, borderRadius: 24, backgroundColor: COLORS.surface, justifyContent: "center", alignItems: "center", ...SHADOWS.soft, borderWidth: 1, borderColor: "transparent" },
  dayItemActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primaryDark, ...SHADOWS.medium },
  dayLabel: { fontSize: 13, fontWeight: "700", color: COLORS.textTertiary, textTransform: "uppercase", marginBottom: 6 },
  dayLabelActive: { color: "rgba(255,255,255,0.7)" },
  dayDate: { fontSize: 24, fontWeight: "900", color: COLORS.textPrimary },
  dayDateActive: { color: COLORS.white },
  activeDot: { position: "absolute", bottom: 10, width: 5, height: 5, borderRadius: 2.5, backgroundColor: COLORS.white },

  listContent: { paddingHorizontal: 24, paddingTop: 10 },
  timelineItem: { flexDirection: "row", gap: 20, marginBottom: 10 },
  guideContainer: { alignItems: "center", width: 20, paddingTop: 30 },
  dot: { width: 14, height: 14, borderRadius: 7, zIndex: 10, borderWidth: 3, borderColor: COLORS.white, ...SHADOWS.small },
  line: { flex: 1, width: 2, backgroundColor: COLORS.border, marginTop: -5, marginBottom: -35 },
  
  sessionCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.large, padding: 22, marginBottom: 25, ...SHADOWS.soft, borderWidth: 1, borderColor: "rgba(255,255,255,0.8)" },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  typeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  typeText: { fontSize: 11, fontWeight: "900", letterSpacing: 0.5 },
  statusText: { fontSize: 12, fontWeight: "700", color: COLORS.textTertiary },
  sessionTitle: { fontSize: 22, fontWeight: "900", color: COLORS.textPrimary, marginBottom: 20, lineHeight: 28 },
  cardBottom: { gap: 10 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoText: { fontSize: 14, fontWeight: "600", color: COLORS.textSecondary },

  btnPressed: { opacity: 0.7, transform: [{ scale: 0.95 }] },
  cardPressed: { transform: [{ scale: 0.98 }], opacity: 0.95 },
});
