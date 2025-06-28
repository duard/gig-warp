
# Gemini Code Assistant Guidance for `components` Directory

This file provides guidance for the Gemini code assistant when working within the `components` directory.

## About This Directory

This directory contains reusable components that are used throughout the application.

## Key Files

- **`Themed.tsx`**: This file contains custom components that are themed for the application.
- **`StyledText.tsx`**: This file contains a styled text component.

## Creating New Components

- New components should be created in their own file with a descriptive name in kebab-case (e.g., `my-component.tsx`).
- Components should be designed to be reusable and customizable through props.
- Use the `Themed` components from `Themed.tsx` to ensure consistent styling with the rest of the application.

## Using Components

- To use a component, import it into the desired file and use it as a React component.
- When using a component, make sure to pass all required props.
