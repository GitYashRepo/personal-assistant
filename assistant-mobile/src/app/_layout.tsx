import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { startBackgroundAssistant } from '../services/backgroundService';

export default function TabLayout() {
  useEffect(() => {
    startBackgroundAssistant();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
