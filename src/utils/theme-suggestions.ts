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

export type ThemeMode = 'light' | 'dark' | 'soft';

export const suggestThemeSettings = (colors: string[], mode: ThemeMode): ThemeSettings => {
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

    if (mode === 'soft') {
        // Dynamic Soft Mode: Use dominant color but with high transparency over dark base
        const baseBg = '#1A1A1A';
        const effectiveBg = getEffectiveColor(baseBg, dominantColor, 80); // Calculate for filter pane
        const whiteContrast = getContrastRatio(effectiveBg, '#FFFFFF');
        const blackContrast = getContrastRatio(effectiveBg, '#000000');

        return {
            pageBackground: {
                color: dominantColor,
                transparency: 92 // High transparency to blend with #1A1A1A
            },
            filterPane: {
                backgroundColor: dominantColor,
                foreColor: whiteContrast >= blackContrast ? '#FFFFFF' : '#000000',
                transparency: 80
            }
        };
    }

    if (mode === 'dark') {
        const baseBg = '#0f172a'; // Slate-900

        // Dark Mode Base
        const effectiveBg = getEffectiveColor(baseBg, dominantColor, 80);
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
        // Light Mode: Dynamic Light
        // Previous static approach: '#F3F4F6'
        // New approach: Subtle tint of dominant color 

        // 97% brightness / very subtle tint for page background
        const effectivePageBg = getEffectiveColor('#FFFFFF', dominantColor, 96);

        // Filter pane slightly darker/more tinted than page for separation
        const effectiveFilterBg = getEffectiveColor('#FFFFFF', dominantColor, 92);

        const whiteContrast = getContrastRatio(effectiveFilterBg, '#FFFFFF');
        const blackContrast = getContrastRatio(effectiveFilterBg, '#000000');

        return {
            pageBackground: {
                color: effectivePageBg,
                transparency: 0   // Solid, but tinted
            },
            filterPane: {
                backgroundColor: effectiveFilterBg,
                foreColor: whiteContrast >= blackContrast ? '#FFFFFF' : '#000000',
                transparency: 0   // Solid
            }
        };
    }
};
