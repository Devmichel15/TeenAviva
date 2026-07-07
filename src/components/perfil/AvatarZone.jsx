import { View, Text, StyleSheet } from 'react-native';
import { Camera } from 'lucide-react-native';
import { colors } from '../../constants/theme';
import AnimatedPressable from '../ui/AnimatedPressable';
import { formatDate } from '../../utils/formatting';

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function AvatarZone({ user, onEditPhoto }) {
  if (!user) return null;

  const joinDate = user.createdAt?.toDate
    ? formatDate(user.createdAt.toDate())
    : '';

  return (
    <View style={styles.container}>
      <AnimatedPressable onPress={onEditPhoto}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{getInitials(user.name)}</Text>
          <View style={styles.editBadge}>
            <Camera size={10} color={colors.background} />
          </View>
        </View>
      </AnimatedPressable>
      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.since}>
          {joinDate ? `membro desde ${joinDate}` : ''}
        </Text>
        {user.favoriteVerse && (
          <Text style={styles.verse}>"{user.favoriteVerse}"</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(140,94,60,0.3)',
    borderWidth: 2,
    borderColor: 'rgba(140,94,60,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  initials: {
    fontSize: 20,
    fontWeight: '200',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'ManropeLight',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    gap: 3,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '300',
    color: '#fff',
    fontFamily: 'ManropeLight',
  },
  since: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
    fontFamily: 'ManropeRegular',
  },
  verse: {
    fontSize: 10,
    color: colors.sage,
    fontStyle: 'italic',
    marginTop: 2,
    fontFamily: 'ManropeRegular',
  },
});
