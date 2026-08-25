import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

function runInit(args) {
  return new Promise((resolve, reject) => {
    const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
    const child = spawn(npxCmd, args, {
      stdio: "inherit",
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `React Native project creation failed with exit code ${code}`,
        ),
      );
    });
  });
}

export async function createProject(config) {
  const { projectName, reactNativeVersion, projectDirectory, useCurrentDirectory } =
    config;

  console.log("\n🔥 Creating React Native project...");
  console.log(`   Name: ${projectName}`);
  console.log(`   React Native: ${reactNativeVersion}`);
  console.log(`   Location: ${projectDirectory}\n`);

  const baseArgs = [
    "@react-native-community/cli@latest",
    "init",
    projectName,
    "--version",
    reactNativeVersion,
  ];

  if (!useCurrentDirectory) {
    await runInit([...baseArgs, "--directory", projectDirectory]);
    console.log("\n✔ React Native project created successfully");
    return;
  }

  // The RN CLI resolves its target directory as
  // path.relative(process.cwd(), --directory) and then does
  // fs.mkdirSync(thatResult). When --directory points at cwd itself, the
  // relative path collapses to "" and mkdirSync("") throws ENOENT — there is
  // no value we can pass for --directory that avoids this once it resolves
  // to cwd. So instead we scaffold into a temporary sibling folder and move
  // the generated files up into the current directory afterwards.
  const tempDirectory = path.join(
    path.dirname(projectDirectory),
    `.rn-forge-tmp-${Date.now()}`,
  );

  await runInit([...baseArgs, "--directory", tempDirectory]);

  const entries = await fs.readdir(tempDirectory);
  await Promise.all(
    entries.map((entry) =>
      fs.rename(
        path.join(tempDirectory, entry),
        path.join(projectDirectory, entry),
      ),
    ),
  );
  await fs.rmdir(tempDirectory);

  console.log("\n✔ React Native project created successfully");
}
