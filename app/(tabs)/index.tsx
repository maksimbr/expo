import { Image, StyleSheet, Platform, Alert } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { View} from '../../components/ui/view'
import { Card } from '../../components/ui/card'
import { Heading } from '../../components/ui/heading'
import { Text } from '../../components/ui/text'
import { Progress, ProgressFilledTrack } from '../../components/ui/progress'

import { Pedometer } from 'expo-sensors';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [steps, setSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [dailyCalorieGoal] = useState(2000);
  const [caloriesConsumed] = useState(Math.floor(Math.random() * 1500));

  useEffect(() => {
    const checkPedometerAvailability = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);

      if (isAvailable) {
        // You can simplify retrieving steps from the start of the day:
        const start = new Date();
        start.setHours(0, 0, 0, 0); // Set to midnight
        const end = new Date();
        end.setHours(23, 59, 59, 999); // Set to 11:59:59 PM

        const { steps } = await Pedometer.getStepCountAsync(start, end);
        setSteps(steps);
        localStorage.setItem('steps', steps.toString());

        // Subscribe for live updates 
        const subscription = Pedometer.watchStepCount(result => {
          setSteps(result.steps);
        });

        return () => subscription.remove(); 
      } else {
        Alert.alert('Pedometer Not Available', 'This device does not support step tracking.');
      }
    };

    checkPedometerAvailability();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
       <View className="flex flex-row justify-around p-2 flex-wrap gap-3">
        <Card
          size="md"
          variant="elevated"
          className='border-2 p-4 border-gray-300 border-solid rounded-lg'
        >
          <Heading size="md" className="mb-1"> 
            Today's Steps
          </Heading>
          <Text size="2xl" style={styles.stepsValue}>
            {steps}
          </Text>
        </Card>

        {/* Calories Card */}
        <Card
          size="md"
          variant="elevated"
          className='border-2 p-4 border-gray-300 border-solid rounded-lg'
        >
          <Heading size="md" className="mb-2"> 
            Calorie Intake
          </Heading>
          <Progress
            value={caloriesConsumed / dailyCalorieGoal * 100} 
            size="sm" // Use Glue Stack's "sm" size for a smaller progress bar
            className="mb-3" 
          >
            <ProgressFilledTrack className="bg-emerald-600" />
          </Progress>
          <View className="flex flex-row gap-1 justify-between">
            <Text size="sm">Consumed: {caloriesConsumed}</Text>
            <Text size="sm" className='font-bold'>Goal: {dailyCalorieGoal}</Text>
          </View>
        </Card>

        <Card
          size="md"
          variant="elevated"
          className='border-2 p-4 border-gray-300 border-solid rounded-lg'
        >
          <Heading size="md" className="mb-1"> 
            Meals Taken
          </Heading>
          <Text size="2xl" style={styles.stepsValue}>
            2
          </Text>
        </Card>
      </View>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    flexWrap: 'wrap', // Allow wrapping if cards don't fit on one row
    gap: 20,         // Add spacing between cards 
  },
  card: {
    width: '45%', 
    minHeight: 150, 
    padding: 20,
  },
  cardBorder: { // Add a border to the cards
    borderWidth: 1,
    borderColor: '#ddd', // Adjust border color as needed
  }, 
  stepsValue: {
    fontWeight: 'bold', 
    fontSize: 25, // Make the steps value larger
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center', // Center the text
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
