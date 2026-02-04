export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  glass: string;
  glow: string;
  text: string;
  textMuted: string;
}

export type ThemeMode = 'NeonPurple' | 'CyberCyan' | 'DeepOcean' | 'LightMinimal';

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: ThemeMode = 'NeonPurple';
  private themes: Record<ThemeMode, ThemeColors> = {
    NeonPurple: {
      primary: '#7C3AED',
      secondary: '#A78BFA',
      accent: '#D946EF',
      background: '#050505',
      surface: '#0F0F0F',
      glass: 'rgba(124, 58, 237, 0.05)',
      glow: '0 0 20px rgba(124, 58, 237, 0.4)',
      text: '#FFFFFF',
      textMuted: '#9CA3AF',
    },
    CyberCyan: {
      primary: '#06B6D4',
      secondary: '#22D3EE',
      accent: '#10B981',
      background: '#020617',
      surface: '#0F172A',
      glass: 'rgba(6, 182, 212, 0.05)',
      glow: '0 0 20px rgba(6, 182, 212, 0.4)',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
    },
    DeepOcean: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#60A5FA',
      background: '#000814',
      surface: '#001D3D',
      glass: 'rgba(30, 64, 175, 0.05)',
      glow: '0 0 15px rgba(30, 64, 175, 0.3)',
      text: '#E0E1DD',
      textMuted: '#778DA9',
    },
    LightMinimal: {
      primary: '#000000',
      secondary: '#4B5563',
      accent: '#1F2937',
      background: '#FFFFFF',
      surface: '#F3F4F6',
      glass: 'rgba(0, 0, 0, 0.02)',
      glow: 'none',
      text: '#111827',
      textMuted: '#6B7280',
    },
  };

  private constructor() {
    this.loadPersistedTheme();
    this.applyTheme(this.currentTheme);
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  public setTheme(mode: ThemeMode): void {
    this.currentTheme = mode;
    this.applyTheme(mode);
    localStorage.setItem('knoux_theme_mode', mode);
  }

  public getCurrentTheme(): ThemeColors {
    return this.themes[this.currentTheme];
  }

  public getCurrentThemeName(): ThemeMode {
    return this.currentTheme;
  }

  private loadPersistedTheme(): void {
    const saved = localStorage.getItem('knoux_theme_mode') as ThemeMode | null;
    if (saved && this.themes[saved]) {
      this.currentTheme = saved;
    }
  }

  private applyTheme(mode: ThemeMode): void {
    const theme = this.themes[mode];
    const root = document.documentElement;

    Object.entries(theme).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });

    root.style.setProperty('--current-theme-name', mode);
  }
}

export const themeManager = ThemeManager.getInstance();
