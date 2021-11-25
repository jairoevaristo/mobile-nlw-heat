import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { api } from '../services/api';

const CLIENT_ID = 'fa20efafe2f2ece5efb4';
const SCOPE = 'read:user';
const USER_STORAGE = '@nlwheat:user';
const TOKEN_STORAGE = '@nlwheat:token';

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}

type AuthContextData = {
  user: User | null;
  isSigningIn: boolean;
  signIn: () => void;
  signOut: () => void;
}

type AuthProviderProps = {
  children: ReactNode;
}

type AuthResponse = {
  token: string;
  user: User;
}

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  },
  type?: string;
}

const AuthContext = createContext({} as AuthContextData); 

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(true);

  async function signIn() {
    try {
      setIsSigningIn(true);
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;
      const authSessionResponse = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;
  
      if (authSessionResponse.type === 'success' && authSessionResponse.params.error !== 'access_denied') {
        const authResponse = await api.post<AuthResponse>('authenticate', {
          code: authSessionResponse.params.code
        });
        const { user, token } = authResponse.data;
  
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
        await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
        await AsyncStorage.setItem(TOKEN_STORAGE, token)
        
        setUser(user);
      }
      
    } catch(error) {
      console.log(error);
    } finally {
      setIsSigningIn(false)
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem(USER_STORAGE);
    await AsyncStorage.removeItem(TOKEN_STORAGE);
    
    setUser(null);
  }

  async function loadStorageUserData() {
    const userStorage = await AsyncStorage.getItem(USER_STORAGE);
    const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

    if (userStorage && tokenStorage) {
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`;
      setUser(JSON.parse(userStorage));
    }

    setIsSigningIn(false);
  }

  useEffect(() => {
    loadStorageUserData();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      signOut,
      isSigningIn
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { useAuth, AuthProvider };