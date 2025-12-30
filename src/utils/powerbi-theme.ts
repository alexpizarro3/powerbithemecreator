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
    visualContainer?: {
        dropShadow?: {
            show: boolean;
            color: string;
            transparency: number;
            blur: number;
            angle: number;
            distance: number;
        };
        header?: {
            backgroundColor: string;
            fontColor: string;
            transparency: number;
        };
        tooltip?: {
            backgroundColor: string;
            fontColor: string;
            transparency: number;
        };
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    textClasses?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visualStyles?: any;
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
        filterPane,
        visualContainer
    } = options;

    const background = isDarkMode ? "#1A1A1A" : "#F3F4F6"; // Slate-100 for Light Mode Canvas
    const foreground = isDarkMode ? "#FFFFFF" : "#252423";
    const globalFont = typography?.global || fontFamily;

    // Helper to create text class object
    const createTextClass = (settings: { fontFamily: string; fontSize: number; color: string }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        name: name || "Custom Theme",
        dataColors: colors,
        bad: bad,
        neutral: neutral,
        good: good,
        background: background,
        foreground: foreground,
        tableAccent: colors[0],
        textClasses: textClasses,
        visualStyles: {
            "page": {
                "*": {
                    "background": [{
                        "color": { "solid": { "color": pageBackground?.color || background } },
                        "transparency": pageBackground?.transparency || 0
                    }],
                    "outspace": [{
                        "color": { "solid": { "color": pageBackground?.color || background } },
                        "transparency": pageBackground?.transparency || 0
                    }],
                    "outspacePane": [{
                        "backgroundColor": { "solid": { "color": filterPane?.backgroundColor || (isDarkMode ? "#252423" : "#FFFFFF") } },
                        "foregroundColor": { "solid": { "color": filterPane?.foreColor || foreground } },
                        "transparency": filterPane?.transparency || 0,
                        "fontFamily": globalFont
                    }]
                }
            },
            "filterCard": {
                "*": {
                    "filterCard": [{
                        "$id": "FilterCard",
                        "backgroundColor": { "solid": { "color": filterPane?.backgroundColor || (isDarkMode ? "#252423" : "#FFFFFF") } },
                        "foregroundColor": { "solid": { "color": filterPane?.foreColor || foreground } },
                        "transparency": filterPane?.transparency || 0,
                        "textSize": 10,
                        "fontFamily": globalFont
                    }]
                }
            },
            "card": {
                "*": {
                    "labels": [{
                        "color": { "solid": { "color": foreground } },
                        "fontFamily": globalFont
                    }],
                    "categoryLabels": [{
                        "color": { "solid": { "color": foreground } },
                        "fontFamily": globalFont
                    }]
                }
            },
            "multiRowCard": {
                "*": {
                    "categoryLabels": [{
                        "color": { "solid": { "color": foreground } },
                        "fontFamily": globalFont
                    }]
                }
            },
            "slicer": {
                "*": {
                    "header": [{
                        "fontColor": { "solid": { "color": foreground } },
                        "fontFamily": globalFont,
                        "textSize": 10
                    }],
                    "items": [{
                        "fontColor": { "solid": { "color": foreground } },
                        "fontFamily": globalFont,
                        "textSize": 10,
                        "background": { "solid": { "color": background } }
                    }]
                }
            },
            "*": {
                "*": {
                    "*": [{
                        "fontSize": 10,
                        "fontFamily": globalFont,
                        "color": { "solid": { "color": foreground } }
                    }],
                    "visualHeader": [{
                        "background": { "solid": { "color": visualContainer?.header?.backgroundColor || "transparent" } },
                        "titleColor": { "solid": { "color": visualContainer?.header?.fontColor || foreground } },
                        "transparency": visualContainer?.header?.transparency ?? 0
                    }],
                    "visualTooltip": [{
                        "background": { "solid": { "color": visualContainer?.tooltip?.backgroundColor || (isDarkMode ? "#252423" : "#FFFFFF") } },
                        "valueFontColor": { "solid": { "color": visualContainer?.tooltip?.fontColor || foreground } },
                        "titleFontColor": { "solid": { "color": visualContainer?.tooltip?.fontColor || foreground } },
                        "transparency": visualContainer?.tooltip?.transparency ?? 0
                    }],
                    "general": [{
                        "responsive": true
                    }],
                    "background": [{
                        "show": true,
                        // Light Mode: Pure White Cards to pop against the Grey Canvas
                        "color": { "solid": { "color": isDarkMode ? "#000000" : "#FFFFFF" } },
                        "transparency": isDarkMode ? 80 : 0
                    }],
                    "dropShadow": [{
                        "show": visualContainer?.dropShadow?.show ?? !isDarkMode,
                        "color": { "solid": { "color": visualContainer?.dropShadow?.color || "#000000" } },
                        "position": "Outer",
                        "transparency": visualContainer?.dropShadow?.transparency ?? 90,
                        "blur": visualContainer?.dropShadow?.blur ?? 10,
                        "angle": visualContainer?.dropShadow?.angle ?? 90,
                        "distance": visualContainer?.dropShadow?.distance ?? 2
                    }],
                    "border": [{
                        "show": borderRadius > 0,
                        "radius": borderRadius,
                        // Very subtle border in PBI (cannot handle alpha well, so approximate)
                        "color": { "solid": { "color": isDarkMode ? "#475569" : "#E2E8F0" } }
                    }],
                    "title": [{
                        "fontColor": { "solid": { "color": foreground } },
                        "fontFamily": globalFont,
                        "fontSize": 12
                    }],
                    "categoryAxis": [{
                        "labelColor": { "solid": { "color": foreground } },
                        "titleColor": { "solid": { "color": foreground } },
                        "fontFamily": globalFont
                    }],
                    "valueAxis": [{
                        "labelColor": { "solid": { "color": foreground } },
                        "titleColor": { "solid": { "color": foreground } },
                        "fontFamily": globalFont
                    }],
                    "legend": [{
                        "labelColor": { "solid": { "color": foreground } },
                        "titleColor": { "solid": { "color": foreground } },
                        "fontFamily": globalFont
                    }]
                }
            }
        }
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    let visualContainer: ThemeOptions['visualContainer'] = undefined;

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        typography,
        visualContainer
    };
};
