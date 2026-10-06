import React, { useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform, AppState } from 'react-native';
import { Stack } from 'expo-router';
import { startBackgroundAssistant } from '../services/backgroundService';

export default function TabLayout() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const requestPermissionsAndStart = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ...(Platform.Version >= 33 ? [PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] : [])
          ]);

          if (
            granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
            (Platform.Version < 33 || granted[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] === PermissionsAndroid.RESULTS.GRANTED)
          ) {
            // Android 12+ requires the app to be fully in the foreground before starting a microphone foreground service.
            // If the permission dialog was just dismissed, the app might still be transitioning states.
            if (AppState.currentState === 'active') {
              startBackgroundAssistant();
            } else {
              const subscription = AppState.addEventListener('change', nextAppState => {
                if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                  startBackgroundAssistant();
                  subscription.remove();
                }
                appState.current = nextAppState;
              });
            }
          } else {
            console.warn('Permissions denied, background assistant cannot start.');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        startBackgroundAssistant();
      }
    };

    requestPermissionsAndStart();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
