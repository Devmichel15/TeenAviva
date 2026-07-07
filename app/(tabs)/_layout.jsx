import { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../src/constants/theme';
import TabNavigator from '../../src/navigation/TabNavigator';
import HomeScreen from '../../src/screens/HomeScreen';
import IAScreen from '../../src/screens/IAScreen';
import ChamaScreen from '../../src/screens/OfensivaScreen';
import PerfilScreen from '../../src/screens/PerfilScreen';

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

  const hideTabBar = activeTab === 'ia';

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
          />
        )}
        {activeTab === 'chama' && <ChamaScreen />}
        {activeTab === 'perfil' && <PerfilScreen />}
      </View>

      {!hideTabBar && (
        <TabNavigator activeTab={activeTab} onTabPress={handleTabPress} />
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
