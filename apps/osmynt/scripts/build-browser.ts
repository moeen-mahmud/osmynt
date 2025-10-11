import { build } from 'vite';
import config from '../vite.config';

// Build for VS Code web extension
build(config).catch(() => process.exit(1));
