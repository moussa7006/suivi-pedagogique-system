import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "../../themes/colors";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        
        // --- NEW ULTRA-PREMIUM TAB BAR ---
        tabBarStyle: {
          position: "absolute",
          bottom: 30,
          left: 15,
          right: 15,
          height: 90, // Large & Bold
          backgroundColor: COLORS.surface,
          borderRadius: 32,
          paddingBottom: 30,
          paddingTop: 15,
          // Massive soft shadow for "Floating" effect
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 0.12,
          shadowRadius: 30,
          elevation: 15,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.8)",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "900",
          marginTop: 8,
        },
        tabBarItemStyle: {
          height: 65,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={28} 
                color={focused ? COLORS.white : COLORS.textTertiary} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Planning",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <Ionicons 
                name={focused ? "calendar" : "calendar-outline"} 
                size={28} 
                color={focused ? COLORS.white : COLORS.textTertiary} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: "Émargement",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <Ionicons 
                name={focused ? "qr-code" : "qr-code-outline"} 
                size={28} 
                color={focused ? COLORS.white : COLORS.textTertiary} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="lesson-log"
        options={{
          title: "Cahier",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <Ionicons 
                name={focused ? "book" : "book-outline"} 
                size={28} 
                color={focused ? COLORS.white : COLORS.textTertiary} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={28} 
                color={focused ? COLORS.white : COLORS.textTertiary} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  iconActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
});
