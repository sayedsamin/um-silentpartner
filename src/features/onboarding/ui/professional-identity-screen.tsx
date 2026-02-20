import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../providers/theme-provider';
import { AnimatedOption } from './animated-option';

const ITEMS = [
  'Current role and company',
  'Past experience and skills',
  'Education and interests',
  'Public profile information',
];

export const ProfessionalIdentityScreen = () => {
  const router = useRouter();
  const theme = useTheme();

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.white },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.white,
    },
    iconWrap: {
      marginBottom: 18,
    },
    appIcon: {
      width: 72,
      height: 72,
      borderRadius: 16,
      backgroundColor: '#17B890',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.colors.black,
      marginTop: 6,
    },
    subtitle: {
      color: theme.colors.mediumGray,
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 20,
      paddingHorizontal: 12,
      lineHeight: 20,
    },
    card: {
      width: '90%',
      backgroundColor: theme.colors.white,
      borderRadius: 12,
      padding: 16,
      marginBottom: 22,
      borderWidth: 1,
      borderColor: theme.colors.borderColor,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    cardHeading: {
      color: theme.colors.darkGray,
      fontWeight: '700',
      marginBottom: 12,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    rowText: {
      color: theme.colors.darkGray,
      marginLeft: 10,
    },
    connectButton: {
      width: '90%',
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 6,
    },
    connectInner: { flexDirection: 'row', alignItems: 'center' },
    connectText: { color: theme.colors.white, fontWeight: '700', fontSize: 16 },
    privacy: {
      color: '#9A9A9A',
      marginTop: 12,
      fontSize: 12,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <View style={styles.appIcon}>
            <Ionicons name="person-outline" size={36} color={theme.colors.white} />
          </View>
        </View>

        <Text style={styles.title}>Professional Identity</Text>
        <Text style={styles.subtitle}>
          Import your professional history to let our AI find your perfect matches.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>WHAT WE SYNC</Text>
          {ITEMS.map((item, idx) => (
            <AnimatedOption key={item} index={idx} style={styles.row}>
              <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
              <Text style={styles.rowText}>{item}</Text>
            </AnimatedOption>
          ))}
        </View>

        <TouchableOpacity style={styles.connectButton} onPress={() => router.push('/primary-goal')}>
          <View style={styles.connectInner}>
            <Ionicons name="logo-linkedin" size={20} color={theme.colors.white} />
            <Text style={styles.connectText}>  Connect LinkedIn</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.privacy}>Your data is encrypted and never sold.</Text>
      </View>
    </SafeAreaView>
  );
};
