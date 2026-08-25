import fs from "node:fs/promises";
import path from "node:path";
import { RN_FORGE_CONFIG } from "../config.js";
import { getNavigationFiles } from "./navigation.js";

async function writeFiles(projectDirectory, files) {
  for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = path.join(projectDirectory, relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);
  }
}

function getCommonFiles() {
  return {
    "src/components/common/Button.tsx": `import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type ButtonProps = {
  label: string;
  onPress: () => void;
};

export default function Button({ label, onPress }: ButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  label: { color: '#fff', fontWeight: '600' },
});
`,
    "src/components/common/index.ts": `export { default as Button } from './Button';\n`,
    "src/utils/index.ts": `export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}
`,
  };
}

function getProductionFiles(config) {
  const { projectType } = config;
  const isAuth = projectType === RN_FORGE_CONFIG.projectTypes.AUTH;

  const files = {
    "src/config/env.ts": `import Config from 'react-native-config';

export const env = {
  apiUrl: Config.API_URL ?? 'https://api.example.com',
};
`,
    ".env": `API_URL=https://api.example.com\n`,
    ".env.example": `API_URL=https://api.example.com\n`,
    "src/api/client.ts": `import axios from 'axios';
import { env } from '@/config/env';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  // Attach an auth token here once you have one, e.g.:
  // config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
`,
    "src/api/endpoints.ts": `export const endpoints = {
  // example: users: '/users',
};
`,
    "src/types/index.ts": `export type Nullable<T> = T | null;\n`,
    "src/hooks/useDebounce.ts": `import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
`,
    "src/hooks/index.ts": `export { useDebounce } from './useDebounce';\n`,
  };

  if (!isAuth) {
    files["src/store/useAppStore.ts"] = `import { create } from 'zustand';

type AppState = {
  count: number;
  increment: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
`;
  }

  return files;
}

function getAuthStoreFile(config) {
  const { architecture } = config;
  const isProduction = architecture === RN_FORGE_CONFIG.architecture.PRODUCTION;

  return {
    "src/store/useAuthStore.ts": `import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
  isAuthenticated: boolean;
  email: string | null;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: null,
      // Replace this with a real call to your ${isProduction ? "src/api/client" : "backend"} once you have an auth endpoint.
      signIn: (email) => set({ isAuthenticated: true, email }),
      signOut: () => set({ isAuthenticated: false, email: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated, email: state.email }),
    },
  ),
);
`,
  };
}

function getAppFile(config) {
  const { navigation } = config;
  const needsGestureHandlerRoot = navigation === RN_FORGE_CONFIG.navigation.DRAWER;

  if (needsGestureHandlerRoot) {
    return `import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNavigator />
    </GestureHandlerRootView>
  );
}
`;
  }

  return `import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return <RootNavigator />;
}
`;
}

export async function createFolderStructure(config) {
  const { projectDirectory, architecture, projectType } = config;
  const isProduction = architecture === RN_FORGE_CONFIG.architecture.PRODUCTION;
  const isAuth = projectType === RN_FORGE_CONFIG.projectTypes.AUTH;

  console.log("\n📁 Generating folder structure...");

  const files = {
    ...getCommonFiles(),
    ...getNavigationFiles(config),
    "App.tsx": getAppFile(config),
  };

  if (isProduction) {
    Object.assign(files, getProductionFiles(config));
  }

  if (isAuth) {
    Object.assign(files, getAuthStoreFile(config));
  }

  await writeFiles(projectDirectory, files);

  console.log(`✔ Created ${Object.keys(files).length} files`);
}
