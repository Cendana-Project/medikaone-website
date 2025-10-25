import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
        screens: {
            portrait: { raw: "(orientation: portrait)" },
            landscape: { raw: "(orientation: landscape)" },
        },
        },
    },
    plugins: [],
};

export default config;