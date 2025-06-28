
# Gemini Code Assistant Guidance

This file provides guidance for the Gemini code assistant to ensure it can effectively contribute to this project.

## About the Project

This is a React Native application built with Expo and TypeScript. It uses Expo Router for navigation and Supabase for the backend. The app features a tab-based interface.

## How to Run the Application

To start the development server, run:

```bash
npm start
```

Then, you can run the app on the following platforms:

- **Android:** `npm run android`
- **iOS:** `npm run ios`
- **Web:** `npm run web`

## How to Run Tests

To run the test suite, use the following command:

```bash
npm run test
```

## Coding Conventions

- **Language:** TypeScript
- **Styling:** Use the `Themed` components from `components/Themed.tsx` for consistent styling.
- **Navigation:** Use the `navigation` object from `lib/navigation.ts` for all navigation actions.
- **State Management:** For local state, use React hooks. For global state, use React Context or a state management library if one is introduced.
- **Data Fetching:** Use the Supabase client from `lib/supabase.ts` for all communication with the backend.
- **File Naming:** Use kebab-case for file names (e.g., `my-component.tsx`).
- **Component Structure:** Follow the existing structure in the `components` and `features` directories.

## Supabase

- The Supabase client is initialized in `lib/supabase.ts`.
- The database schema is defined in `supabase-schema.sql`.
- When making changes to the database schema, update `supabase-schema.sql` accordingly.

## Directory-Specific Guidance

- **`app/`**: This directory contains the screens and navigation setup for the app.
- **`components/`**: This directory contains reusable components.
- **`constants/`**: This directory contains constants used throughout the app.
- **`context/`**: This directory contains React context providers.
- **`features/`**: This directory contains the business logic for different features of the app.
- **`hooks/`**: This directory contains custom React hooks.
- **`lib/`**: This directory contains the Supabase client, navigation utilities, and other libraries.
- **`services/`**: This directory contains services that interact with external APIs.
- **`types/`**: This directory contains TypeScript type definitions.
