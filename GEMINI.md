
# Gemini Code Assistant Guidance

This file provides guidance for the Gemini code assistant to ensure it can effectively contribute to this project.

---

## 🧠 Project Overview

This is a **React Native application built with Expo and TypeScript** using:

- **Expo Router** for file-based navigation.
- **Supabase** as the backend (authentication, database, realtime).
- **Legend-State** with `customSynced` for realtime observable sync.
- **NativeWind** for styling using Tailwind CSS conventions.
- A **feature-based folder structure** for maintainability and scalability.

---

## 🚀 How to Run the Application

```bash
npm install       # Install dependencies
npm start         # Start Expo Dev Server
npm run android   # Run on Android
npm run ios       # Run on iOS
npm run web       # Run on Web
```

---

## 🧪 How to Run Tests

```bash
npm run test
```

---

## 📁 Recommended Folder Structure

```
my-app/
├── app/                        # Expo Router screens and navigation entry
│   └── (tabs)/                # Tab screens like todos.tsx
│
├── features/                  # Feature-based modules
│   ├── todos/                 # Todos feature
│   │   ├── components/        # UI components (TodoItem, TodoList, etc.)
│   │   ├── screens/           # Screens (TodosScreen.tsx)
│   │   ├── services/          # Supabase logic (todoService.ts)
│   │   ├── types.ts           # Feature-specific types
│   │   └── constants.ts       # Feature-specific constants
│
├── components/                # Shared UI components (reusable & styled)
│   ├── Themed/                # Themed Text, View, etc.
│   └── Button.tsx             # Shared button with tailwind classes
│
├── lib/                       # Libraries & shared logic
│   ├── supabase/              # Supabase client, realtime handlers
│   │   ├── client.ts
│   │   └── realtime.ts
│   ├── theme/                 # Theming utilities
│   │   └── useThemeColor.ts
│   └── utils/                 # Shared helper functions
│       └── formatDate.ts
│
├── hooks/                     # Shared reusable hooks (e.g., useOnlineStatus.ts)
│
├── constants/                 # Global constants
│   └── index.ts
│
├── styles/                    # Tailwind config, custom styles
│   └── tailwind.config.js
│
├── types/                     # Global TS types
│   └── env.d.ts
│
├── assets/                    # Fonts, images, icons
│
├── .env                       # Environment variables
├── app.config.ts              # Expo app config
└── gemini.md                  # This file
```

---

## ✨ Styling with Tailwind (via NativeWind)

We use [**NativeWind**](https://www.nativewind.dev/) to bring Tailwind CSS into React Native.

### ✅ Setup

Already included:
```bash
npm install nativewind
```

Ensure your `babel.config.js` includes:
```js
plugins: ['nativewind/babel']
```

Update `tailwind.config.js`:
```js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 💡 Usage Example:

```tsx
<Text className="text-lg font-bold text-gray-900 dark:text-white">
  Hello World
</Text>

<View className="bg-white dark:bg-black p-4 rounded-lg shadow">
  <TodoItem />
</View>
```

---

## 🧱 Component & Hook Conventions

### Shared Components (`/components`)
- Prefer theming with `Themed/Text.tsx`, `Themed/View.tsx`.
- Add custom shared components like `Button.tsx`, `Input.tsx`, etc.
- Use Tailwind classes for styling (`className="..."`).

### Hooks (`/hooks`)
- Place reusable logic like `useDebounce`, `useAuth`, `useSupabaseUser` here.
- Avoid business logic in components; extract into hooks or services.

### Utils (`/lib/utils`)
- Place helpers like `formatDate`, `generateId`, etc.
- Keep logic pure and testable.

---

## 📡 Supabase + Realtime Integration

### Client
Use the preconfigured client:
```ts
// lib/supabase/client.ts
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
```

### Realtime Sync
Use `customSynced` from `legend-state`:
```ts
// features/todos/services/todoService.ts
export const todos$ = observable(
  customSynced({
    supabase,
    collection: 'todos',
    select: (from) =>
      from
        .select('id,text,done,created_at,updated_at,deleted')
        .is('deleted', null)
        .order('updated_at', { ascending: false }),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: { name: 'todos', retrySync: true },
    retry: { infinite: true },
    fieldCreatedAt: 'created_at',
    fieldUpdatedAt: 'updated_at',
  })
);
```

---

## ✅ Coding Standards

- **Language:** TypeScript
- **Styling:** NativeWind (`className`) + `Themed` components
- **Navigation:** File-based with Expo Router
- **State Management:** 
  - Local: React hooks (`useState`, `useEffect`)
  - Global sync: `legend-state` with `customSynced`
- **File Naming:** `kebab-case` for files, `PascalCase` for components
- **Data Fetching:** Supabase client via `lib/supabase/client.ts`

---

## 🧠 Feature Design Example

Each feature (e.g., `todos`) includes:

- `screens/TodosScreen.tsx`
- `components/TodoItem.tsx`
- `services/todoService.ts`
- `types.ts` (e.g. `Todo`)
- `constants.ts` (e.g. icons, labels)

---

## ✅ Summary

- Organize by **features**, not types (i.e., group screen + logic + UI).
- Use **shared** folders only for **reusable** UI/hooks/helpers.
- Use **NativeWind** for styling and theme-aware components.
- Keep **Supabase logic** in `services/`, abstracted from screens.

> This structure helps scale your app, onboard new devs quickly, and keep code clean and modular.

---