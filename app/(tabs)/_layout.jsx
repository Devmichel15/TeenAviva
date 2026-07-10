import { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../src/constants/theme';
import Navbar from '../../src/components/navbar/Navbar';
import HomeScreen from '../../src/screens/HomeScreen';
import IAScreen from '../../src/screens/IAScreen';
import ChamaScreen from '../../src/screens/OfensivaScreen';
import PerfilScreen from '../../src/screens/PerfilScreen';
import PlanDayScreen from '../../src/screens/PlanDayScreen';

export default function TabsLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [iaParams, setIaParams] = useState(null);

  const handleTabPress = useCallback((key) => {
    setActiveTab(key);
  }, []);

  const handleNavigate = useCallback((screen, params) => {
    if (screen === 'ia') {
      setIaParams(params);
      setActiveTab('ia');
    } else if (screen === 'chama') {
      setActiveTab('chama');
    }
  }, []);

  const handleBackFromGuide = useCallback(() => {
    setActiveTab('home');
    setIaParams(null);
  }, []);

  const handleBackToChama = useCallback(() => {
    setActiveTab('chama');
  }, []);

  const handleContinuePlan = useCallback(() => {
    setActiveTab('planDay');
  }, []);

  const handleSelectPlan = useCallback(() => {
    setActiveTab('planDay');
  }, []);

  const handleOpenGuideFromPlan = useCallback(({ prefill, context }) => {
    setIaParams({
      verse: null,
      emotionalState: null,
      prefill,
      context,
    });
    setActiveTab('ia');
  }, []);

  const hideTabBar = activeTab === 'ia' || activeTab === 'planDay';

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        {activeTab === 'home' && (
          <HomeScreen onNavigate={handleNavigate} />
        )}
        {activeTab === 'ia' && (
          <IAScreen
            verse={iaParams?.verse}
            emotionalState={iaParams?.emotionalState}
            onBack={handleBackFromGuide}
            prefill={iaParams?.prefill}
            prefillContext={iaParams?.context}
          />
        )}
        {activeTab === 'chama' && (
          <ChamaScreen
            onContinuePlan={handleContinuePlan}
            onSelectPlan={handleSelectPlan}
          />
        )}
        {activeTab === 'planDay' && (
          <PlanDayScreen
            onBack={handleBackToChama}
            onOpenGuide={handleOpenGuideFromPlan}
          />
        )}
        {activeTab === 'perfil' && <PerfilScreen />}
      </View>

      {!hideTabBar && (
        <Navbar activeTab={activeTab} onTabPress={handleTabPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
});
