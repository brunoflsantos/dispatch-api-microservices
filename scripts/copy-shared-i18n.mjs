import { cp, mkdir, readdir } from 'fs/promises';
import path from 'path';

const rootDir = process.cwd();
const sharedI18nDir = path.join(rootDir, 'libs/common/i18n');
const distAppsDir = path.join(rootDir, 'dist/apps');

async function copySharedI18n() {
  try {
    await mkdir(distAppsDir, { recursive: true });
  } catch {
    return;
  }

  const appDirectories = await readdir(distAppsDir, { withFileTypes: true });

  for (const appDirectory of appDirectories) {
    if (!appDirectory.isDirectory()) {
      continue;
    }

    const targetDir = path.join(distAppsDir, appDirectory.name, 'i18n');
    await mkdir(path.dirname(targetDir), { recursive: true });
    await cp(sharedI18nDir, targetDir, {
      errorOnExist: false,
      force: true,
      recursive: true,
    });
  }
}

await copySharedI18n();
