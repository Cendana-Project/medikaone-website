import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sidebar: {
                    DEFAULT: '255 255 255',
                    foreground: '31 41 55',
                },
            },

            screens: {
                portrait: { raw: "(orientation: portrait)" },
                landscape: { raw: "(orientation: landscape)" },
            },
        },
    },
    plugins: [],
};

export default config;