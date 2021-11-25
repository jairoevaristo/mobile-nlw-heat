import React, { useState } from 'react';
import { View, TextInput, Alert, Keyboard } from 'react-native';
import { api } from '../../services/api';

import { COLORS } from '../../theme';
import { Button } from '../Button';

import { styles } from './styles';

export function SendMessageForm() {
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  async function handleMessageSubmit() {
    const messageFormated = message.trim();

    if (messageFormated.length > 0) {
      setSendingMessage(true);
      await api.post('message', { message: messageFormated })

      setMessage('');
      Keyboard.dismiss();
      setSendingMessage(false);
      Alert.alert("Mensagem enviada com sucesso!");

    } else {
      Alert.alert("Escreve uma mensagem para enviar.");
    }
  }

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        keyboardAppearance="dark"
        placeholder="Qual sua expectativa para o evento"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        multiline
        maxLength={140}
        value={message}
        onChangeText={setMessage}
        editable={!sendingMessage}
      />

      <Button
        title="ENVIAR MENSAGEM"
        backgroundColor={COLORS.PINK}
        color={COLORS.WHITE}
        onPress={handleMessageSubmit}
        isLoading={sendingMessage}
      />
    </View>
  )
}