import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../providers/theme-provider';
import { AnimatedOption } from './animated-option';

const OPTIONS = [
  'Deep technical dives',
  'High-level strategic vision',
  'Casual & friendly chats',
  'Quick & direct exchanges',
];

export const ConversationStyleScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const [selected, setSelected] = useState<number | null>(null);

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.white },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 24,
      backgroundColor: theme.colors.white,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.black,
      marginBottom: 18,
    },
    list: { paddingBottom: 24 },
    option: {
      paddingVertical: 18,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.borderColor,
      backgroundColor: theme.colors.white,
      marginBottom: 12,
    },
    optionActive: {
      backgroundColor: theme.colors.gray,
      borderColor: theme.colors.primary,
    },
    optionText: {
      color: theme.colors.darkGray,
      fontSize: 16,
    },
    optionTextActive: {
      color: theme.colors.black,
      fontWeight: '700',
    },
    continueButton: {
      position: 'absolute',
      bottom: 24,
      left: 20,
      right: 20,
      height: 56,
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    continueDisabled: { opacity: 0.6 },
    continueText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: '700',
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>How do you prefer to converse?</Text>

        <FlatList
          data={OPTIONS}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const active = selected === index;

            return (
              <AnimatedOption index={index} style={{ marginBottom: 12 }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.option, active ? styles.optionActive : null]}
                  onPress={() => setSelected(index)}
                >
                  <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{item}</Text>
                </TouchableOpacity>
              </AnimatedOption>
            );
          }}
        />

        <TouchableOpacity
          style={[styles.continueButton, selected === null ? styles.continueDisabled : null]}
          onPress={() => selected !== null && router.push('/join-event')}
          disabled={selected === null}
        >
          <Text style={styles.continueText}>Finish -&gt;</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
