# RN Forge 🕷️

An opinionated React Native project generator for production-ready applications. Answer a few prompts and get a scaffolded app wired up with navigation, state management, and a folder structure that scales.

## Usage

No install needed — run it with `npx`:

```bash
npx @super_spider/rn-forge
```

You'll be asked:

- Use the current directory, or create a new one?
- Project type: **Empty** or **Basic Auth** (adds Login/Register screens + a Zustand-backed auth store)
- Navigation: **Basic** (stack), **Bottom Tabs**, or **Drawer**
- Folder architecture: **Basic** or **Production**

## What you get

Every project ships with [React Navigation](https://reactnavigation.org/) wired up out of the box.

**Basic architecture** — a flat, minimal structure:

```
src/
  components/common/
  screens/
  navigation/
  utils/
```

**Production architecture** adds an API layer, environment config, and extra layers for a larger app:

```
src/
  api/            # Axios client + interceptors
  components/common/
  config/         # react-native-config env wrapper
  hooks/
  navigation/
  screens/
  store/          # Zustand
  types/
  utils/
```

with `@/*` → `src/*` import aliases pre-configured in both `babel.config.js` and `tsconfig.json`.

Choosing **Basic Auth** adds `Login`/`Register` screens and a persisted Zustand auth store (`src/store/useAuthStore.ts`), regardless of architecture.

## Requirements

- Node.js >= 18
- Xcode / Android Studio set up as usual for React Native development

## License

MIT
