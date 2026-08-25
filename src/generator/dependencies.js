import { spawn } from "node:child_process";
import { RN_FORGE_CONFIG } from "../config.js";

/**
 * Computes the extra dependencies (beyond what the RN template ships with)
 * required for the chosen navigation type, architecture, and project type.
 */
export function getDependencies(config) {
  const { navigation, architecture, projectType } = config;

  const dependencies = new Set([
    // Navigation is always installed - every project answers this prompt.
    "@react-navigation/native",
    "@react-navigation/native-stack",
    "react-native-screens",
    "react-native-safe-area-context",
  ]);

  const devDependencies = new Set();

  if (navigation === RN_FORGE_CONFIG.navigation.TABS) {
    dependencies.add("@react-navigation/bottom-tabs");
  }

  if (navigation === RN_FORGE_CONFIG.navigation.DRAWER) {
    dependencies.add("@react-navigation/drawer");
    dependencies.add("react-native-gesture-handler");
    dependencies.add("react-native-reanimated");
  }

  const isAuth = projectType === RN_FORGE_CONFIG.projectTypes.AUTH;
  const isProduction = architecture === RN_FORGE_CONFIG.architecture.PRODUCTION;

  // Zustand backs the auth store (Login/Register screens read/write it)
  // whenever there's auth, and backs the example app store on Production.
  if (isProduction || isAuth) {
    dependencies.add("zustand");
  }

  if (isProduction) {
    dependencies.add("axios");
    dependencies.add("react-native-config");
    devDependencies.add("babel-plugin-module-resolver");
  }

  if (isAuth) {
    dependencies.add("react-hook-form");
    dependencies.add("zod");
    dependencies.add("@hookform/resolvers");
    dependencies.add("@react-native-async-storage/async-storage");
  }

  return {
    dependencies: [...dependencies],
    devDependencies: [...devDependencies],
  };
}

function runInstall(args, cwd) {
  return new Promise((resolve, reject) => {
    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
    const child = spawn(npmCmd, args, {
      cwd,
      stdio: "inherit",
    });

    child.on("error", reject);

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Dependency installation failed with exit code ${code}`));
    });
  });
}

export async function installDependencies(config) {
  const { projectDirectory } = config;
  const { dependencies, devDependencies } = getDependencies(config);

  if (dependencies.length === 0 && devDependencies.length === 0) {
    return;
  }

  console.log("\n📦 Installing additional dependencies...");

  if (dependencies.length > 0) {
    console.log(`   ${dependencies.join(", ")}`);
    await runInstall(["install", ...dependencies], projectDirectory);
  }

  if (devDependencies.length > 0) {
    console.log(`   ${devDependencies.join(", ")} (dev)`);
    await runInstall(
      ["install", "--save-dev", ...devDependencies],
      projectDirectory,
    );
  }

  console.log("✔ Dependencies installed");
}
