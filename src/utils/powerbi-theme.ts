export interface ThemeOptions {
    name: string;
    colors: string[];
    borderRadius?: number;
    fontFamily?: string;
    isDarkMode?: boolean;
}

export interface PowerBITheme {
    name: string;
    dataColors: string[];
    background?: string;
    foreground?: string;
    tableAccent?: string;
    visualStyles?: any;
}

export const generateThemeJSON = (options: ThemeOptions): PowerBITheme => {
    const { name, colors, borderRadius = 0, fontFamily = "Segoe UI", isDarkMode = false } = options;

    const background = isDarkMode ? "#1A1A1A" : "#FFFFFF";
    const foreground = isDarkMode ? "#FFFFFF" : "#252423";

    return {
        name: name,
        dataColors: colors,
        background: background,
        foreground: foreground,
        tableAccent: colors[0],
        visualStyles: {
            "*": {
                "*": {
                    "*": [
                        {
                            fontSize: 10,
                            fontFamily: fontFamily,
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
                            background: { solid: { color: background } }
                        }
                    ]
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
