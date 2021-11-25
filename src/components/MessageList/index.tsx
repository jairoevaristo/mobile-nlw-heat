import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import io from 'socket.io-client';

import { MESSAGES_EXAMPLE } from '../../utils/messages';

import { api } from '../../services/api';

import { Message, MessageProps } from '../Message';

import { styles } from './styles';

let messagensQueue: MessageProps[] = MESSAGES_EXAMPLE; 

const socket = io(String(api.defaults.baseURL));
socket.on('new-message', (newMessages) => {
  messagensQueue.push(newMessages);
});

export function MessageList() {
  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([]);

  async function fetchMessages() {
    const messagesResponse = await api.get<MessageProps[]>('message/last3');
    setCurrentMessages(messagesResponse.data);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagensQueue.length > 0) {
        setCurrentMessages(prevState => [messagensQueue[0], prevState[0], prevState[1]]);
        messagensQueue.shift();
      }
    }, 3000);

    return () => {
      clearInterval(timer);
    }
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
     { currentMessages.map(item => ( <Message data={item} key={item.id} /> ) ) }
    </ScrollView>
  )
}