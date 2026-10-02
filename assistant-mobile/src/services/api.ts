import axios from 'axios';
import { Platform } from 'react-native';

const LOCAL_API = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';
const API_URL = process.env.EXPO_PUBLIC_API_URL || LOCAL_API || 'http://localhost:3000/api' || 'http://localhost:3000';

export interface AssistantResponse {
  type?: string;
  action?: string;
  requires_confirmation?: boolean;
  data?: any;
  response?: string;
}

export const sendToAssistant = async (message: string): Promise<AssistantResponse> => {
  try {
    const response = await axios.post(`${API_URL}/assistant`, {
      message,
      conversationId: 'default'
    }, {
      headers: {
        'Bypass-Tunnel-Reminder': 'true'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message to assistant:', error);
    throw error;
  }
};

export const transcribeAudio = async (audioUri: string): Promise<string> => {
  try {
    const formData = new FormData();
    // In React Native, we can append a file to FormData with this structure:
    formData.append('file', {
      uri: audioUri,
      name: 'audio.m4a',
      type: 'audio/m4a',
    } as any);

    const response = await axios.post(`${API_URL}/speech`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Bypass-Tunnel-Reminder': 'true'
      },
    });

    return response.data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};
