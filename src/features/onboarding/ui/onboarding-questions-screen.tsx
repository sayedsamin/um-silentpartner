import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../../providers/auth-provider';
import { useTheme } from '../../../providers/theme-provider';
import { saveOnboardingAnswers } from '../services/save-onboarding-answers';
import { AnimatedOption } from './animated-option';

const PERSONALITY_QUESTIONS = [
  {
    question: 'Do you feel energized after spending time with a large group of people?',
    yesValue: 'Extrovert',
    noValue: 'Introvert',
  },
  {
    question: 'When faced with a sudden, unexpected change in plans, do you adapt easily without getting stressed?',
    yesValue: 'High Adaptability',
    noValue: 'High Neuroticism',
  },
  {
    question: 'Do you prefer to have a structured, organized plan rather than being spontaneous?',
    yesValue: 'Conscientious',
    noValue: 'Openness to Experience',
  },
  {
    question: 'If a close friend makes a mistake, is your first instinct to empathize rather than criticize?',
    yesValue: 'Agreeable',
    noValue: 'Disagreeable',
  },
  {
    question: 'Do you consider yourself an optimist who believes things will work out for the best?',
    yesValue: 'High Agreeableness / Positivity',
    noValue: 'Realistic / Neuroticism',
  },
];

const PRIMARY_GOAL_OPTIONS = [
  'Finding potential investors',
  'Meeting technical co-founders',
  'Exploring new job opportunities',
  'Just networking casually',
];

const CONVERSATION_OPTIONS = [
  'Deep technical dives',
  'High-level strategic vision',
  'Casual & friendly chats',
  'Quick & direct exchanges',
];

const TOPIC_OPTIONS = [
  'AI & ML',
  'Startups',
  'Design',
  'Finance',
  'Health',
  'Marketing',
  'Education',
  'Sustainability',
  'Leadership',
  'Media',
  'Blockchain',
  'SaaS',
  'Biotech',
  'Real Estate',
  'Fitness',
  'Travel',
  'Social Impact',
  'Data Science',
  'Food & Culture',
  'Cybersecurity',
];

const INITIAL_TOPIC_COUNT = 10;
const MIN_TOPIC_SELECTIONS = 5;
const STEP_LABELS = ['Personality Traits', 'Primary Goal', 'Conversation Style', 'Topic Interest'];

type Phase = 0 | 1 | 2 | 3;

export const OnboardingQuestionsScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const transitioning = useRef(false);
  const personalityAnswers = useRef<string[]>([]);

  const [phase, setPhase] = useState<Phase>(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'yes' | 'no' | null>(null);
  const [primaryGoalIdx, setPrimaryGoalIdx] = useState<number | null>(null);
  const [conversationIdx, setConversationIdx] = useState<number | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const fadeIn = () =>
    Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start(() => {
      transitioning.current = false;
    });

  const fadeOut = (then: () => void) => {
    transitioning.current = true;
    Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(then);
  };

  const advanceTo = (next: Phase) => {
    fadeOut(() => {
      setPhase(next);
      fadeIn();
    });
  };

  const handlePersonalityAnswer = (answer: 'yes' | 'no') => {
    if (selectedAnswer !== null || transitioning.current) {
      return;
    }

    setSelectedAnswer(answer);
    const q = PERSONALITY_QUESTIONS[currentQ];
    personalityAnswers.current.push(answer === 'yes' ? q.yesValue : q.noValue);

    setTimeout(() => {
      fadeOut(() => {
        if (currentQ < PERSONALITY_QUESTIONS.length - 1) {
          setCurrentQ((prev) => prev + 1);
          setSelectedAnswer(null);
          fadeIn();
          return;
        }

        setSelectedAnswer(null);
        setPhase(1);
        fadeIn();
      });
    }, 400);
  };

  const handleListSelect = (
    index: number,
    setter: (value: number) => void,
    onAdvance: () => void,
  ) => {
    if (transitioning.current || saving) {
      return;
    }

    setter(index);
    setTimeout(onAdvance, 400);
  };

  const handleTopicToggle = (index: number) => {
    if (saving) {
      return;
    }

    setSelectedTopics((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const handleFinish = async () => {
    if (
      saving ||
      selectedTopics.length < MIN_TOPIC_SELECTIONS ||
      primaryGoalIdx === null ||
      conversationIdx === null
    ) {
      return;
    }

    if (!user?.uid) {
      Alert.alert('Error', 'Session expired. Please sign in again.');
      return;
    }

    setSaving(true);
    try {
      await saveOnboardingAnswers(user.uid, {
        personalityTraits: personalityAnswers.current,
        primaryGoal: PRIMARY_GOAL_OPTIONS[primaryGoalIdx],
        conversationStyle: CONVERSATION_OPTIONS[conversationIdx],
        favoriteTopics: selectedTopics.map((index) => TOPIC_OPTIONS[index]),
      });
      router.push('/join-event');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save. Please try again.';
      Alert.alert('Error', message);
      setSaving(false);
    }
  };

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.white },
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
      backgroundColor: theme.colors.white,
    },
    header: {
      alignItems: 'center',
      marginBottom: 36,
    },
    stepNumber: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.mediumGray,
      marginBottom: 2,
      textAlign: 'center',
    },
    stepTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.black,
      textAlign: 'center',
    },
    content: { flex: 1 },
    phaseContent: { flex: 1 },
    subProgress: {
      flexDirection: 'row',
      gap: 6,
      marginBottom: 20,
      justifyContent: 'center',
    },
    subDot: {
      flex: 1,
      height: 3,
      borderRadius: 2,
      backgroundColor: theme.colors.lightGray,
    },
    subDotActive: {
      backgroundColor: theme.colors.primary,
    },
    questionNumber: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.mediumGray,
      marginBottom: 12,
    },
    questionText: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.black,
      lineHeight: 32,
      marginBottom: 8,
    },
    topicHint: {
      fontSize: 13,
      color: theme.colors.mediumGray,
      marginBottom: 20,
    },
    yesNoContainer: { gap: 12 },
    listContent: { paddingBottom: 32 },
    option: {
      paddingVertical: 18,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.borderColor,
      backgroundColor: theme.colors.white,
      marginBottom: 12,
      minHeight: 56,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    optionActive: {
      backgroundColor: theme.colors.gray,
      borderColor: theme.colors.primary,
    },
    optionText: { color: theme.colors.darkGray, fontSize: 16 },
    optionTextActive: { color: theme.colors.black, fontWeight: '700' },
    chipGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      paddingBottom: 100,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 50,
      borderWidth: 1.5,
      borderColor: theme.colors.borderColor,
      backgroundColor: theme.colors.white,
    },
    chipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    chipText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.darkGray,
    },
    chipTextActive: {
      color: theme.colors.white,
      fontWeight: '700',
    },
    lockedHint: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      width: '100%',
      marginTop: 6,
    },
    lockedText: {
      fontSize: 12,
      color: theme.colors.mediumGray,
    },
    finishButton: {
      position: 'absolute',
      bottom: 24,
      left: 0,
      right: 0,
      height: 56,
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    finishDisabled: { opacity: 0.4 },
    finishText: { color: theme.colors.white, fontSize: 16, fontWeight: '700' },
  });

  const renderListPhase = (
    options: string[],
    selectedIdx: number | null,
    onSelect: (index: number) => void,
  ) => (
    <ScrollView
      style={styles.phaseContent}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    >
      {options.map((item, index) => {
        const active = selectedIdx === index;
        return (
          <AnimatedOption key={item} index={index} style={{ marginBottom: 12 }}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onSelect(index)}
              style={[styles.option, active && styles.optionActive]}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{item}</Text>
            </TouchableOpacity>
          </AnimatedOption>
        );
      })}
    </ScrollView>
  );

  const renderTopicPhase = () => {
    const unlocked = selectedTopics.length >= MIN_TOPIC_SELECTIONS;
    const visibleCount = unlocked ? TOPIC_OPTIONS.length : INITIAL_TOPIC_COUNT;
    const remaining = MIN_TOPIC_SELECTIONS - selectedTopics.length;

    return (
      <View style={styles.phaseContent}>
        <Text style={styles.questionText}>Pick your top interests.</Text>
        <Text style={styles.topicHint}>
          {selectedTopics.length < MIN_TOPIC_SELECTIONS
            ? `Select ${remaining} more to continue`
            : `${selectedTopics.length} selected - tap Finish when ready`}
        </Text>

        <ScrollView contentContainerStyle={styles.chipGrid} showsVerticalScrollIndicator={false}>
          {TOPIC_OPTIONS.slice(0, visibleCount).map((item, index) => {
            const active = selectedTopics.includes(index);
            const isNewlyUnlocked = index >= INITIAL_TOPIC_COUNT;
            return (
              <AnimatedOption key={item} index={isNewlyUnlocked ? index - INITIAL_TOPIC_COUNT : 0}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleTopicToggle(index)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  {active ? (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={theme.colors.white}
                      style={{ marginRight: 4 }}
                    />
                  ) : null}
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              </AnimatedOption>
            );
          })}

          {unlocked ? null : (
            <View style={styles.lockedHint}>
              <Ionicons name="lock-closed-outline" size={14} color={theme.colors.mediumGray} />
              <Text style={styles.lockedText}>
                10 more topics unlock after {MIN_TOPIC_SELECTIONS} selections
              </Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.finishButton,
            (selectedTopics.length < MIN_TOPIC_SELECTIONS || saving) && styles.finishDisabled,
          ]}
          onPress={() => void handleFinish()}
          disabled={selectedTopics.length < MIN_TOPIC_SELECTIONS || saving}
        >
          {saving ? <ActivityIndicator color={theme.colors.white} /> : <Text style={styles.finishText}>Finish</Text>}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.stepNumber}>Step {phase + 1} of 4</Text>
          <Text style={styles.stepTitle}>{STEP_LABELS[phase]}</Text>
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {phase === 0 ? (
            <View style={styles.phaseContent}>
              <View style={styles.subProgress}>
                {PERSONALITY_QUESTIONS.map((_, index) => (
                  <View key={index} style={[styles.subDot, index <= currentQ && styles.subDotActive]} />
                ))}
              </View>
              <AnimatedOption key={`qnum-${currentQ}`} index={0}>
                <Text style={styles.questionNumber}>
                  Question {currentQ + 1} of {PERSONALITY_QUESTIONS.length}
                </Text>
              </AnimatedOption>
              <AnimatedOption key={`qtxt-${currentQ}`} index={1}>
                <Text style={styles.questionText}>{PERSONALITY_QUESTIONS[currentQ].question}</Text>
              </AnimatedOption>
              <View style={styles.yesNoContainer}>
                <AnimatedOption key={`yes-${currentQ}`} index={2}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.option, selectedAnswer === 'yes' && styles.optionActive]}
                    onPress={() => handlePersonalityAnswer('yes')}
                  >
                    <Text style={[styles.optionText, selectedAnswer === 'yes' && styles.optionTextActive]}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                </AnimatedOption>
                <AnimatedOption key={`no-${currentQ}`} index={3}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.option, selectedAnswer === 'no' && styles.optionActive]}
                    onPress={() => handlePersonalityAnswer('no')}
                  >
                    <Text style={[styles.optionText, selectedAnswer === 'no' && styles.optionTextActive]}>
                      No
                    </Text>
                  </TouchableOpacity>
                </AnimatedOption>
              </View>
            </View>
          ) : null}

          {phase === 1 ? (
            <>
              <Text style={styles.questionText}>What's your primary goal today?</Text>
              {renderListPhase(PRIMARY_GOAL_OPTIONS, primaryGoalIdx, (index) =>
                handleListSelect(index, setPrimaryGoalIdx, () => advanceTo(2)),
              )}
            </>
          ) : null}

          {phase === 2 ? (
            <>
              <Text style={styles.questionText}>How do you prefer to converse?</Text>
              {renderListPhase(CONVERSATION_OPTIONS, conversationIdx, (index) =>
                handleListSelect(index, setConversationIdx, () => advanceTo(3)),
              )}
            </>
          ) : null}

          {phase === 3 ? renderTopicPhase() : null}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};
