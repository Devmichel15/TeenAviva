<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import useAuth from '../src/hooks/useAuth';
import { UserService } from '../src/services/firestore.service';
import { colors } from '../src/constants/theme';
import OnboardingFlow from '../src/screens/onboarding/OnboardingFlow';
import PostRegistrationScreen from '../src/screens/onboarding/PostRegistrationScreen';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setUserLoading(false);
      return;
    }

    const unsub = UserService.subscribe(user.uid, (data) => {
      setUserData(data);
      setUserLoading(false);
    });

    return unsub;
  }, [user]);

  if (authLoading || userLoading) {
=======
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import useAuth from "../src/hooks/useAuth";
import { colors } from "../src/constants/theme";
import OnboardingFlow from "../src/screens/onboarding/OnboardingFlow";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
>>>>>>> 99b8c04df4fe5bb22abd0185030e2cd0b3a1cdc1
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

<<<<<<< HEAD
  if (!user) {
    return <OnboardingFlow />;
  }

  if (userData?.onboardingCompleted) {
    return <Redirect href="/(tabs)" />;
  }

  return <PostRegistrationScreen user={user} />;
=======
  if (user) {
    return <Redirect href="/home" />;
  }

  return <OnboardingFlow />;
>>>>>>> 99b8c04df4fe5bb22abd0185030e2cd0b3a1cdc1
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
<<<<<<< HEAD
    justifyContent: 'center',
    alignItems: 'center',
=======
    justifyContent: "center",
    alignItems: "center",
>>>>>>> 99b8c04df4fe5bb22abd0185030e2cd0b3a1cdc1
    backgroundColor: colors.background,
  },
});
