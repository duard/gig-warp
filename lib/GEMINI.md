
# Gemini Code Assistant Guidance for `lib` Directory

This file provides guidance for the Gemini code assistant when working within the `lib` directory.

## About This Directory

This directory contains the Supabase client, navigation utilities, and other libraries that are used throughout the application.

## Key Files

- **`supabase.ts`**: This file initializes the Supabase client.
- **`navigation.ts`**: This file contains navigation utilities.
- **`storage.ts`**: This file contains utilities for interacting with AsyncStorage.

## Supabase

- The Supabase client is initialized in `supabase.ts` and should be used for all communication with the backend.
- Do not create new instances of the Supabase client. Instead, import the existing instance from `supabase.ts`.

## Navigation

- The `navigation.ts` file contains helper functions for navigating between screens.
- Use these helper functions instead of the `expo-router` API directly to ensure consistency.

## Storage

- The `storage.ts` file contains helper functions for interacting with AsyncStorage.
- Use these helper functions for all local storage operations.

## development environment

 - focus on android development 
 - the app will run on both, IOS and android
 - use sex imports with @ 

 ## key features


- The app should follow OFF LINE FIRST FILOSOPHY
- use the legend state @legendapp/state"
