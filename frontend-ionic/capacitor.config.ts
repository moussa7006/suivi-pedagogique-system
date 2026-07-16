import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.edutrack.mobile',
  appName: 'EduTrack',
  webDir: 'www',
  server: {
    cleartext: true,
    androidScheme: 'http',
  },
};

export default config;
