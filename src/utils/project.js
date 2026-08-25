import fs from "node:fs/promises";
import path from "node:path";

export async function validateProjectDirectory(appName) {
  const projectPath = path.resolve(process.cwd(), appName);

  try {
    await fs.access(projectPath);

    throw new Error(`A directory named "${appName}" already exists.`);
  } catch (error) {
    if (error.code === "ENOENT") {
      return projectPath;
    }

    throw error;
  }
}
export async function toProjectName(folderName) {
  const projectName = folderName
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  return projectName;
}
