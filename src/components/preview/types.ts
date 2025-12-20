export interface PreviewTheme {
    container: string;
    text: string;
    subText: string;
    card: string;
    cardBorder: string;
    hover: string;
    pill: string;
    secondary: string;
}

export type GetTextStyle = (type: 'title' | 'callout' | 'label' | 'header') => React.CSSProperties;
