import { ThemeConfig, ColorScheme, LayoutConfig } from './types';

export class ThemeManager {
  private static readonly THEME_STORAGE_KEY = 'randstudy_theme';
  
  static readonly PREDEFINED_THEMES: { [key: string]: ThemeConfig } = {
    'ocean-blue': {
      name: 'Ocean Blue',
      mode: 'light',
      colorScheme: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        accent: '#06B6D4',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        text: '#1A1A1A',
        textSecondary: '#4A4A4A',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        gradient: ['#3B82F6', '#1E40AF', '#06B6D4']
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
    
    'midnight-blue': {
      name: 'Midnight Blue',
      mode: 'dark',
      colorScheme: {
        primary: '#60A5FA',
        secondary: '#3B82F6',
        accent: '#06B6D4',
        background: '#0F172A',
        surface: '#1E293B',
        text: '#FFFFFF',
        textSecondary: '#CBD5E1',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        gradient: ['#0F172A', '#1E293B', '#3B82F6']
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
    
    'sky-gradient': {
      name: 'Sky Gradient',
      mode: 'light',
      colorScheme: {
        primary: '#0EA5E9',
        secondary: '#0284C7',
        accent: '#38BDF8',
        background: '#F0F9FF',
        surface: '#E0F2FE',
        text: '#0C4A6E',
        textSecondary: '#075985',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        gradient: ['#0EA5E9', '#0284C7', '#38BDF8']
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
    
    'navy-blue': {
      name: 'Navy Blue',
      mode: 'light',
      colorScheme: {
        primary: '#1E40AF',
        secondary: '#1E3A8A',
        accent: '#3B82F6',
        background: '#FFFFFF',
        surface: '#F5F5F5',
        text: '#1E293B',
        textSecondary: '#475569',
        success: '#16A34A',
        warning: '#F59E0B',
        error: '#EF4444',
        gradient: ['#1E40AF', '#1E3A8A', '#3B82F6']
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
    
    'deep-blue': {
      name: 'Deep Blue',
      mode: 'dark',
      colorScheme: {
        primary: '#60A5FA',
        secondary: '#3B82F6',
        accent: '#06B6D4',
        background: '#0C1426',
        surface: '#1E293B',
        text: '#FFFFFF',
        textSecondary: '#94A3B8',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        gradient: ['#0C1426', '#1E293B', '#3B82F6']
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
    
    'azure-pro': {
      name: 'Azure Pro',
      mode: 'dark',
      colorScheme: {
        primary: '#0EA5E9',
        secondary: '#0284C7',
        accent: '#38BDF8',
        background: '#020617',
        surface: '#0F172A',
        text: '#FFFFFF',
        textSecondary: '#0EA5E9',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        gradient: ['#020617', '#0F172A', '#0EA5E9']
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
    
    'blue-minimal': {
      name: 'Blue Minimal',
      mode: 'light',
      colorScheme: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        accent: '#1E293B',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#1E293B',
        textSecondary: '#64748B',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        gradient: ['#FFFFFF', '#F8FAFC']
      },
      layout: {
        density: 'compact',
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
    
    'high-contrast-blue': {
      name: 'High Contrast Blue',
      mode: 'light',
      colorScheme: {
        primary: '#1E40AF',
        secondary: '#1E293B',
        accent: '#3B82F6',
        background: '#FFFFFF',
        surface: '#F3F4F6',
        text: '#1E293B',
        textSecondary: '#374151',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        gradient: ['#FFFFFF', '#F8FAFC']
      },
      layout: {
        density: 'spacious',
        borderRadius: 'rounded',
        shadows: 'prominent',
        animations: 'full'
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
    const baseTheme = this.PREDEFINED_THEMES[baseName] || this.PREDEFINED_THEMES['orange-energy'];
    
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
      accent: this.hslToHex((hsl.h + 60) % 360, Math.min(hsl.s + 20, 100), Math.min(hsl.l + 10, 80)),
      success: '#10B981',
      warning: '#FFB627',
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