import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../store/assistantStore';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
        {message.content}
      </Text>
      {message.action && message.action !== 'respond' && (
        <View style={styles.actionBadge}>
          <Text style={styles.actionText}>⚡ {message.action}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '85%',
    marginVertical: 10,
    padding: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 8,
  },
  assistantContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(30, 30, 42, 0.9)',
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a36'
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3
  },
  userText: {
    color: '#ffffff',
    fontWeight: '500'
  },
  assistantText: {
    color: '#e4e4e7',
    fontWeight: '400'
  },
  actionBadge: {
    marginTop: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  actionText: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  }
});
