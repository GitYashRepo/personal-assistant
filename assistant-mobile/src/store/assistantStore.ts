import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  action?: string;
}

interface AssistantState {
  messages: Message[];
  isListening: boolean;
  isProcessing: boolean;
  pendingAction: { action: string, data: any } | null;
  addMessage: (message: Message) => void;
  setListening: (status: boolean) => void;
  setProcessing: (status: boolean) => void;
  setPendingAction: (action: { action: string, data: any } | null) => void;
  clearHistory: () => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  messages: [],
  isListening: false,
  isProcessing: false,
  pendingAction: null,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setListening: (status) => set({ isListening: status }),
  setProcessing: (status) => set({ isProcessing: status }),
  setPendingAction: (action) => set({ pendingAction: action }),
  clearHistory: () => set({ messages: [] })
}));
