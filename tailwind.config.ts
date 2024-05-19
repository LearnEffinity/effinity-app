import type { Config } from "tailwindcss";

const neutral = {
    50: "#F8F8FC",
    100: "#EAE9F2",
    200: "#EFEEF6",
    300: "#BCBBC3",
    400: "#636369",
    500: "#505055",
    600: "#333336",
    700: "#080808",
  },
  brand = {
    primary: "#4D37C9",
    secondary: "#7C71F4",
    tertiary: "#7C71F4",
    quaternary: "#7C71F4",
    accent: "#583AFE",
  },
  error = {
    100: "#FFCCD2",
    200: "#F49898",
    300: "#EB6F70",
    400: "#F64C4C",
    500: "#EC2D30",
  },
  warning = {
    100: "#FFEAB3",
    200: "#FFDD82",
    300: "#FFC62B",
    400: "#FFAD0D",
    500: "#FE9B0E",
  },
  success = {
    100: "#C0E5D1",
    200: "#97D4B4",
    300: "#6BC497",
    400: "#47B881",
    500: "#0C9D61",
  },
  info = {
    100: "#BDDDFF",
    200: "#93C8FF",
    300: "#4BA1FF",
    400: "#3B82F6",
    500: "#3A70E2",
  },
  surface = {
    base: neutral[200],
    primary: "white",
    secondary: neutral[300],
    tertiary: neutral[400],
  };

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral,
        brand,
        error,
        warning,
        success,
        info,
        surface,
        button: {
          DEFAULT: brand.accent,
          pressed: brand.primary,
          hover: brand.tertiary,
          disabled: brand.quaternary,
          surface: surface.primary,
        },
        input: {
          DEFAULT: neutral[300],
          surface: "white",
          pressed: brand.primary,
          error: error[400],
          success: success[400],
          filled: info[100],
          disabled: neutral[100],
        },
        icon: {
          primary: neutral[700],
          secondary: neutral[500],
          tertiary: neutral[300],
          quaternary: neutral[100],
          accent: {
            DEFAULT: brand.accent,
            primary: brand.primary,
            secondary: brand.secondary,
            tertiary: brand.tertiary,
            quaternary: brand.quaternary,
          },
        },
        text: {
          primary: neutral[700],
          secondary: neutral[500],
          tertiary: neutral[300],
          quaternary: neutral[100],
          info: info[400],
          success: success[400],
          warning: warning[400],
          error: error[400],
        },
      },
      fontSize: {
        "3xl": "1.75rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
