import { View, Text, StyleSheet } from 'react-native';
import { Trophy, Flame, Book, Star, Heart } from 'lucide-react-native';
import { colors } from '../../constants/theme';

const ICON_MAP = {
  fire: Flame,
  book: Book,
  star: Star,
  heart: Heart,
};

function BadgeIcon({ icon, earned }) {
  const color = earned ? colors.sage : 'rgba(255,255,255,0.3)';
  const size = 14;

  const IconComponent = ICON_MAP[icon] || Trophy;

  return <IconComponent size={size} color={color} />;
}

export default function BadgesGrid({ achievements }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>conquistas</Text>
      <View style={styles.grid}>
        {achievements.map((badge) => (
          <View
            key={badge.id}
            style={[styles.badge, badge.earned && styles.badgeEarned]}
          >
            <View
              style={[
                styles.iconWrap,
                badge.earned
                  ? styles.iconEarned
                  : styles.iconLocked,
              ]}
            >
              <BadgeIcon icon={badge.icon} earned={badge.earned} />
            </View>
            <Text
              style={[styles.name, badge.earned && styles.nameEarned]}
            >
              {badge.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 8,
    letterSpacing: 2.5,
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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    gap: 5,
  },
  badgeEarned: {
    backgroundColor: 'rgba(163,177,138,0.1)',
    borderColor: 'rgba(163,177,138,0.25)',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    textAlign: 'center',
    lineHeight: 12,
    fontFamily: 'ManropeRegular',
  },
  nameEarned: {
    color: colors.sage,
  },
});
