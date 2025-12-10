import type { TypographyState } from "../components/TypographySettings";

export interface ThemeOptions {
    name: string;
    colors: string[];
    bad?: string;
    neutral?: string;
    good?: string;
    borderRadius?: number;
    fontFamily?: string; // Legacy support
    typography?: TypographyState;
    isDarkMode?: boolean;
    pageBackground?: {
        color: string;
        transparency: number;
    };
    filterPane?: {
        backgroundColor: string;
        foreColor: string;
        transparency: number;
    };
}

export interface PowerBITheme {
    name: string;
    dataColors: string[];
    bad?: string;
    neutral?: string;
    good?: string;
    background?: string;
    foreground?: string;
    tableAccent?: string;
    textClasses?: any;
    visualStyles?: any;
    isDarkMode?: boolean;
}

export const generateThemeJSON = (options: ThemeOptions): PowerBITheme => {
    const {
        name,
        colors,
        bad,
        neutral,
        good,
        borderRadius = 0,
        fontFamily = "Segoe UI",
        typography,
        isDarkMode = false,
        pageBackground,
        filterPane
    } = options;

    const background = isDarkMode ? "#1A1A1A" : "#FFFFFF";
    const foreground = isDarkMode ? "#FFFFFF" : "#252423";
    const globalFont = typography?.global || fontFamily;

    // Helper to create text class object
    const createTextClass = (settings: { fontFamily: string; fontSize: number; color: string }) => {
        const style: any = {
            fontFace: settings.fontFamily || globalFont,
            fontSize: settings.fontSize
        };
        if (settings.color) {
            style.color = settings.color;
        }
        return style;
    };

    const textClasses = typography ? {
        title: createTextClass(typography.title),
        callout: createTextClass(typography.callout),
        label: createTextClass(typography.label),
        header: createTextClass(typography.header)
    } : undefined;

    return {
        name: name,
        dataColors: colors,
        bad: bad,
        neutral: neutral,
        good: good,
        background: background,
        foreground: foreground,
        tableAccent: colors[0],
        textClasses: textClasses,
        visualStyles: {
            "*": {
                "*": {
                    "*": [
                        {
                            fontSize: 10,
                            fontFamily: globalFont,
                            color: { solid: { color: foreground } },
                            borderRadius: [{ px: borderRadius }]
                        }
                    ],
                    "general": [
                        {
                            responsive: true,
                            background: { show: false }
                        }
                    ],
                    "page": [
                        {
                            background: {
                                solid: {
                                    color: pageBackground?.color || background
                                },
                                transparency: pageBackground?.transparency || 0
                            }
                        }
                    ],
                    "filterCard": [
                        {
                            "$id": "FilterCard",
                            "backgroundColor": { "solid": { "color": filterPane?.backgroundColor || (isDarkMode ? "#252423" : "#FFFFFF") } },
                            "foregroundColor": { "solid": { "color": filterPane?.foreColor || foreground } },
                            "transparency": filterPane?.transparency || 0,
                            "textSize": 10,
                            "fontFamily": globalFont
                        }
                    ]
                }
            }
        },
        isDarkMode: isDarkMode
    };
};

export const downloadTheme = (theme: PowerBITheme) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(theme, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${theme.name.replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

export const parseThemeJSON = (json: any): ThemeOptions => {
    // Extract basic properties
    const name = json.name || "Imported Theme";
    const colors = Array.isArray(json.dataColors) ? json.dataColors : [];

    // Attempt to extract visual styles
    let borderRadius = 0;
    let fontFamily = "Segoe UI";
    let isDarkMode = false;
    let pageBackground = undefined;
    let filterPane = undefined;
    let typography: TypographyState | undefined = undefined;

    try {
        const globalStyles = json.visualStyles?.["*"]?.["*"]?.["*"]?.[0];
        if (globalStyles) {
            if (globalStyles.borderRadius) {
                // Handle both array and direct object formats if they exist (though standard is array of objects)
                const radiusObj = Array.isArray(globalStyles.borderRadius)
                    ? globalStyles.borderRadius[0]
                    : globalStyles.borderRadius;
                borderRadius = radiusObj?.px || 0;
            }

            if (globalStyles.fontFamily) {
                fontFamily = globalStyles.fontFamily;
            }
        }

        // Parse Text Classes if present
        if (json.textClasses) {
            const parseClass = (style: any, defaultSize: number) => ({
                fontFamily: style?.fontFace || "",
                fontSize: style?.fontSize || defaultSize,
                color: style?.color || ""
            });

            typography = {
                global: fontFamily, // Will be updated if handleImport uses legacy logic too, but this is a good start
                title: parseClass(json.textClasses.title, 14),
                callout: parseClass(json.textClasses.callout, 45),
                label: parseClass(json.textClasses.label, 10),
                header: parseClass(json.textClasses.header, 12)
            };
        }

        // Extract Page Background
        const pageBgStyle = json.visualStyles?.["*"]?.["*"]?.["page"]?.[0]?.background;
        pageBackground = pageBgStyle ? {
            color: pageBgStyle.solid?.color || "#FFFFFF",
            transparency: pageBgStyle.transparency || 0
        } : undefined;

        // Extract Filter Pane
        const filterCardStyle = json.visualStyles?.["*"]?.["*"]?.["filterCard"]?.[0];
        filterPane = filterCardStyle ? {
            backgroundColor: filterCardStyle.backgroundColor?.solid?.color || "#FFFFFF",
            foreColor: filterCardStyle.foregroundColor?.solid?.color || "#000000",
            transparency: filterCardStyle.transparency || 0
        } : undefined;

        // Infer dark mode from background color
        const pageBgColor = pageBackground?.color || json.visualStyles?.["*"]?.["*"]?.["page"]?.[0]?.background?.solid?.color;
        if (pageBgColor) {
            // Simple check: if background is dark, assume dark mode
            // This is a heuristic
            const hex = pageBgColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            isDarkMode = brightness < 128;
        }
    } catch (e) {
        console.warn("Failed to parse detailed styles", e);
    }

    // Explicit override if the property exists (custom to this tool)
    if (json.isDarkMode !== undefined) {
        isDarkMode = json.isDarkMode;
    }

    return {
        name,
        colors,
        borderRadius,
        fontFamily,
        isDarkMode,
        pageBackground,
        filterPane,
        typography
    };
};
