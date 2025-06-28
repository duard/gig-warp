
# Gemini Code Assistant Guidance for `app` Directory

This file provides guidance for the Gemini code assistant when working within the `app` directory.

## About This Directory

This directory contains the screens and navigation setup for the application, using Expo Router.

## Key Files

- **`_layout.tsx`**: The root layout of the app.
- **`(tabs)/_layout.tsx`**: The layout for the tab navigator.
- **`(tabs)/index.tsx`**: The home screen.
- **`(tabs)/checklist.tsx`**: The checklist screen.
- **`(tabs)/profile.tsx`**: The profile screen.

## Navigation

- Navigation is handled by Expo Router. To navigate between screens, use the `Link` component from `expo-router` or the `navigation` object from `lib/navigation.ts`.
- New screens should be created as new files in this directory.
- For new tabs, create a new file in the `(tabs)` directory and add it to the `(tabs)/_layout.tsx` file.

## Screen Structure

- Each screen should be a React component that exports a default function.
- Use the `Themed` components from `components/Themed.tsx` for consistent styling.
- Business logic should be kept out of the screens and placed in the `features` directory.
