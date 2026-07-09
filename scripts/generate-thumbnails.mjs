import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceRoot = path.join(root, 'public', 'works');
const thumbRoot = path.join(sourceRoot, 'thumbs');
const extensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const walk = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (fullPath === thumbRoot) continue;
      files.push(...await walk(fullPath));
      continue;
    }

    if (extensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
};

const toThumbPath = (filePath) => {
  const relative = path.relative(sourceRoot, filePath);
  const parsed = path.parse(relative);
  return path.join(thumbRoot, parsed.dir, `${parsed.name}.webp`);
};

const files = await walk(sourceRoot);

await Promise.all(files.map(async (filePath) => {
  const outputPath = toThumbPath(filePath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  await sharp(filePath)
    .rotate()
    .resize({
      width: 720,
      height: 520,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: 62,
      effort: 4,
    })
    .toFile(outputPath);
}));

const sourceBytes = (await Promise.all(files.map(async (filePath) => (await fs.stat(filePath)).size)))
  .reduce((total, size) => total + size, 0);
const outputFiles = await walk(thumbRoot);
const thumbBytes = (await Promise.all(outputFiles.map(async (filePath) => (await fs.stat(filePath)).size)))
  .reduce((total, size) => total + size, 0);

console.log(`Generated ${outputFiles.length} thumbnails.`);
console.log(`Source images: ${(sourceBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`Thumbnails: ${(thumbBytes / 1024 / 1024).toFixed(2)} MB`);
