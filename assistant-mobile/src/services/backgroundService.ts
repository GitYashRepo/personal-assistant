import ReactNativeForegroundService from '@supersami/rn-foreground-service';

ReactNativeForegroundService.register({
   // @ts-ignore: Library runtime requires 'config' object despite incorrect TS types
  config: {
    alert: false,
    onServiceErrorCallBack: () => {
      console.error('Foreground service error occurred');
    },
  },
});

// @ts-ignore: Suppress any strict type errors for add_task's parameters
ReactNativeForegroundService.add_task(
  async () => {
    console.log('Background Service Running: Listening for wake word...');
  },
  {
    delay: 5000,
    onLoop: true,
    taskId: 'wake_word_engine',
  }
);

export const startBackgroundAssistant = () => {
  ReactNativeForegroundService.start({
    id: 144,
    title: 'Kairon is listening',
    message: 'Say "Hey Kairon" to wake me up.',
    icon: 'ic_launcher',
    setOnlyAlertOnce: true,
    color: '#000000',
    // @ts-ignore: ServiceType might be missing from TS definitions but could be required for Android 14
    ServiceType: 'microphone',
  });
};
