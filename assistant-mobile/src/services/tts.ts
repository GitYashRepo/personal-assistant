import * as Speech from 'expo-speech';

export const speak = (text: string) => {
  if (!text) return;
  Speech.speak(text, {
    language: 'en',
    pitch: 1.0,
    rate: 1.0,
  });
};

export const stopSpeaking = () => {
  Speech.stop();
};
