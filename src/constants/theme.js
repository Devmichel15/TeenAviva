export const colors = {
  primaryBrown: "#8C5E3C",
  brownDark: "#684123",
  brownDeep: "#1C1410",
  background: "#1C1410",
  sage: "#A3B18A",
  sageDark: "#75835C",
  lightGreen: "#A3B18A",
  gold: "#C9973A",
  goldLight: "rgba(201,151,58,0.1)",
  white: "#ffffff",
  black: "#000000",
  cardBg: "rgba(255, 255, 255, 0.08)",
  cardBorder: "rgba(255, 255, 255, 0.15)",
  inputBg: "rgba(255, 255, 255, 0.1)",
  placeholder: "rgba(255, 255, 255, 0.5)",
  divider: "rgba(255, 255, 255, 0.2)",
  inactiveDot: "rgba(255, 255, 255, 0.3)",
  streakGreen: "#A3B18A",
  textDim: "rgba(255, 255, 255, 0.55)",
  textMid: "rgba(255, 255, 255, 0.75)",
  textPrimary: "rgba(255, 255, 255, 0.9)",
  sageBg: "rgba(163, 177, 138, 0.12)",
  sageBorder: "rgba(163, 177, 138, 0.3)",
  goldBg: "rgba(201, 151, 58, 0.09)",
  goldBorder: "rgba(201, 151, 58, 0.22)",
  brownCardBg: "rgba(140, 94, 60, 0.14)",
  brownCardBorder: "rgba(140, 94, 60, 0.28)",
  white04: "rgba(255, 255, 255, 0.04)",
  white06: "rgba(255, 255, 255, 0.06)",
  white08: "rgba(255, 255, 255, 0.08)",
};

export const readingColors = {
  background: "#FAF8F5",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#5A5A5A",
  textMuted: "#A0A0A0",
  border: "#E5E2DD",
  accent: "#A3B18A",
  accentText: "#75835C",
  highlight: "#C9973A",
  divider: "#EDEAE5",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  card: 14,
  button: 10,
  input: 10,
  chip: 10,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 8,
  },
};

export const readingShadows = {
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 0,
    elevation: 2,
  },
  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 4,
  },
};

export const typography = {
  heading: {
    fontSize: 64,
    lineHeight: 64,
    fontFamily: "ManropeRegular",
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: "ManropeBold",
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: "ManropeLight",
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "ManropeRegular",
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "ManropeRegular",
  },
  small: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: "ManropeSemiBold",
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "ManropeSemiBold",
  },
  goldText: {
    color: colors.gold,
  },
  verseText: {
    fontSize: 15,
    lineHeight: 26,
    fontFamily: "ManropeLight",
    fontStyle: "italic",
  },
  statNumber: {
    fontSize: 22,
    lineHeight: 22,
    fontFamily: "ManropeLight",
  },
  streakNumber: {
    fontSize: 28,
    lineHeight: 28,
    fontFamily: "ManropeLight",
  },
  eyebrow: {
    fontSize: 9,
    lineHeight: 12,
    fontFamily: "ManropeSemiBold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  button: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: "ManropeSemiBold",
    letterSpacing: 0.5,
  },
  tabLabel: {
    fontSize: 8,
    lineHeight: 10,
    fontFamily: "ManropeSemiBold",
    letterSpacing: 0.5,
  },
  readingH1: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: "ManropeBold",
    color: "#1A1A1A",
  },
  readingH2: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: "ManropeSemiBold",
    color: "#1A1A1A",
  },
  readingBody: {
    fontSize: 16,
    lineHeight: 28,
    fontFamily: "ManropeRegular",
    color: "#2A2A2A",
  },
  readingVerse: {
    fontSize: 17,
    lineHeight: 30,
    fontFamily: "ManropeLight",
    fontStyle: "italic",
    color: "#3A3A3A",
  },
  readingSmall: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "ManropeRegular",
    color: "#5A5A5A",
  },
};
