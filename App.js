import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://51.19.126.93:9090', {
  autoConnect: false
});

// Debug code, 
const log = console.warn;
socket.on('connect', () => log('Socket is connected'));
socket.on('disconnect', () => log('Socket is disconnected'));

export default function App() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  const addMessage = message => setChatMessages([...chatMessages, message]);

  const sendMessage = message => socket.emit('chat-message', message);

  const submitChatMessage = () => {
    sendMessage(currentMessage);
    setCurrentMessage('');
  };

  useEffect(() => {
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('chat-message', addMessage);
    socket.open();
  }, [chatMessages]);

  return (
    <View style={styles.container}>
      <Text>Messages Appear Below</Text>
      <Text>{connected ? 'Connected :)' : 'Diconnected :('}</Text>
      {chatMessages.map((message, index) => <Text key={index}>{message}</Text>)}
      <TextInput
        style={styles.text_input}
        value={currentMessage}
        onSubmitEditing={submitChatMessage}
        onChangeText={setCurrentMessage}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_input: {
    borderWidth: 1,
    width: 100
  }
});
