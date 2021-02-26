import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://desktop.croydon.vpn:9090', {pingTimeout: 60000});

export default function App() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const submitChatMessage = () => {
    socket.emit('chat-message', currentMessage);
    setCurrentMessage('');
  };

  return (
    <View style={styles.container}>
      {chatMessages.map(message => <Text>{message}</Text>)}
      <TextInput
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
});
