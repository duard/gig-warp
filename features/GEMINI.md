
# Gemini Code Assistant Guidance for `features` Directory

This file provides guidance for the Gemini code assistant when working within the `features` directory.

## About This Directory

This directory contains the business logic for the different features of the application. Each feature has its own directory, which is further divided into `components`, `services`, and `types`.

## Directory Structure

- **`components/`**: This directory contains components that are specific to the feature.
- **`services/`**: This directory contains services that interact with external APIs or the database.
- **`types/`**: This directory contains TypeScript type definitions that are specific to the feature.

## Creating New Features

- To create a new feature, create a new directory with a descriptive name.
- Inside the new directory, create the `components`, `services`, and `types` directories.
- Add the feature's components, services, and types to their respective directories.

## Using Features

- To use a feature, import its components, services, and types into the desired file.
- The business logic of the feature should be self-contained and not leak into other parts of the application.
