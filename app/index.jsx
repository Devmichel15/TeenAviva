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
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  if (!user) {
    return <OnboardingFlow />;
  }

  if (userData?.onboardingCompleted) {
    return <Redirect href="/(tabs)" />;
  }

  return <PostRegistrationScreen user={user} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
