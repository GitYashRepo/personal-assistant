let Audio: any = null;
try {
  Audio = require('expo-audio').Audio;
} catch (e) {
  console.warn("expo-av native module not found. You need to build a custom dev client.");
}

let recording: any = null;

export const startRecording = async () => {
  if (!Audio) {
    alert("Microphone requires a custom dev build (npx expo run:android)");
    return false;
  }

  try {
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status === 'granted') {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recording = newRecording;
      return true;
    } else {
      console.warn('Microphone permission not granted');
      return false;
    }
  } catch (err) {
    console.error('Failed to start recording', err);
    return false;
  }
};

export const stopRecording = async (): Promise<string | null> => {
  if (!recording || !Audio) return null;

  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    recording = null;
    return uri;
  } catch (err) {
    console.error('Failed to stop recording', err);
    return null;
  }
};
