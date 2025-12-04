export interface ThemeTemplate {
    id: string;
    name: string;
    colors: string[];
}

export const themeTemplates: ThemeTemplate[] = [
    {
        id: 'corporate-blue',
        name: 'Corporate Blue',
        colors: ['#1E3A8A', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD']
    },
    {
        id: 'executive',
        name: 'Executive',
        colors: ['#2C3E50', '#E74C3C', '#ECF0F1', '#3498DB', '#2980B9']
    },
    {
        id: 'dark-mode',
        name: 'Dark Neon',
        colors: ['#0F172A', '#1E293B', '#334155', '#22D3EE', '#F472B6']
    },
    {
        id: 'pastel',
        name: 'Soft Pastel',
        colors: ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA']
    },
    {
        id: 'nature',
        name: 'Forest',
        colors: ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#74C69D']
    },
    {
        id: 'sunset',
        name: 'Sunset',
        colors: ['#2D3142', '#4F5D75', '#EF8354', '#BFC0C0', '#FFFFFF']
    },
    {
        id: 'high-contrast',
        name: 'High Contrast',
        colors: ['#000000', '#FFFFFF', '#FFD700', '#0057B7', '#FF4500']
    }
];
