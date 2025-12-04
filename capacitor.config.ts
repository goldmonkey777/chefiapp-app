import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chefiapp.app',
  appName: 'ChefIApp',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Usar o mesmo esquema que os deep links configurados no Supabase/Auth
    iosScheme: 'chefiapp'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#2A3A8A',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff'
    }
  }
};

export default config;
