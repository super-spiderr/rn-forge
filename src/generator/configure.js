import fs from "node:fs/promises";
import path from "node:path";
import { RN_FORGE_CONFIG } from "../config.js";

function buildBabelConfig(config) {
  const { architecture, navigation } = config;
  const isProduction = architecture === RN_FORGE_CONFIG.architecture.PRODUCTION;
  const needsReanimated = navigation === RN_FORGE_CONFIG.navigation.DRAWER;

  const plugins = [];

  if (isProduction) {
    plugins.push(`[
      'module-resolver',
      {
        root: ['./src'],
        alias: { '@': './src' },
        extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.json', '.ts', '.tsx'],
      },
    ]`);
  }

  // react-native-reanimated's babel plugin has to be listed last.
  if (needsReanimated) {
    plugins.push(`'react-native-reanimated/plugin'`);
  }

  const pluginsBlock =
    plugins.length > 0 ? `,\n  plugins: [\n    ${plugins.join(",\n    ")},\n  ]` : "";

  return `module.exports = {
  presets: ['module:@react-native/babel-preset']${pluginsBlock},
};
`;
}

async function patchTsConfig(projectDirectory) {
  const tsconfigPath = path.join(projectDirectory, "tsconfig.json");

  let tsconfig;
  try {
    const raw = await fs.readFile(tsconfigPath, "utf8");
    tsconfig = JSON.parse(raw);
  } catch {
    tsconfig = { extends: "@react-native/typescript-config" };
  }

  tsconfig.compilerOptions = {
    ...tsconfig.compilerOptions,
    baseUrl: ".",
    paths: {
      ...(tsconfig.compilerOptions?.paths ?? {}),
      "@/*": ["src/*"],
    },
  };

  await fs.writeFile(tsconfigPath, `${JSON.stringify(tsconfig, null, 2)}\n`);
}

export async function configureProject(config) {
  const { projectDirectory, architecture } = config;
  const isProduction = architecture === RN_FORGE_CONFIG.architecture.PRODUCTION;

  console.log("\n⚙️  Configuring project...");

  await fs.writeFile(
    path.join(projectDirectory, "babel.config.js"),
    buildBabelConfig(config),
  );

  if (isProduction) {
    await patchTsConfig(projectDirectory);
    console.log('   Added "@/*" -> "src/*" import alias (babel + tsconfig)');
    console.log(
      "   react-native-config installed - iOS needs a one-time manual Xcode",
    );
    console.log(
      "   build-phase step, see: https://github.com/lugg/react-native-config#ios---with-cocoapods",
    );
  }

  console.log("✔ Project configured");
}
