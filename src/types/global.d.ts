// Global type definitions for the project

declare module '*.svg' {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.jpeg' {
    const content: string;
    export default content;
}

declare module '*.gif' {
    const content: string;
    export default content;
}

declare module '*.webp' {
    const content: string;
    export default content;
}

// For libraries that don't have types
declare module 'react-lottie';
declare module 'google-map-react';
declare module 'react-apple-login';
declare module 'react-facebook-login';
declare module 'react-image-magnifiers';
declare module 'react-image-magnify';
declare module 'emoji-picker-react';
declare module 'base-64';

// Stats Section Types
export interface StatItem {
    id: number;
    icon: string;
    number: string;
    title: string;
}

export interface LandingPageData {
    hero_section?: any;
    stats?: StatItem[];
    promotion_banners?: any[];
    available_zone_status?: number;
    available_zone_list?: any[];
    earning_seller_status?: boolean;
    earning_dm_status?: boolean;
    fixed_promotional_banner_full_url?: string;
    business_title?: string;
    business_sub_title?: string;
    business_image?: string;
    testimonial_list?: any[];
}

// Extend the theme interface if needed
declare module '@mui/material/styles' {
    interface Palette {
        whiteContainer: {
            main: string;
        };
        neutral: {
            [key: number]: string;
        };
    }

    interface PaletteOptions {
        whiteContainer?: {
            main: string;
        };
        neutral?: {
            [key: number]: string;
        };
    }
}