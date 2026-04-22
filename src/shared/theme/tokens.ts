import { fonts } from "@/shared/constants/fonts";

const primitives = {
  color: {
    white: "#FFFFFF",
    black: "#000000",
    brand900: "#003178",
    brand800: "#0D47A1",
    brand100: "#CFE6F2",
    canvas50: "#F6FAFE",
    surface100: "#F0F4F8",
    ink900: "#171C1F",
    ink700: "#434652",
    ink500: "#4C616C",
    border200: "#D7DEE7",
    border100: "#EEF3F8",
    danger700: "#BA1A1A",
    success700: "#1C7C54",
    warning700: "#B7791F"
  },
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    14: 56,
    16: 64,
    24: 96,
    32: 128
  },
  radius: {
    none: 0,
    sm: 12,
    md: 16,
    lg: 24,
    pill: 999
  },
  typography: {
    display: {
      large: {
        fontFamily: fonts.heading.black,
        fontSize: 48,
        lineHeight: 48,
        letterSpacing: -2.4
      }
    },
    heading: {
      xl: {
        fontFamily: fonts.heading.black,
        fontSize: 36,
        lineHeight: 40,
        letterSpacing: -0.9
      },
      lg: {
        fontFamily: fonts.heading.bold,
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: -0.3
      },
      md: {
        fontFamily: fonts.heading.regular,
        fontSize: 18,
        lineHeight: 28,
        letterSpacing: 0
      }
    },
    body: {
      lg: {
        fontFamily: fonts.body.regular,
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0
      },
      md: {
        fontFamily: fonts.body.regular,
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0
      }
    },
    label: {
      md: {
        fontFamily: fonts.body.semibold,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 1.2
      },
      sm: {
        fontFamily: fonts.body.semibold,
        fontSize: 10,
        lineHeight: 15,
        letterSpacing: 1
      }
    },
    button: {
      md: {
        fontFamily: fonts.body.semibold,
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0
      }
    }
  },
  shadow: {
    card: {
      shadowColor: "#000000",
      shadowOpacity: 0.05,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1
    },
    floating: {
      shadowColor: "#003178",
      shadowOpacity: 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8
    }
  }
} as const;

export const lightTheme = {
  ...primitives,
  semantic: {
    background: {
      app: primitives.color.canvas50,
      surface: primitives.color.white,
      muted: primitives.color.surface100,
      emphasis: primitives.color.brand900,
      accent: primitives.color.brand100
    },
    foreground: {
      primary: primitives.color.ink900,
      secondary: primitives.color.ink700,
      tertiary: primitives.color.ink500,
      inverse: primitives.color.white,
      brand: primitives.color.brand900
    },
    border: {
      subtle: primitives.color.border200,
      soft: primitives.color.border100
    },
    status: {
      danger: primitives.color.danger700,
      success: primitives.color.success700,
      warning: primitives.color.warning700,
      info: primitives.color.brand800
    }
  }
} as const;

export const darkTheme = {
  ...primitives,
  semantic: {
    background: {
      app: "#09111D",
      surface: "#101B2B",
      muted: "#162436",
      emphasis: primitives.color.brand800,
      accent: "#183252"
    },
    foreground: {
      primary: "#F7FAFD",
      secondary: "#C9D4E0",
      tertiary: "#9AABBD",
      inverse: primitives.color.ink900,
      brand: "#9CC3FF"
    },
    border: {
      subtle: "#22354E",
      soft: "#1A2A3D"
    },
    status: {
      danger: "#FFB4AB",
      success: "#7ED8A7",
      warning: "#F0C674",
      info: "#8DB8FF"
    }
  }
} as const;

export type AppTheme = typeof lightTheme | typeof darkTheme;
