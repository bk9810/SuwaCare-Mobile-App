// Debug component - Add this temporarily to test doctors API
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DebugDoctors = () => {
  const [result, setResult] = useState('');

  const testDoctorsAPI = async () => {
    try {
      setResult('Testing...');
      
      // 1. Check token
      const token = await AsyncStorage.getItem('token');
      console.log('🔍 Token:', token ? 'EXISTS' : 'NOT FOUND');
      
      if (!token) {
        setResult('❌ No token found. Please log in first.');
        return;
      }
      
      // 2. Test doctors API directly
      const response = await fetch('http://  10.195.21.1655000/api/doctors?disease=Diabetes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('🌐 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Error response:', errorText);
        setResult(`❌ HTTP ${response.status}: ${errorText}`);
        return;
      }
      
      const data = await response.json();
      console.log('✅ Doctors data:', data);
      
      setResult(`✅ Found ${data.length} doctors: ${JSON.stringify(data, null, 2)}`);
      
    } catch (error) {
      console.error('❌ Network error:', error);
      setResult(`❌ Network error: ${error.message}`);
    }
  };

  const checkTokenOnly = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const tokenInfo = {
        exists: !!token,
        length: token?.length,
        preview: token ? token.substring(0, 50) + '...' : 'No token'
      };
      console.log('🔍 Token info:', tokenInfo);
      setResult(`Token info: ${JSON.stringify(tokenInfo, null, 2)}`);
    } catch (error) {
      setResult(`Error checking token: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Doctors API</Text>
      
      <Button title="1. Check Token" onPress={checkTokenOnly} />
      <Button title="2. Test Doctors API" onPress={testDoctorsAPI} />
      
      <Text style={styles.result}>{result}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  result: { 
    marginTop: 20, 
    padding: 10, 
    backgroundColor: '#f5f5f5',
    fontSize: 12,
    fontFamily: 'monospace'
  }
});

export default DebugDoctors;