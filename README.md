# React + TypeScript + Vite

A minimal React application powered by Vite and TypeScript, designed for fast development and optimized builds. This project provides a minimal setup for using React with TypeScript and Vite, including hot module replacement (HMR) and ESLint support ideal for quick prototyping or scalable frontend projects.


## Getting Started

To install and run the project locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Plugins Used

This project supports two official Vite plugins for React:

    @vitejs/plugin-react – uses Babel for Fast Refresh

    @vitejs/plugin-react-swc – uses SWC, which is faster

You can switch between them in vite.config.ts.


## ESLint Configuration

This project includes a base ESLint config. If you plan to scale this into a production app, we recommend enhancing it with type-aware rules.

Example using @typescript-eslint:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    // ...or use strictTypeChecked for stricter enforcement
    // ...tseslint.configs.stylisticTypeChecked (optional)
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})

## Optional React-specific rules

You can also add:

- eslint-plugin-react-dom
- eslint-plugin-react-x

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})

