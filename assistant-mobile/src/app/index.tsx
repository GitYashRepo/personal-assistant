import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useAssistantStore } from '../store/assistantStore';
import { sendToAssistant, transcribeAudio } from '../services/api';
import { speak } from '../services/tts';
import { startRecording, stopRecording } from '../services/speech';
import { executeTool } from '../services/toolRouter';
import ChatMessage from '../components/ChatMessage';

export default function AssistantScreen() {
  const [inputText, setInputText] = useState('');
  const { messages, addMessage, isProcessing, setProcessing, isListening, setListening, pendingAction, setPendingAction } = useAssistantStore();

  const handleSendText = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user' as const, content: text, id: Date.now().toString() };
    addMessage(userMsg);
    setInputText('');
    setProcessing(true);

    try {
      const result = await sendToAssistant(text);

      const assistantMsg = {
        role: 'assistant' as const,
        content: result.response || "No response provided.",
        action: result.action,
        id: (Date.now() + 1).toString()
      };

      addMessage(assistantMsg);
      speak(assistantMsg.content);

      // Execute Android Action
      if (result.action && result.action !== 'respond') {
        if (result.requires_confirmation) {
          setPendingAction({ action: result.action, data: result.data });
        } else {
          await executeTool(result.action, result.data);
        }
      }
    } catch (error) {
      addMessage({ role: 'system', content: 'Failed to communicate with assistant.', id: (Date.now() + 1).toString() });
    } finally {
      setProcessing(false);
    }
  };

  const handleMicPress = async () => {
    if (isListening) {
      setListening(false);
      setProcessing(true);
      const uri = await stopRecording();
      if (uri) {
        try {
          const text = await transcribeAudio(uri);
          if (text) {
            await handleSendText(text);
          }
        } catch (error) {
          addMessage({ role: 'system', content: 'Failed to transcribe audio.', id: Date.now().toString() });
        } finally {
          setProcessing(false);
        }
      } else {
        setProcessing(false);
      }
    } else {
      const started = await startRecording();
      if (started) {
        setListening(true);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Kairon</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChatMessage message={item} />}
        contentContainerStyle={styles.list}
      />

      {pendingAction && (
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationBox}>
            <Text style={styles.confirmationTitle}>Permission Required</Text>
            <Text style={styles.confirmationText}>
              Kairon wants to perform: {pendingAction.action.replace(/_/g, ' ')}
            </Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity 
                style={[styles.confirmBtn, styles.cancelBtn]} 
                onPress={() => setPendingAction(null)}
              >
                <Text style={styles.confirmBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmBtn, styles.approveBtn]} 
                onPress={async () => {
                  const action = pendingAction.action;
                  const data = pendingAction.data;
                  setPendingAction(null);
                  await executeTool(action, data);
                }}
              >
                <Text style={styles.confirmBtnText}>Allow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={[styles.micButton, isListening && styles.micButtonActive]} 
          onPress={handleMicPress} 
          disabled={isProcessing}
        >
          <Text style={styles.micText}>{isListening ? "⏹" : "🎤"}</Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={isListening ? "Listening..." : "Ask Kairon..."}
          placeholderTextColor="#999"
          editable={!isProcessing && !isListening}
          onSubmitEditing={() => handleSendText(inputText)}
        />
        
        <TouchableOpacity style={styles.sendButton} onPress={() => handleSendText(inputText)} disabled={isProcessing || isListening}>
          {isProcessing ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendText}>Send</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d12' },
  header: { 
    padding: 24, 
    paddingTop: 64, 
    backgroundColor: 'rgba(20, 20, 28, 0.8)', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#2a2a36'
  },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '800', letterSpacing: 1.2 },
  list: { padding: 16, paddingBottom: 120 },
  inputContainer: { 
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: 'row', 
    padding: 12, 
    backgroundColor: 'rgba(30, 30, 42, 0.95)', 
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a4c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10
  },
  micButton: { backgroundColor: '#2a2a36', padding: 12, borderRadius: 24, marginRight: 8, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  micButtonActive: { backgroundColor: '#ef4444', transform: [{ scale: 1.1 }] },
  micText: { fontSize: 18 },
  input: { flex: 1, backgroundColor: 'transparent', color: '#fff', fontSize: 16, paddingHorizontal: 12 },
  sendButton: { backgroundColor: '#3b82f6', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 24, minWidth: 70, alignItems: 'center' },
  sendText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  confirmationOverlay: { position: 'absolute', bottom: 100, left: 16, right: 16, backgroundColor: '#1e1e2a', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#3b82f6', shadowColor: '#3b82f6', shadowOpacity: 0.3, shadowRadius: 20, elevation: 5 },
  confirmationBox: { alignItems: 'center' },
  confirmationTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  confirmationText: { color: '#a1a1aa', marginBottom: 20, textAlign: 'center', fontSize: 16 },
  confirmationButtons: { flexDirection: 'row', gap: 16, width: '100%' },
  confirmBtn: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#3f3f46' },
  approveBtn: { backgroundColor: '#3b82f6' },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
