/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#003178",
          strong: "#0D47A1",
          soft: "#CFE6F2"
        },
        canvas: "#F6FAFE",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F0F4F8",
          inverse: "#171C1F"
        },
        text: {
          primary: "#171C1F",
          secondary: "#434652",
          tertiary: "#4C616C",
          inverse: "#FFFFFF"
        },
        border: {
          subtle: "#D7DEE7",
          soft: "#EEF3F8"
        },
        status: {
          danger: "#BA1A1A",
          success: "#1C7C54",
          warning: "#B7791F",
          info: "#0D47A1"
        }
      },
      fontFamily: {
        heading: ["PlusJakartaSans-ExtraBold", "System"],
        body: ["Inter", "System"]
      },
      borderRadius: {
        sm: "12px",
        md: "16px",
        lg: "24px",
        pill: "999px"
      },
      boxShadow: {
        card: "0px 1px 2px rgba(0, 0, 0, 0.05)",
        floating: "0px 20px 25px rgba(0, 49, 120, 0.1)"
      },
      spacing: {
        4.5: "18px"
      }
    }
  },
  plugins: []
};
