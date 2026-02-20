import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../providers/theme-provider';

const FRAME_SIZE = 240;
const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;

export const QrScannerScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    overlay: {
      flex: 1,
    },
    closeButton: {
      margin: 16,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    frameContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    frame: {
      width: FRAME_SIZE,
      height: FRAME_SIZE,
      position: 'relative',
    },
    corner: {
      position: 'absolute',
      width: CORNER_SIZE,
      height: CORNER_SIZE,
      borderColor: theme.colors.white,
    },
    topLeft: {
      top: 0,
      left: 0,
      borderTopWidth: CORNER_THICKNESS,
      borderLeftWidth: CORNER_THICKNESS,
      borderTopLeftRadius: 4,
    },
    topRight: {
      top: 0,
      right: 0,
      borderTopWidth: CORNER_THICKNESS,
      borderRightWidth: CORNER_THICKNESS,
      borderTopRightRadius: 4,
    },
    bottomLeft: {
      bottom: 0,
      left: 0,
      borderBottomWidth: CORNER_THICKNESS,
      borderLeftWidth: CORNER_THICKNESS,
      borderBottomLeftRadius: 4,
    },
    bottomRight: {
      bottom: 0,
      right: 0,
      borderBottomWidth: CORNER_THICKNESS,
      borderRightWidth: CORNER_THICKNESS,
      borderBottomRightRadius: 4,
    },
    hint: {
      marginTop: 24,
      fontSize: 14,
      color: theme.colors.white,
      textAlign: 'center',
      opacity: 0.85,
    },
    safeArea: { flex: 1, backgroundColor: theme.colors.white },
    permissionSafe: {
      flex: 1,
      backgroundColor: theme.colors.white,
    },
    permissionContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.black,
      marginTop: 20,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 15,
      color: theme.colors.mediumGray,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 24,
    },
    permissionButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 14,
      paddingVertical: 15,
      paddingHorizontal: 40,
      marginBottom: 12,
    },
    permissionButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.white,
    },
    cancelButton: {
      paddingVertical: 10,
    },
    cancelText: {
      fontSize: 15,
      color: theme.colors.mediumGray,
    },
  });

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionSafe}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color={theme.colors.mediumGray} />
          <Text style={styles.title}>Camera Access Needed</Text>
          <Text style={styles.subtitle}>
            Allow camera access to scan event QR codes and check in instantly.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Allow Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    Alert.alert('QR Code Scanned', `Event code: ${data}`, [
      { text: 'Scan Again', onPress: () => setScanned(false) },
      { text: 'Continue', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />
      <SafeAreaView style={styles.overlay}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <View style={styles.frameContainer}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.hint}>Point at an event QR code to scan</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};
