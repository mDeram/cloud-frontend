const colors = require("tailwindcss/colors");

module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                primary: colors.neutral,
                secondary: colors.neutral,
                accent: colors.emerald,
            },
            screens: {
                xs: "480px"
            }
        },
    }
}
