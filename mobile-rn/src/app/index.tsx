import { Redirect } from "expo-router";

export default function RootIndex() {
  // Set to false for testing the login page
  const isAuthenticated = false;

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
