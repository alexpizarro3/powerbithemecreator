import { useState, useEffect } from 'react';
import { type ColorItem } from '../components/PaletteGenerator';
import { suggestThemeSettings } from '../utils/theme-suggestions';
import { type TypographyState } from '../components/TypographySettings';

export const useThemeState = () => {
    // Load initial state from localStorage or use default
    const [colors, setColors] = useState<ColorItem[]>(() => {
        const saved = localStorage.getItem('pbi-theme-colors');
        return saved ? JSON.parse(saved) : [
            { id: '1', hex: '#4DEEEA', locked: false }, // Cyan
            { id: '2', hex: '#74EE15', locked: false }, // Lime
            { id: '3', hex: '#FFE700', locked: false }, // Yellow
            { id: '4', hex: '#F000FF', locked: false }, // Magenta
            { id: '5', hex: '#001EFF', locked: false }, // Blue
        ];
    });

    // History state for Undo/Redo
    const [history, setHistory] = useState<ColorItem[][]>([colors]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const [themeName, setThemeName] = useState("My Custom Theme");

    const [isDarkMode, setIsDarkMode] = useState(true);

    const [borderRadius, setBorderRadius] = useState(() => {
        const saved = localStorage.getItem('pbi-theme-radius');
        return saved ? Number(saved) : 0;
    });

    const [typography, setTypography] = useState<TypographyState>(() => {
        const saved = localStorage.getItem('pbi-theme-typography');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migration: If colors are explicitly black (old default), reset to auto
            const migrateColor = (c: string) => c === "#000000" ? "" : c;

            return {
                ...parsed,
                title: { ...parsed.title, color: migrateColor(parsed.title.color) },
                callout: { ...parsed.callout, color: migrateColor(parsed.callout.color) },
                label: { ...parsed.label, color: migrateColor(parsed.label.color) },
                header: { ...parsed.header, color: migrateColor(parsed.header.color) }
            };
        }

        // Migration: Check for old font family setting
        const oldFont = localStorage.getItem('pbi-theme-font') || "Segoe UI";

        return {
            global: oldFont,
            title: { fontFamily: "", fontSize: 14, color: "" },
            callout: { fontFamily: "", fontSize: 20, color: "" },
            label: { fontFamily: "", fontSize: 10, color: "" },
            header: { fontFamily: "", fontSize: 12, color: "" }
        };
    });

    // Helper to get raw dark mode preference for initializers
    const storedIsDark = () => {
        const saved = localStorage.getItem('pbi-theme-darkmode');
        return saved ? JSON.parse(saved) : true;
    };

    const [pageBackground, setPageBackground] = useState(() => {
        const saved = localStorage.getItem('pbi-theme-page-bg');
        const isDark = storedIsDark();

        if (saved) {
            const parsed = JSON.parse(saved);
            // Mismatch Check: If Light Mode but background is Dark Default
            if (!isDark && (parsed.color === '#0f172a' || parsed.color === '#000000')) {
                return { color: '#F3F4F6', transparency: 0 };
            }
            // LEGACY FIX: Detect "Tinted" Light Mode (transparency 96) and force to Clean
            if (!isDark && parsed.transparency === 96) {
                return { color: '#F3F4F6', transparency: 0 };
            }

            // Mismatch Check: If Dark Mode but background is Light Default
            if (isDark && (parsed.color === '#FFFFFF' || parsed.color === '#F3F4F6')) {
                return { color: '#0f172a', transparency: 0 };
            }
            return parsed;
        }
        return isDark ? { color: '#0f172a', transparency: 0 } : { color: '#F3F4F6', transparency: 0 };
    });

    const [filterPane, setFilterPane] = useState(() => {
        const saved = localStorage.getItem('pbi-theme-filter-pane');
        const isDark = storedIsDark();

        if (saved) {
            const parsed = JSON.parse(saved);
            // Mismatch Check: If Light Mode but filter pane is Dark Default
            if (!isDark && (parsed.backgroundColor === '#1e293b' || parsed.backgroundColor === '#000000')) {
                return { backgroundColor: '#FFFFFF', foreColor: '#000000', transparency: 0 };
            }
            // Mismatch Check: If Dark Mode but filter pane is Light Default
            if (isDark && (parsed.backgroundColor === '#FFFFFF')) {
                return { backgroundColor: '#1e293b', foreColor: '#ffffff', transparency: 0 };
            }
            return parsed;
        }
        return isDark
            ? { backgroundColor: '#1e293b', foreColor: '#ffffff', transparency: 0 }
            : { backgroundColor: '#FFFFFF', foreColor: '#000000', transparency: 0 };
    });

    const [dataGradients, setDataGradients] = useState(() => {
        const saved = localStorage.getItem('pbi-theme-gradients');
        return saved ? JSON.parse(saved) : {
            bad: '#D64554',
            neutral: '#F6C244',
            good: '#1AAB40'
        };
    });

    // Persistence Effects
    useEffect(() => { localStorage.setItem('pbi-theme-colors', JSON.stringify(colors)); }, [colors]);
    useEffect(() => {
        localStorage.setItem('pbi-theme-darkmode', JSON.stringify(isDarkMode));

        // Intelligent Theming: Auto-switch background/filter settings when mode changes
        // "Hard Sync": We re-calculate the correct defaults for the new mode based on the current palette.
        // This ensures even "tinted" or custom-but-wrong colors are reset to standard Premium defaults.
        const currentPalette = colors.map(c => c.hex);
        const suggestions = suggestThemeSettings(currentPalette, isDarkMode);

        // We only apply the suggestion if we are checking against a "Wrong Mode" value
        // But since we want to be robust, we just apply the new defaults.
        // NOTE: This will overwrite manual customizations when switching modes. This is intended behavior
        // to resolve the "Broken Background" issues users are reporting.
        setPageBackground(suggestions.pageBackground);
        setFilterPane(suggestions.filterPane);

    }, [isDarkMode]);
    useEffect(() => { localStorage.setItem('pbi-theme-radius', borderRadius.toString()); }, [borderRadius]);
    useEffect(() => { localStorage.setItem('pbi-theme-typography', JSON.stringify(typography)); }, [typography]);
    useEffect(() => { localStorage.setItem('pbi-theme-page-bg', JSON.stringify(pageBackground)); }, [pageBackground]);
    useEffect(() => { localStorage.setItem('pbi-theme-filter-pane', JSON.stringify(filterPane)); }, [filterPane]);
    useEffect(() => { localStorage.setItem('pbi-theme-gradients', JSON.stringify(dataGradients)); }, [dataGradients]);

    // Undo/Redo Logic
    const handleSetColors = (newColors: ColorItem[], addToHistory = true) => {
        setColors(newColors);
        if (addToHistory) {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newColors);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setColors(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setColors(history[historyIndex + 1]);
        }
    };

    const handlePaletteGenerated = (newColors: ColorItem[]) => {
        // 1. Update colors
        handleSetColors(newColors);

        // 2. Suggest and apply theme settings
        const suggestions = suggestThemeSettings(newColors.map(c => c.hex), isDarkMode);
        setPageBackground(suggestions.pageBackground);
        setFilterPane(suggestions.filterPane);
    };

    const handlePaletteSelect = (newColors: string[]) => {
        const colorItems = newColors.map((hex, index) => ({
            id: `${Date.now()}-${index}`,
            hex,
            locked: false
        }));
        handlePaletteGenerated(colorItems);
    };

    return {
        colors,
        setColors: handleSetColors,
        themeName,
        setThemeName,
        historyIndex,
        historyLength: history.length,
        undo,
        redo,
        handlePaletteGenerated,
        handlePaletteSelect,
        isDarkMode,
        setIsDarkMode,
        borderRadius,
        setBorderRadius,
        typography,
        setTypography,
        pageBackground,
        setPageBackground,
        filterPane,
        setFilterPane,
        dataGradients,
        setDataGradients,
        reset: () => {
            // Clear all local storage
            localStorage.removeItem('pbi-theme-colors');
            localStorage.removeItem('pbi-theme-darkmode');
            localStorage.removeItem('pbi-theme-radius');
            localStorage.removeItem('pbi-theme-typography');
            localStorage.removeItem('pbi-theme-page-bg');
            localStorage.removeItem('pbi-theme-filter-pane');
            localStorage.removeItem('pbi-theme-gradients');

            // Reset state to defaults
            setColors([
                { id: '1', hex: '#4DEEEA', locked: false },
                { id: '2', hex: '#74EE15', locked: false },
                { id: '3', hex: '#FFE700', locked: false },
                { id: '4', hex: '#F000FF', locked: false },
                { id: '5', hex: '#001EFF', locked: false },
            ]);
            setThemeName("My Custom Theme");
            setIsDarkMode(true);
            setBorderRadius(0);
            setTypography({
                global: "Segoe UI",
                title: { fontFamily: "", fontSize: 14, color: "" },
                callout: { fontFamily: "", fontSize: 20, color: "" },
                label: { fontFamily: "", fontSize: 10, color: "" },
                header: { fontFamily: "", fontSize: 12, color: "" }
            });
            setPageBackground({ color: '#0f172a', transparency: 0 });
            setFilterPane({ backgroundColor: '#1e293b', foreColor: '#ffffff', transparency: 0 });
            setDataGradients({
                bad: '#D64554',
                neutral: '#F6C244',
                good: '#1AAB40'
            });
            setHistory([[
                { id: '1', hex: '#4DEEEA', locked: false },
                { id: '2', hex: '#74EE15', locked: false },
                { id: '3', hex: '#FFE700', locked: false },
                { id: '4', hex: '#F000FF', locked: false },
                { id: '5', hex: '#001EFF', locked: false },
            ]]);
            setHistoryIndex(0);
        }
    };
};
