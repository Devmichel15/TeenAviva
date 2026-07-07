import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchDailyVerse } from '../services/bible.service';

const CACHE_KEY = 'teenaviva_daily_verse';

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export default function useDailyVerse() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadVerse = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const today = getTodayString();

      if (!forceRefresh) {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.date === today) {
            setVerse(parsed);
            setLoading(false);
            return;
          }
        }
      }

      const fresh = await fetchDailyVerse();
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
      setVerse(fresh);
    } catch (err) {
      setError(err.message || 'Erro ao carregar versículo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVerse();
  }, [loadVerse]);

  const retry = useCallback(() => {
    loadVerse(true);
  }, [loadVerse]);

  return { verse, loading, error, retry };
}
