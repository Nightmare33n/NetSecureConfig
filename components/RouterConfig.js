'use client';

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Network from 'expo-network';

const RouterConfig = () => {
  const [gateway, setGateway] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const getDefaultGateway = async () => {
    try {
      setLoading(true);
      setError('');

      // Obtener información de la red
      const networkState = await Network.getNetworkStateAsync();
      
      if (!networkState.isConnected) {
        throw new Error('No hay conexión a internet');
      }

      // Obtener la IP local
      const ipAddress = await Network.getIpAddressAsync();
      
      // Calcular el gateway probable (último octeto = 1)
      const ipParts = ipAddress.split('.');
      const probableGateway = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.1`;
      
      setGateway(probableGateway);
      setShowConfig(true);
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo obtener la dirección del router. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInBrowser = () => {
    if (gateway) {
      Linking.openURL(`http://${gateway}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuración del Router</Text>
        <Text style={styles.subtitle}>
          Accede a la configuración de tu router de manera rápida y segura
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Acceder al Router</Text>
        <Text style={styles.cardText}>
          Toca el botón para acceder directamente a la configuración de tu router.
          No necesitas descargar nada, todo se hace desde aquí.
        </Text>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={getDefaultGateway}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Acceder al Router</Text>
          )}
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {showConfig && gateway ? (
        <View style={styles.configCard}>
          <Text style={styles.configTitle}>Configuración del Router</Text>
          <View style={styles.gatewayInfo}>
            <Text style={styles.gatewayText}>
              Dirección del router: <Text style={styles.gatewayValue}>{gateway}</Text>
            </Text>
          </View>
          
          <View style={styles.webviewContainer}>
            <WebView
              source={{ uri: `http://${gateway}` }}
              style={styles.webview}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                setError('No se pudo cargar la página del router. Intenta abrir en el navegador.');
              }}
            />
          </View>

          <TouchableOpacity
            style={styles.browserButton}
            onPress={handleOpenInBrowser}
          >
            <Text style={styles.browserButtonText}>Abrir en Navegador</Text>
          </TouchableOpacity>

          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Si no puedes ver la página:</Text>
            <Text style={styles.helpText}>• Verifica que estás conectado a la red del router</Text>
            <Text style={styles.helpText}>• Intenta abrir en el navegador</Text>
            <Text style={styles.helpText}>• Reinicia el router si es necesario</Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
  configCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  configTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  gatewayInfo: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  gatewayText: {
    fontSize: 14,
    color: '#666',
  },
  gatewayValue: {
    fontFamily: 'monospace',
    color: '#333',
  },
  webviewContainer: {
    height: 400,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  webview: {
    flex: 1,
  },
  browserButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  browserButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  helpSection: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default RouterConfig; 