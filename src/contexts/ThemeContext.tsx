import React, { createContext, useContext, ReactNode } from 'react';
import { neonPurpleTheme } from '../themes/neonPurple';
import { neonCyanTheme } from '../themes/neonCyan';

export type ThemeName = 'neon-purple' | 'neon-cyan';

interface ThemeContextValue {
  theme: ThemeName;
  glassmorphism: boolean;
  neonEffects: boolean;
  setTheme: (theme: ThemeName) => void;
  setGlassmorphism: (enabled: boolean) => void;
  setNeonEffects: (enabled: boolean) => void;
  colors: any;
  effects: any;
  typography: any;
  spacing: any;
  borderRadius: any;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = React.useState<ThemeName>('neon-purple');
  const [glassmorphism, setGlassmorphism] = React.useState(true);
  const [neonEffects, setNeonEffects] = React.useState(true);

  const themeConfig = theme === 'neon-purple' ? neonPurpleTheme : neonCyanTheme;

  const value: ThemeContextValue = {
    theme,
    glassmorphism,
    neonEffects,
    setTheme,
    setGlassmorphism,
    setNeonEffects,
    colors: themeConfig.colors,
    effects: themeConfig.effects,
    typography: themeConfig.typography,
    spacing: themeConfig.spacing,
    borderRadius: themeConfig.borderRadius,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
