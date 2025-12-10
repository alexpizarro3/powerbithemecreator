export interface PreviewTheme {
    container: string;
    text: string;
    subText: string;
    card: string;
    cardBorder: string;
    hover: string;
}

export type GetTextStyle = (type: 'title' | 'callout' | 'label' | 'header') => React.CSSProperties;
