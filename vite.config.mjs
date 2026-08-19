import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {optimize} from 'svgo';
import {defineConfig} from 'vite';
import buildConfig from './build.config.js';
import packageJson from './package.json' with {type: 'json'};

const root = path.dirname(fileURLToPath(import.meta.url));
const publicPath = `${buildConfig.dir.replace(/\/$/, '')}/`;
const outputDirectory = path.resolve(root, `..${publicPath}`);
const iconDirectory = path.resolve(root, 'src/icons');

async function createSprite() {
  const files = (await fs.promises.readdir(iconDirectory))
    .filter(file => file.endsWith('.svg'))
    .sort();
  const symbols = await Promise.all(files.map(async file => {
    const source = await fs.promises.readFile(path.join(iconDirectory, file), 'utf8');
    const result = optimize(source, {
      path: file,
      multipass: true,
      plugins: ['preset-default', 'removeDimensions']
    }).data;
    const id = path.basename(file, '.svg');
    return result
      .replace(/<svg\b/, `<symbol id="${id}"`)
      .replace(/<\/svg>\s*$/, '</symbol>');
  }));
  return `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>`;
}

function svgSpritePlugin() {
  return {
    name: 'restyler-svg-sprite',
    configureServer(server) {
      server.middlewares.use('/spritemap.svg', async (_request, response) => {
        response.setHeader('Content-Type', 'image/svg+xml');
        response.end(await createSprite());
      });
    },
    async generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'spritemap.svg',
        source: await createSprite()
      });
    }
  };
}

function compatibilityEndpointsPlugin() {
  return {
    name: 'restyler-compatibility-endpoints',
    configureServer(server) {
      server.middlewares.use('/app.js', (_request, response) => {
        response.setHeader('Content-Type', 'text/javascript');
        response.end("import '/@vite/client'; import '/src/index.js';");
      });
      server.middlewares.use('/app.css', (_request, response) => {
        response.setHeader('Content-Type', 'text/css');
        response.end('');
      });
    }
  };
}

export default defineConfig(({command}) => ({
  base: command === 'build' ? publicPath : '/',
  publicDir: 'static',
  cacheDir: 'node_modules/.vite',
  define: {
    DIR: JSON.stringify(command === 'build' ? publicPath : '/'),
    PRODUCTION: JSON.stringify(command === 'build'),
    VERSION: JSON.stringify(packageJson.version)
  },
  plugins: [svgSpritePlugin(), compatibilityEndpointsPlugin()],
  server: {
    host: 'localhost',
    port: 8080,
    strictPort: false,
    cors: true,
    ...(fs.existsSync(path.resolve(root, '.cert/localhost.pem')) ? {
      https: {
        key: fs.readFileSync(path.resolve(root, '.cert/localhost-key.pem')),
        cert: fs.readFileSync(path.resolve(root, '.cert/localhost.pem'))
      }
    } : {})
  },
  build: {
    outDir: outputDirectory,
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    reportCompressedSize: false,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(root, 'src/index.js'),
      output: {
        entryFileNames: 'app.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: asset => asset.names?.some(name => name.endsWith('.css'))
          ? 'app.css'
          : 'assets/[name]-[hash][extname]'
      }
    }
  }
}));
