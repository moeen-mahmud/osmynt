import { copyFileSync, mkdirSync, existsSync , rmSync} from 'fs';
import { join } from 'path';

const distDir = './dist/browser';
const packageDir = './dist/browser-extension';

// Clean and create package directory
if (existsSync(packageDir)) {
  rmSync(packageDir, { recursive: true });
}
mkdirSync(packageDir, { recursive: true });

// Copy built files
const filesToCopy = [
  { src: join(distDir, 'osmynt-browser.js'), dest: join(packageDir, 'osmynt-browser.js') },
  { src: join(distDir, 'osmynt-browser.umd.js'), dest: join(packageDir, 'osmynt-browser.umd.js') },
  { src: './src/browser/manifest.json', dest: join(packageDir, 'manifest.json') },
  { src: './src/browser/popup.html', dest: join(packageDir, 'popup.html') },
  { src: './src/browser/popup.js', dest: join(packageDir, 'popup.js') },
  { src: './src/browser/background.js', dest: join(packageDir, 'background.js') },
  { src: './src/browser/content.js', dest: join(packageDir, 'content.js') },
  { src: './src/browser/content.css', dest: join(packageDir, 'content.css') },
  { src: './resources/osmynt.svg', dest: join(packageDir, 'resources/osmynt.svg') },
  { src: './resources/osmynt-128x.png', dest: join(packageDir, 'resources/osmynt-128x.png') },
];

// Create resources directory
mkdirSync(join(packageDir, 'resources'), { recursive: true });

// Copy files
filesToCopy.forEach(({ src, dest }) => {
  try {
    copyFileSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  } catch (error) {
    console.error(`Failed to copy ${src}:`, error);
  }
});

// Create additional icon sizes (you'll need to create these)
const iconSizes = [16, 32, 48];
iconSizes.forEach(size => {
  const src = './resources/osmynt-128x.png';
  const dest = join(packageDir, `resources/osmynt-${size}x${size}.png`);
  try {
    copyFileSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  } catch (error) {
    console.warn(`Could not create ${size}x${size} icon:`, error);
  }
});

console.log('Browser extension packaged successfully!');
console.log(`Package directory: ${packageDir}`);
console.log('You can now load this as an unpacked extension in Chrome/Edge.');
