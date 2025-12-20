export type HarmonyMode = 'random' | 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'split-complementary' | 'original';

// Color conversion helpers
export const hexToRgb = (hex: string): { r: number, g: number, b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export const rgbToHsl = (r: number, g: number, b: number): { h: number, s: number, l: number } => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
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
};

export const hslToRgb = (h: number, s: number, l: number): { r: number, g: number, b: number } => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

export const componentToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

// Accessibility helpers
const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export const getContrastRatio = (hex1: string, hex2: string): number => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    if (!rgb1 || !rgb2) return 0;

    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
};

export const getOptimalTextColor = (hexColor: string): string => {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return '#ffffff';
    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    return luminance > 0.5 ? '#000000' : '#ffffff';
};

export const generateRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const generatePalette = (count: number = 5): string[] => {
    return Array.from({ length: count }, () => generateRandomColor());
};

export const generateHarmoniousPalette = (baseHex: string, mode: HarmonyMode, count: number = 5): string[] => {
    if (mode === 'random') return generatePalette(count);

    const rgb = hexToRgb(baseHex);
    if (!rgb) return generatePalette(count); // Fallback

    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors: string[] = [baseHex];

    for (let i = 1; i < count; i++) {
        let newH = h;
        let newS = s;
        let newL = l;

        switch (mode) {
            case 'monochromatic':
                // Vary lightness and saturation
                newL = Math.max(10, Math.min(95, l + (i % 2 === 0 ? 1 : -1) * i * 15));
                newS = Math.max(10, Math.min(100, s - i * 5));
                break;
            case 'analogous':
                // Rotate hue by 30 degrees
                newH = (h + i * 30) % 360;
                break;
            case 'complementary':
                if (i === 1) newH = (h + 180) % 360;
                else {
                    // Variations of base and complement
                    newH = (i % 2 === 0) ? h : (h + 180) % 360;
                    newL = l + (i > 1 ? (i % 2 === 0 ? 20 : -20) : 0);
                }
                break;
            case 'triadic':
                newH = (h + i * 120) % 360;
                break;
            case 'split-complementary':
                if (i === 1) newH = (h + 150) % 360;
                else if (i === 2) newH = (h + 210) % 360;
                else {
                    newH = (h + i * 30) % 360; // Fill with analogous
                }
                break;
        }

        const newRgb = hslToRgb(newH, newS, newL);
        colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }

    return colors.slice(0, count);
};
