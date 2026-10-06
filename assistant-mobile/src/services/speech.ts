import { AudioModule, requestRecordingPermissionsAsync, setAudioModeAsync, RecordingPresets } from 'expo-audio';

let recording: any = null;

export const startRecording = async () => {
  try {
    const permission = await requestRecordingPermissionsAsync();
    if (permission.status === 'granted') {
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      recording = new AudioModule.AudioRecorder(RecordingPresets.HIGH_QUALITY);
      await recording.prepareToRecordAsync();
      recording.record();
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
  if (!recording) return null;

  try {
    await recording.stop();
    const uri = recording.uri;
    recording = null;
    return uri;
  } catch (err) {
    console.error('Failed to stop recording', err);
    return null;
  }
};
