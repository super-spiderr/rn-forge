import { collectProjectConfig } from "./prompts.js";
import { createProject } from "./generator/createProject.js";
import { installDependencies } from "./generator/dependencies.js";
import { createFolderStructure } from "./generator/folderStructure.js";
import { configureProject } from "./generator/configure.js";

console.log(`
🕷️  SUPER SPIDER
    RN FORGE
    React Native Project Generator
`);

try {
  const config = await collectProjectConfig();

  console.log("\nConfiguration:");
  console.log(config);

  await createProject(config);
  await installDependencies(config);
  await createFolderStructure(config);
  await configureProject(config);

  console.log(`
🎉 RN Forge completed successfully!

Your project:
${config.projectDirectory}
`);
} catch (error) {
  console.error("\n❌ RN Forge failed:");
  console.error(error.message);

  process.exit(1);
}
