import { Platform } from 'react-native';

let ReactNativeForegroundService: any = null;
try {
  ReactNativeForegroundService = require('@supersami/rn-foreground-service').default;
} catch (e) {
  console.warn("Foreground service module not linked.");
}

// This function starts the persistent Android Foreground Service
export const startBackgroundAssistant = () => {
  if (Platform.OS !== 'android' || !ReactNativeForegroundService) return;

  try {
    // 1. Register the headless task
    ReactNativeForegroundService.register({
      id: 144,
    });

    // 2. Add the actual wake-word engine task
    ReactNativeForegroundService.addTask({
      task: async () => {
        console.log('Background Service Running: Listening for wake word...');
        // TODO: Integrate Picovoice Porcupine or background audio stream here
        // For now, this keeps the app alive in the background.
      },
      taskName: 'wake_word_engine',
      delay: 5000,
      loopDelay: 5000,
      onLoop: true,
    });

    // 3. Start the Foreground Service with a persistent notification
    ReactNativeForegroundService.start({
      id: 144,
      title: 'Kairon is listening',
      message: 'Say "Hey Kairon" to wake me up.',
      icon: 'ic_launcher',
      setOnlyAlertOnce: true,
      color: '#000000',
    });
  } catch (error) {
    console.warn("Foreground service native module not linked. You must run a custom dev build (npx expo run:android) to use background features.");
  }
};

export const stopBackgroundAssistant = () => {
  if (Platform.OS !== 'android' || !ReactNativeForegroundService) return;
  
  try {
    ReactNativeForegroundService.removeTask('wake_word_engine');
    ReactNativeForegroundService.stopAll();
  } catch (e) {
    // Ignore
  }
};
