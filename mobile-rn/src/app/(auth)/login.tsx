import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "../../themes/colors";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animations for buttons (Scale effect)
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.replace("/(app)");
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Top Illustration/Logo Area */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="school" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>PedagoSuivi</Text>
            <Text style={styles.subtitle}>
              Gérez votre enseignement avec élégance et efficacité.
            </Text>
          </View>

          {/* Form Area */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Adresse Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={22} color={COLORS.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="nom@ecole.com"
                  placeholderTextColor={COLORS.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={22} color={COLORS.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={COLORS.textTertiary}
                  />
                </Pressable>
              </View>
            </View>

            <Pressable style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </Pressable>

            {/* Premium Button */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleLogin}
                style={({ pressed }) => [
                  styles.loginBtn,
                  pressed && styles.loginBtnPressed,
                ]}
              >
                {loading ? (
                  <Text style={styles.loginBtnText}>Connexion en cours...</Text>
                ) : (
                  <>
                    <Text style={styles.loginBtnText}>Se connecter</Text>
                    <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                  </>
                )}
              </Pressable>
            </Animated.View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ? </Text>
            <Pressable>
              <Text style={styles.signUpText}>Contactez l'administration</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 64,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: -8,
  },
  forgotText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    height: 68,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
    ...SHADOWS.large,
  },
  loginBtnPressed: {
    backgroundColor: COLORS.primaryDark,
    opacity: 0.9,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  signUpText: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 15,
  },
});
