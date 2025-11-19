# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- **Install dependencies**: `npm install`
- **Run the app in development mode**: `npm run dev`
- **Build the app for production**: `npm run build`
- **Preview the production build**: `npm run preview`

Before running the app, ensure you have set the `GEMINI_API_KEY` in a `.env.local` file.

## Code Architecture

This is a React application built with Vite.

- The main application component is `App.tsx`.
- Components are located in the `components` directory.
- Static assets are in the `public` directory.
- Type definitions are in `types.ts`.
