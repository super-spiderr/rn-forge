# RN Forge 🕷️

**A CLI tool to quickly scaffold React Native applications with a scalable project structure.**

RN Forge helps you start a React Native project without spending time setting up the same boilerplate every time.

Choose your project type, navigation, and architecture — RN Forge generates the project structure for you.

## 🚀 Quick Start

No global installation required.

Run:

```bash
npx @super_spider/rn-forge
```

That's it.

RN Forge will guide you through a few questions and generate your React Native project based on your selections.

## ✨ Features

- 📦 Interactive project setup
- 🗂️ Basic or Production-ready architecture
- 🔐 Optional authentication setup
- 🧭 Multiple navigation options
- 🐻 Zustand state management
- 🌐 Axios API layer
- ⚙️ Environment configuration
- 🔗 Import aliases with `@/*`
- ⚡ No global installation required

## 🛠️ Setup Options

When you run RN Forge, you'll be asked a few questions.

### 1. Project Location

Choose whether you want to:

- Use the current directory
- Create a new project directory

### 2. Project Type

#### Empty

Creates a clean React Native application with the selected navigation and architecture.

#### Basic Auth

Includes a basic authentication setup with:

- Login screen
- Register screen
- Zustand authentication store
- Persisted authentication state

The authentication store is generated at:

```text
src/store/useAuthStore.ts
```

### 3. Navigation

Choose the navigation structure that fits your application:

- **Basic** — Stack Navigation
- **Bottom Tabs** — Bottom Tab Navigation
- **Drawer** — Drawer Navigation

React Navigation is configured automatically based on your selection.

## 🏗️ Architecture

RN Forge provides two architecture options.

### Basic Architecture

A lightweight structure for smaller applications and prototypes.

```text
src/
├── components/
│   └── common/
├── screens/
├── navigation/
└── utils/
```

This keeps the project simple without adding unnecessary layers.

### Production Architecture

A more structured architecture designed for applications that are expected to grow.

```text
src/
├── api/
│   └── Axios client + interceptors
├── components/
│   └── common/
├── config/
│   └── Environment configuration
├── hooks/
├── navigation/
├── screens/
├── store/
│   └── Zustand stores
├── types/
└── utils/
```

The Production architecture includes:

- Axios API client
- Axios interceptors
- Environment configuration
- Custom hooks
- Zustand store
- Shared types
- Utility functions

## 🔗 Import Aliases

RN Forge configures the `@/*` import alias automatically.

Instead of:

```tsx
import Button from "../../../components/common/Button";
```

You can use:

```tsx
import Button from "@/components/common/Button";
```

The alias is configured in:

```text
babel.config.js
tsconfig.json
```

and points to:

```text
@/* → src/*
```

## 🔐 Authentication

Selecting **Basic Auth** adds a simple authentication foundation to your project.

The generated project includes:

```text
src/
├── screens/
│   ├── Login/
│   └── Register/
└── store/
    └── useAuthStore.ts
```

The Zustand auth store is persisted so authentication state can survive application restarts.

You can then extend it with your own:

- API authentication
- Token handling
- Refresh tokens
- User profile
- Logout logic
- Protected navigation

## 🧭 Navigation

RN Forge automatically configures React Navigation based on your selection.

Available options:

| Option      | Navigation            |
| ----------- | --------------------- |
| Basic       | Stack Navigation      |
| Bottom Tabs | Bottom Tab Navigation |
| Drawer      | Drawer Navigation     |

Learn more about React Navigation:

https://reactnavigation.org/

## 🌐 API Layer

The **Production architecture** includes an Axios-based API layer.

```text
src/api/
```

This provides a central place to configure:

- Base URL
- Request configuration
- Response handling
- Interceptors
- Authentication headers

This makes it easier to expand your API layer as your application grows.

## ⚙️ Environment Configuration

Production architecture also includes environment configuration using `react-native-config`.

This allows you to keep environment-specific values outside your application code.

For example:

```text
API_URL=your_api_url
```

You can maintain different configurations for environments such as:

- Development
- Staging
- Production

## 📋 Requirements

Before using RN Forge, make sure you have:

- **Node.js >= 18**
- React Native development environment configured
- **Xcode** for iOS development
- **Android Studio** for Android development

For React Native environment setup, follow the official React Native documentation:

https://reactnative.dev/docs/environment-setup

## 📦 Installation

You don't need to install RN Forge globally.

Use:

```bash
npx @super_spider/rn-forge
```

You can also run a specific version:

```bash
npx @super_spider/rn-forge@latest
```

## 💡 Why RN Forge?

Starting a React Native application often means repeating the same setup:

```text
Project
   ↓
Navigation
   ↓
Folder structure
   ↓
State management
   ↓
API setup
   ↓
Environment configuration
   ↓
Authentication
```

RN Forge puts these decisions into an interactive setup so you can get to the actual application development faster.

Instead of starting from a blank project every time:

```text
npx @super_spider/rn-forge
        ↓
   Answer prompts
        ↓
   Choose architecture
        ↓
   Choose navigation
        ↓
   Choose project type
        ↓
   Start building
```

## 🗺️ Roadmap

Some ideas for future versions:

- [ ] More authentication templates
- [ ] More state management options
- [ ] More navigation templates
- [ ] Feature-based architecture
- [ ] Additional API clients
- [ ] Custom project configuration
- [ ] More React Native starter templates

Have an idea? Feel free to open an issue.

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

If you find a bug or have an idea for improving RN Forge, open an issue on GitHub.

**Repository:**

https://github.com/super-spiderr/rn-forge

**Issues:**

https://github.com/super-spiderr/rn-forge/issues

## 📄 License

MIT License

---

Made for React Native developers who'd rather build features than boilerplate. 🕷️
