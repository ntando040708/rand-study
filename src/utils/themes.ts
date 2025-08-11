import { ThemeConfig, ColorScheme, LayoutConfig } from './types';

export class ThemeManager {
  private static readonly THEME_STORAGE_KEY = 'randstudy_theme';
  
  static readonly PREDEFINED_THEMES: { [key: string]: ThemeConfig } = {
    'modern-light': {
      name: 'Modern Light',
      mode: 'light',
      colorScheme: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#10B981',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        text: '#1F2937',
        textSecondary: '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        gradient: ['#3B82F6', '#8B5CF6']
      },
      layout: {
        density: 'comfortable',
        borderRadius: 'rounded',
        shadows: 'subtle',
        animations: 'full'
      },
      customizations: {
        customColors: {},
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 'medium',
        moduleColorOverrides: {}
      }
    },
    
    'dark-pro': {
      name: 'Dark Pro',
      mode: 'dark',
      colorScheme: {
        primary: '#60A5FA',
        secondary: '#A78BFA',
        accent: '#34D399',
        background: '#0F172A',
        surface: '#1E293B',
        text: '#F1F5F9',
        textSecondary: '#94A3B8',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
        gradient: ['#1E293B', '#334155']
      },
      layout: {
        density: 'comfortable',
        borderRadius: 'rounded',
        shadows: 'prominent',
        animations: 'full'
      },
      customizations: {
        customColors: {},
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 'medium',
        moduleColorOverrides: {}
      }
    },
    
    'nature-zen': {
      name: 'Nature Zen',
      mode: 'light',
      colorScheme: {
        primary: '#059669',
        secondary: '#0D9488',
        accent: '#84CC16',
        background: '#F0FDF4',
        surface: '#ECFDF5',
        text: '#064E3B',
        textSecondary: '#047857',
        success: '#10B981',
        warning: '#D97706',
        error: '#DC2626',
        gradient: ['#059669', '#0D9488', '#84CC16']
      },
      layout: {
        density: 'spacious',
        borderRadius: 'extra-rounded',
        shadows: 'subtle',
        animations: 'reduced'
      },
      customizations: {
        customColors: {},
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 'medium',
        moduleColorOverrides: {}
      }
    },
    
    'sunset-warm': {
      name: 'Sunset Warm',
      mode: 'light',
      colorScheme: {
        primary: '#EA580C',
        secondary: '#DC2626',
        accent: '#F59E0B',
        background: '#FFF7ED',
        surface: '#FFEDD5',
        text: '#9A3412',
        textSecondary: '#C2410C',
        success: '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
        gradient: ['#EA580C', '#DC2626', '#F59E0B']
      },
      layout: {
        density: 'comfortable',
        borderRadius: 'extra-rounded',
        shadows: 'subtle',
        animations: 'full'
      },
      customizations: {
        customColors: {},
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 'medium',
        moduleColorOverrides: {}
      }
    },
    
    'ocean-blue': {
      name: 'Ocean Blue',
      mode: 'light',
      colorScheme: {
        primary: '#0EA5E9',
        secondary: '#3B82F6',
        accent: '#06B6D4',
        background: '#F0F9FF',
        surface: '#E0F2FE',
        text: '#0C4A6E',
        textSecondary: '#0369A1',
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
        gradient: ['#0EA5E9', '#3B82F6', '#06B6D4']
      },
      layout: {
        density: 'comfortable',
        borderRadius: 'rounded',
        shadows: 'prominent',
        animations: 'full'
      },
      customizations: {
        customColors: {},
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 'medium',
        moduleColorOverrides: {}
      }
    },
    
    'midnight-purple': {
      name: 'Midnight Purple',
      mode: 'dark',
      colorScheme: {
        primary: '#A855F7',
        secondary: '#EC4899',
        accent: '#06B6D4',
        background: '#1A0B2E',
        surface: '#2D1B69',
        text: '#E2E8F0',
        textSecondary: '#A78BFA',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#F87171',
        gradient: ['#1A0B2E', '#2D1B69', '#7C3AED']
      },
      layout: {
        density: 'comfortable',
        borderRadius: 'extra-rounded',
        shadows: 'prominent',
        animations: 'full'
      },
      customizations: {
        customColors: {},
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 'medium',
        moduleColorOverrides: {}
      }
    },
    
    'minimal-mono': {
      name: 'Minimal Mono',
      mode: 'light',
      colorScheme: {
        primary: '#374151',
        secondary: '#6B7280',
        accent: '#111827',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#111827',
        textSecondary: '#6B7280',
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
        gradient: ['#F9FAFB', '#E5E7EB']
      },
      layout: {
        density: 'compact',
        borderRadius: 'sharp',
        shadows: 'none',
        animations: 'reduced'
      },
      customizations: {
        customColors: {},
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 'small',
        moduleColorOverrides: {}
      }
    },
    
    'high-contrast': {
      name: 'High Contrast',
      mode: 'light',
      colorScheme: {
        primary: '#000000',
        secondary: '#1F2937',
        accent: '#DC2626',
        background: '#FFFFFF',
        surface: '#F3F4F6',
        text: '#000000',
        textSecondary: '#374151',
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
        gradient: ['#FFFFFF', '#F3F4F6']
      },
      layout: {
        density: 'spacious',
        borderRadius: 'sharp',
        shadows: 'prominent',
        animations: 'none'
      },
      customizations: {
        customColors: {},
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 'large',
        moduleColorOverrides: {}
      }
    }
  };

  static applyTheme(theme: ThemeConfig): void {
    const root = document.documentElement;
    
    // Apply color scheme
    root.style.setProperty('--color-primary', theme.colorScheme.primary);
    root.style.setProperty('--color-secondary', theme.colorScheme.secondary);
    root.style.setProperty('--color-accent', theme.colorScheme.accent);
    root.style.setProperty('--color-background', theme.colorScheme.background);
    root.style.setProperty('--color-surface', theme.colorScheme.surface);
    root.style.setProperty('--color-text', theme.colorScheme.text);
    root.style.setProperty('--color-text-secondary', theme.colorScheme.textSecondary);
    root.style.setProperty('--color-success', theme.colorScheme.success);
    root.style.setProperty('--color-warning', theme.colorScheme.warning);
    root.style.setProperty('--color-error', theme.colorScheme.error);
    
    // Apply gradient
    const gradientString = `linear-gradient(135deg, ${theme.colorScheme.gradient.join(', ')})`;
    root.style.setProperty('--gradient-primary', gradientString);
    
    // Apply layout settings
    const densitySpacing = {
      compact: '0.5rem',
      comfortable: '1rem',
      spacious: '1.5rem'
    };
    root.style.setProperty('--spacing-base', densitySpacing[theme.layout.density]);
    
    const borderRadiusValues = {
      sharp: '0px',
      rounded: '0.5rem',
      'extra-rounded': '1rem'
    };
    root.style.setProperty('--border-radius', borderRadiusValues[theme.layout.borderRadius]);
    
    const shadowValues = {
      none: 'none',
      subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      prominent: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    };
    root.style.setProperty('--shadow', shadowValues[theme.layout.shadows]);
    
    // Apply font settings
    root.style.setProperty('--font-family', theme.customizations.fontFamily);
    
    const fontSizeValues = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.setProperty('--font-size-base', fontSizeValues[theme.customizations.fontSize]);
    
    // Apply animations
    const animationDuration = {
      none: '0s',
      reduced: '0.15s',
      full: '0.3s'
    };
    root.style.setProperty('--animation-duration', animationDuration[theme.layout.animations]);
    
    // Apply dark mode class
    if (theme.mode === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    // Store theme preference
    localStorage.setItem(this.THEME_STORAGE_KEY, JSON.stringify(theme));
  }

  static getStoredTheme(): ThemeConfig | null {
    try {
      const stored = localStorage.getItem(this.THEME_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  static createCustomTheme(
    baseName: string,
    customizations: Partial<ThemeConfig>
  ): ThemeConfig {
    const baseTheme = this.PREDEFINED_THEMES[baseName] || this.PREDEFINED_THEMES['modern-light'];
    
    return {
      ...baseTheme,
      ...customizations,
      name: customizations.name || `Custom ${baseTheme.name}`,
      colorScheme: {
        ...baseTheme.colorScheme,
        ...customizations.colorScheme
      },
      layout: {
        ...baseTheme.layout,
        ...customizations.layout
      },
      customizations: {
        ...baseTheme.customizations,
        ...customizations.customizations
      }
    };
  }

  static generateColorPalette(primaryColor: string): Partial<ColorScheme> {
    // Simple color palette generation based on primary color
    // In a real app, you'd use a more sophisticated color theory algorithm
    const hsl = this.hexToHsl(primaryColor);
    
    return {
      primary: primaryColor,
      secondary: this.hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l),
      accent: this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    };
  }

  private static hexToHsl(hex: string): { h: number; s: number; l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  private static hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
}