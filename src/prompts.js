import path from "node:path";
import { input, select } from "@inquirer/prompts";
import { RN_FORGE_CONFIG } from "./config.js";
import { toProjectName } from "./utils/project.js";
export async function collectProjectConfig() {
  const currentDirectory = process.cwd();
  const defaultAppName = path.basename(currentDirectory);

  const useCurrentDirectory = await select({
    message: `Use current directory "${defaultAppName}"?`,
    choices: [
      {
        name: "Yes",
        value: true,
        description: currentDirectory,
      },
      {
        name: "No",
        value: false,
        description: "Create the project somewhere else",
      },
    ],
  });

  let appName;
  let projectLocation;

  if (useCurrentDirectory) {
    appName = await toProjectName(defaultAppName);
    projectLocation = currentDirectory;
  } else {
    appName = await input({
      message: "What is your app name?",
      default: "my-app",

      /**
       * @param {string} value
       * @returns {boolean | string}
       */
      validate(value) {
        if (!value.trim()) {
          return "App name is required";
        }

        if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
          return "Use only letters, numbers, hyphens, and underscores";
        }

        return true;
      },
    });

    const parentDirectory = await input({
      message: "Where should the project be created?",
      default: currentDirectory,
    });

    projectLocation = path.resolve(parentDirectory, appName);
  }

  const projectType = await select({
    message: "What type of project do you want?",
    choices: [
      {
        name: "Empty",
        value: RN_FORGE_CONFIG.projectTypes.EMPTY,
        description: "A clean React Native project",
      },
      {
        name: "Basic Auth",
        value: RN_FORGE_CONFIG.projectTypes.AUTH,
        description: "Project with Login and Register screens",
      },
    ],
  });

  const navigation = await select({
    message: "What navigation do you want?",
    choices: [
      {
        name: "Basic",
        value: RN_FORGE_CONFIG.navigation.BASIC,
        description: "Stack navigation",
      },
      {
        name: "Bottom Tabs",
        value: RN_FORGE_CONFIG.navigation.TABS,
        description: "Bottom tab navigation",
      },
      {
        name: "Drawer",
        value: RN_FORGE_CONFIG.navigation.DRAWER,
        description: "Drawer navigation",
      },
    ],
  });

  const architecture = await select({
    message: "What folder architecture do you want?",
    choices: [
      {
        name: "Basic",
        value: RN_FORGE_CONFIG.architecture.BASIC,
        description: "Simple project structure",
      },
      {
        name: "Production",
        value: RN_FORGE_CONFIG.architecture.PRODUCTION,
        description: "Scalable production-level architecture",
      },
    ],
  });

  return {
    projectName: appName,
    projectType,
    navigation,
    architecture,
    projectDirectory: projectLocation,
    useCurrentDirectory,
    reactNativeVersion: RN_FORGE_CONFIG.reactNativeVersion,
  };
}
