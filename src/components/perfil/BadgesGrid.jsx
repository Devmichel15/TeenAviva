import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../constants/theme';
import { Flame, Book, Star, Heart } from 'lucide-react-native';

const ICON_MAP = {
  fire: Flame,
  book: Book,
  star: Star,
  heart: Heart,
};

export default function BadgesGrid({ achievements }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Conquistas</Text>
      <View style={styles.grid}>
        {achievements.map((badge) => {
          const IconComponent = ICON_MAP[badge.icon] || Star;
          return (
            <View
              key={badge.id}
              style={[
                styles.badge,
                badge.earned && styles.badgeEarned,
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  badge.earned ? styles.iconEarned : styles.iconLocked,
                ]}
              >
                <IconComponent
                  size={14}
                  color={badge.earned ? colors.sage : 'rgba(255,255,255,0.25)'}
                />
              </View>
              <Text
                style={[
                  styles.name,
                  badge.earned && styles.nameEarned,
                ]}
                numberOfLines={1}
              >
                {badge.title}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.25)',
    fontFamily: 'ManropeSemiBold',
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: colors.white04,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.card,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  badgeEarned: {
    backgroundColor: 'rgba(163,177,138,0.1)',
    borderColor: 'rgba(163,177,138,0.25)',
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEarned: {
    backgroundColor: 'rgba(163,177,138,0.2)',
  },
  iconLocked: {
    backgroundColor: colors.white06,
  },
  name: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'ManropeRegular',
    textAlign: 'center',
  },
  nameEarned: {
    color: colors.sage,
  },
});
