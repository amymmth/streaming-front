/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                border: 'var(--border)',
                card: '#1A1A1A',
                accent: '#9e64cf',
                textPrimary: '#FFFFFF',
                textSecondary: '#B3B3B3',
                hover: '#333333',
            },
            borderRadius: {
                md: '12px',
                lg: '16px',
            },
            fontSize: {
                base: '14px',
                lg: '16px',
                xl: '20px',
            },
            fontFamily: {
                sans: ['var(--font-family)'],
                headerFont: ['"DrukTextWideCyrHeavy"', "sans-serif"],
            },
        }
    },
    plugins: [tailwindcssAnimate],
};
