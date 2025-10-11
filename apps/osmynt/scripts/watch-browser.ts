import { build } from 'vite';
import config from '../vite.config';

// Enable watch mode
const watchConfig = {
  ...config,
  build: {
    ...config.build,
    watch: {}
  }
};

build(watchConfig).catch(() => process.exit(1));
