# MyTabsApp - React Native Expo with Supabase

A modern React Native app built with Expo Router, featuring tab navigation and Supabase integration.

## Features

- 🏠 **Home Tab** - Welcome screen with app overview
- ✅ **Checklist Tab** - Interactive task management with add, complete, and delete functionality
- 👤 **Profile Tab** - User profile screen
- 🚀 **Expo Router** - File-based routing system
- 🗄️ **Supabase Ready** - Pre-configured for backend integration
- 📱 **Modern Navigation** - Tab-based navigation following best practices

## Tech Stack

- **React Native** (0.79.4)
- **Expo** (~53.0.12)
- **Expo Router** (~5.1.0) - File-based routing
- **Supabase** (^2.50.2) - Backend as a Service
- **TypeScript** - Type safety
- **AsyncStorage** - Local data persistence

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Update your `.env` file with your credentials:
     ```bash
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Run the database schema setup:
     - Go to your Supabase Dashboard → SQL Editor
     - Copy and run the contents of `supabase/schema.sql`
     - This creates all necessary tables and security policies

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on your preferred platform:**
   - **Android:** `npm run android`
   - **iOS:** `npm run ios` (macOS required)
   - **Web:** `npm run web`

## Project Structure

```
app/
├── (tabs)/
│   ├── _layout.tsx      # Tab navigation layout
│   ├── index.tsx        # Home tab
│   ├── checklist.tsx    # Checklist tab
│   └── profile.tsx      # Profile tab
├── _layout.tsx          # Root layout
└── modal.tsx           # Example modal screen

lib/
├── supabase.ts         # Supabase client configuration
└── navigation.ts       # Navigation utilities

components/
├── Themed.tsx          # Themed components
└── ...                 # Other shared components
```

## Navigation

The app uses Expo Router for navigation. Key features:

- **Tab Navigation:** File-based tabs in `app/(tabs)/`
- **Modal Screens:** Accessible via `router.push('/modal')`
- **Navigation Utilities:** Helper functions in `lib/navigation.ts`

### Navigation Examples

```typescript
import { navigation } from '@/lib/navigation';

// Navigate to tabs
navigation.goToHome();
navigation.goToChecklist();
navigation.goToProfile();

// Open modal
navigation.openModal();

// Navigate with parameters
navigation.navigateWithParams('/profile', { userId: '123' });
```

## Checklist Features

The checklist tab includes:

- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Delete tasks with confirmation
- ✅ Progress tracking
- ✅ Persistent local storage

## Supabase Integration

The app is pre-configured for Supabase with:

- Authentication setup
- AsyncStorage for session persistence
- URL polyfill for React Native compatibility

To use Supabase:

1. Import the client: `import { supabase } from '@/lib/supabase';`
2. Use Supabase APIs: `const { data, error } = await supabase.from('table').select();`

## Development

- **TypeScript:** Full type safety throughout the app
- **Hot Reload:** Instant updates during development
- **Cross-Platform:** Works on iOS, Android, and Web

## Next Steps

1. Set up your Supabase project
2. Create database tables for your data
3. Implement authentication flows
4. Add more features to each tab
5. Deploy using EAS Build

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

---

Built with ❤️ using Expo and React Native


git config --global user.name "Carlos Aquino"
git config --global user.email duard.js@gmail.com 
git config --global pull.ff only
git config --global credential.helper cache
git config --global credential.helper 'cache --timeout=293600'