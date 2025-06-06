import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Container({ children, style }) {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'right', 'left', 'bottom']} // Isso protege todas as bordas
      >
        <View style={[styles.container, style]}>
          {children}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
    width: '100%',
    height: '100%'
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 16,
  },
});