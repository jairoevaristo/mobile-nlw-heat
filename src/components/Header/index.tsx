import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { UserPhoto } from '../UserPhoto';

import { styles } from './styles';

import LogoSVG from '../../assets/logo.svg';

export function Header() {
  return (
    <View style={styles.container}>
      <LogoSVG />

      <View style={styles.logoutButton}>
        <TouchableOpacity>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>

        <UserPhoto 
          imageURI="https://uifaces.co/our-content/donated/xZ4wg2Xj.jpg" 
        />
      </View>

    </View>
  )
}