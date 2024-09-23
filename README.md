# Language Dictionary App

Translate words between Danish and English, save them into your personal dictionary, and practice with flashcards!

## Installation

### 1. Expo

#### 1. Initialize a new project

```bash
npx create-expo-app my-app
```

#### 2. Start the development server

```bash
npx expo start
```

### Nativewind (TailwindCSS for native)

#### 1. Install Nativewind and TailwindCSS

```bash
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
```

#### 2. Setup Tailwind CSS

```bash
npx tailwindcss init
```

#### 3. Change the Tailwind Config

//tailwind.config.js

```bash
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./other directory/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 3. Add the Babel plugin

//babel.config.js

```bash
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
  };
};

```

### to update a project to expo

```bash
npx eas update
```

### to build for Android (.apk)

```bash
npx eas build -p android --profile preview
```
