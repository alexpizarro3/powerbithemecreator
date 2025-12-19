import { getContrastRatio, hexToRgb, rgbToHex } from './colors';

interface ThemeSettings {
    pageBackground: {
        color: string;
        transparency: number;
    };
    filterPane: {
        backgroundColor: string;
        foreColor: string;
        transparency: number;
    };
}

export const suggestThemeSettings = (colors: string[], isDark: boolean): ThemeSettings => {
    const dominantColor = colors[0];

    // Helper to calculate effective background color based on transparency
    const getEffectiveColor = (baseHex: string, overlayHex: string, transparency: number) => {
        const base = hexToRgb(baseHex);
        const overlay = hexToRgb(overlayHex);
        if (!base || !overlay) return baseHex;

        const alpha = 1 - (transparency / 100);
        const r = Math.round((1 - alpha) * base.r + alpha * overlay.r);
        const g = Math.round((1 - alpha) * base.g + alpha * overlay.g);
        const b = Math.round((1 - alpha) * base.b + alpha * overlay.b);

        return rgbToHex(r, g, b);
    };

    if (isDark) {
        // Dark Mode Base: Slate-900 (#0f172a)
        const effectiveBg = getEffectiveColor('#0f172a', dominantColor, 80);
        const whiteContrast = getContrastRatio(effectiveBg, '#FFFFFF');
        const blackContrast = getContrastRatio(effectiveBg, '#000000');

        return {
            pageBackground: {
                // Dark mode: Subtle tint of dominant color over the dark container
                color: dominantColor,
                transparency: 92
            },
            filterPane: {
                // Dark mode filter pane: Tinted with dominant color
                backgroundColor: dominantColor,
                foreColor: whiteContrast >= blackContrast ? '#FFFFFF' : '#000000',
                transparency: 80
            }
        };
    } else {
        // Light Mode: Enforce CLEAN look. No tints.
        // The user specifically complained about "weird colors" in Light Mode.
        // We return standard "Premium Light" colors: Grey Canvas, White Filter Pane.

        return {
            pageBackground: {
                color: '#F3F4F6', // Slate-100
                transparency: 0   // Solid
            },
            filterPane: {
                backgroundColor: '#FFFFFF', // White
                foreColor: '#000000',
                transparency: 0   // Solid
            }
        };
    }
};
