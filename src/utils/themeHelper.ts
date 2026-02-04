export interface ExtendedTheme {
  theme: 'neon-purple' | 'neon-cyan';
  glassmorphism: boolean;
  neonEffects: boolean;
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    surface?: string;
    text?: string;
    glass?: {
      background?: string;
      border?: string;
    };
  };
  effects?: {
    blur?: {
      strength?: number;
    };
    glow?: {
      intensity?: number;
    };
  };
}

export function getThemeProperty(theme: any, property: string): any {
  if (typeof theme !== 'object' || theme === null) {
    return undefined;
  }

  const path = property.split('.');
  let current = theme;

  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return current;
}

export function getSafeBackgroundColor(theme: any): string {
  if (theme.glassmorphism && theme.colors?.glass?.background) {
    return theme.colors.glass.background;
  }

  return theme.colors?.background || '#0a0a0a';
}

export function getSafeBlur(theme: any): string {
  if (theme.glassmorphism) {
    const blurStrength = theme.effects?.blur?.strength || 20;
    return `blur(${blurStrength}px)`;
  }

  return 'none';
}

export function getSafePrimaryColor(theme: any): string {
  return theme.colors?.primary || '#8a2be2';
}
