import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import io from 'socket.io-client';

const CONNECTION_ADDRESS = 'http://51.19.126.93:9090';

class App extends Component {
  state = {
    connected: false,
    currentMessage: '',
    messages: []
  }

  socket = io(CONNECTION_ADDRESS, {
    autoConnect: false
  });

  componentDidMount() {
    this.socket.on('connect', () => {
      this.infoLog('Connected to server.');
      this.setState({connected: true});
    });

    this.socket.on('disconnect', () => {
      this.infoLog('Disonnected from server.');
      this.setState({connected: false});
    });

    this.socket.on('chat-message', this.addMessage.bind(this));
    this.socket.open();
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  addMessage(message) {
    this.setState({messages: [...this.state.messages, message]});
  }

  infoLog(message) {
    this.addMessage(`=== ${message} ===`);
  }

  sendMessage(message) {
    this.socket.emit('chat-message', message);
  }

  submitChatMessage() {
    this.sendMessage(this.state.currentMessage);
    this.setState({currentMessage: ''});
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>[{this.state.connected ? 'Connected to Server' : 'Disonnected from Server'}]</Text>
        <Text>Messages Appear Below</Text>
        {this.state.messages.map((message, index) => <Text key={index}>{message}</Text>)}
        <TextInput
          style={styles.text_input}
          value={this.state.currentMessage}
          onSubmitEditing={this.submitChatMessage.bind(this)}
          onChangeText={i => this.setState({currentMessage: i})}/>
      </View>
    );
  }
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

export default App;
