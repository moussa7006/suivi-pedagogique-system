import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.edutrack.mobile',
  appName: 'EduTrack',
  webDir: 'www',
  server: {
    cleartext: true,
    androidScheme: 'http',
  },
<<<<<<< HEAD
=======
  plugins: {
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true
    }
  }
>>>>>>> d6b8d3bf8fe91554ef39feb5f2aba44b33093b1d
};

export default config;
