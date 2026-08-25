import { RN_FORGE_CONFIG } from "../config.js";

/**
 * Builds the set of screen and navigation files for the project, keyed by
 * path relative to the project root. Screens are always folder-per-screen
 * (ScreenName/ScreenName.tsx + index.ts barrel) so navigators and other
 * screens import them the same way regardless of architecture.
 */
export function getNavigationFiles(config) {
  const { navigation, projectType, architecture } = config;
  const isProduction = architecture === RN_FORGE_CONFIG.architecture.PRODUCTION;

  const files = {};

  const screen = (name, body) => {
    files[`src/screens/${name}/${name}.tsx`] = body;
    files[`src/screens/${name}/index.ts`] = `export { default } from './${name}';\n`;
  };

  screen(
    "Home",
    `import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>Edit src/screens/Home/Home.tsx to get started.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center' },
});
`,
  );

  const isAuth = projectType === RN_FORGE_CONFIG.projectTypes.AUTH;

  if (isAuth) {
    const authStoreImport = isProduction
      ? "@/store/useAuthStore"
      : "../../store/useAuthStore";

    screen(
      "Login",
      `import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '${authStoreImport}';

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useAuthStore((state) => state.signIn);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign in" onPress={() => signIn(email, password)} />
      <Button title="Create an account" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});
`,
    );

    screen(
      "Register",
      `import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '${authStoreImport}';

export default function Register({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useAuthStore((state) => state.signIn);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Create account" onPress={() => signIn(email, password)} />
      <Button title="Back to sign in" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});
`,
    );
  }

  // --- Main navigator: renders Home (+ a second tab/drawer item as a
  // placeholder so Tabs/Drawer aren't empty shells) ---
  const mainScreensImport = (rel) => (isProduction ? `@/screens/${rel}` : `../screens/${rel}`);

  if (navigation === RN_FORGE_CONFIG.navigation.TABS) {
    files["src/navigation/MainNavigator.tsx"] = `import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '${mainScreensImport("Home")}';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Home" component={Home} />
    </Tab.Navigator>
  );
}
`;
  } else if (navigation === RN_FORGE_CONFIG.navigation.DRAWER) {
    files["src/navigation/MainNavigator.tsx"] = `import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '${mainScreensImport("Home")}';

const Drawer = createDrawerNavigator();

export default function MainNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: true }}>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
}
`;
  } else {
    files["src/navigation/MainNavigator.tsx"] = `import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '${mainScreensImport("Home")}';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
`;
  }

  if (isAuth) {
    files["src/navigation/AuthNavigator.tsx"] = `import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '${mainScreensImport("Login")}';
import Register from '${mainScreensImport("Register")}';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
`;

    const authStoreImport = isProduction
      ? "@/store/useAuthStore"
      : "../store/useAuthStore";

    files["src/navigation/RootNavigator.tsx"] = `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { useAuthStore } from '${authStoreImport}';

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
`;
  } else {
    files["src/navigation/RootNavigator.tsx"] = `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './MainNavigator';

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}
`;
  }

  return files;
}
