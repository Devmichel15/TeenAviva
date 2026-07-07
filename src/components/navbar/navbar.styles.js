import { StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export const BRUTAL_SHADOW = {
  shadowColor: colors.black,
  shadowOffset: { width: 3, height: 3 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 6,
};

export const BRUTAL_SHADOW_SM = {
  shadowColor: colors.black,
  shadowOffset: { width: 2, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 4,
};

export const BRUTAL_SHADOW_ACTIVE = {
  shadowColor: colors.black,
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 8,
};

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.brownDeep,
    borderTopWidth: 2.5,
    borderTopColor: colors.black,
    paddingTop: 10,
    paddingHorizontal: 6,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 62,
    gap: 4,
  },
  itemActive: {
    backgroundColor: 'rgba(201, 151, 58, 0.18)',
    borderColor: colors.gold,
    ...BRUTAL_SHADOW_SM,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.gold,
  },
  label: {
    fontSize: 8,
    fontFamily: 'ManropeSemiBold',
    letterSpacing: 0.8,
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
  },
  labelActive: {
    color: colors.gold,
  },
});
