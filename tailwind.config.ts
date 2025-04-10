import type { Config } from "tailwindcss";

const config: Config = {
  content: {
    files: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    safelist: [
      "px-3",
      "py-1",
      "bg-blue-500",
      "text-white",
      "appearance-none",
      // any additional classes
    ],
  } as unknown as { files: string[]; safelist: string[] },
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
