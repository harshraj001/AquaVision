/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                depth: {
                    safe: '#3B82F6',      // Blue < 10m
                    moderate: '#EAB308',  // Yellow 10-20m
                    high: '#F59E0B',      // Amber 20-40m
                    critical: '#DC2626', // Red > 40m
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'water-rise': 'waterRise 2s ease-in-out infinite alternate',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
            },
            keyframes: {
                waterRise: {
                    '0%': { height: '0%' },
                    '100%': { height: '100%' },
                }
            }
        },
    },
    plugins: [],
}
