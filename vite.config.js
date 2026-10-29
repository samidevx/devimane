import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
  },
  plugins: [
    {
      name: 'save-products-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method === 'POST' && req.url === '/api/save-products') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body);
                const filePath = path.resolve(__dirname, 'src/data/products.json');
                fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf8');

                // Auto Git Add, Commit & Push to GitHub
                exec(
                  'git add src/data/products.json && git commit -m "Auto-update products.json from Admin Panel" && git push origin main',
                  { cwd: __dirname },
                  (gitErr, stdout, stderr) => {
                    const gitSuccess = !gitErr;
                    if (gitErr) {
                      console.warn('⚠️ Git push warning/error:', gitErr.message);
                    } else {
                      console.log('🚀 Successfully committed & pushed products.json to GitHub main branch!');
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                      success: true,
                      count: parsed.length,
                      gitPushed: gitSuccess,
                      gitOutput: stdout || stderr || (gitErr ? gitErr.message : 'OK')
                    }));
                  }
                );
              } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
          next();
        });
      }
    }
  ],
});
