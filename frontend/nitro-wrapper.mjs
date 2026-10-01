import { createServer } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, '.output', 'public');

// Importa o handler SSR do Nitro
let ssrHandler;
try {
  ssrHandler = (await import('./.output/server/_ssr/index.mjs')).default;
  console.log('✅ Nitro SSR handler carregado');
} catch (err) {
  console.warn('⚠️ SSR handler não disponível:', err.message);
}

// Cria um servidor HTTP que serve arquivos estáticos + Nitro SSR
const server = createServer(async (req, res) => {
  // Serve arquivos estáticos (assets, css, etc)
  if (req.url?.startsWith('/assets/') || req.url?.startsWith('/_headers')) {
    const filePath = path.join(publicPath, req.url);
    
    // Segurança: evita path traversal
    if (!filePath.startsWith(publicPath)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    
    if (existsSync(filePath)) {
      try {
        const content = readFileSync(filePath);
        const ext = path.extname(filePath);
        const contentTypeMap = {
          '.js': 'application/javascript; charset=utf-8',
          '.css': 'text/css; charset=utf-8',
          '.svg': 'image/svg+xml',
          '.json': 'application/json',
        };
        const contentType = contentTypeMap[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
        return;
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }
    
    res.writeHead(404);
    res.end('Not Found');
    return;
  }
  
  // Proxies reversos - ANTES de ler o body
  const cameraRoutes = [
    '/api/config', 
    '/api/devices', 
    '/api/capture', 
    '/api/records', 
    '/api/veiculos_autorizados', 
    '/api/auth'
  ];
  
  if (cameraRoutes.some(route => req.url?.startsWith(route))) {
    const proxy = createProxyMiddleware({
      target: 'http://ms_camera:8000',
      changeOrigin: true,
    });
    return proxy(req, res, () => {});
  }
  
  if (req.url?.startsWith('/api/arduino')) {
    const proxy = createProxyMiddleware({
      target: 'http://ms_arduino:8000',
      changeOrigin: true,
    });
    return proxy(req, res, () => {});
  }
  
  if (req.url?.startsWith('/api/liberar_passagem')) {
    const proxy = createProxyMiddleware({
      target: 'http://ms_arduino:8000',
      changeOrigin: true,
      pathRewrite: { '^/api/liberar_passagem': '/api/arduino/command' },
      onProxyReq: (proxyReq, req, res) => {
        const bodyData = JSON.stringify({ action: "open" });
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    });
    return proxy(req, res, () => {});
  }
  
  if (req.url?.startsWith('/api/sync')) {
    const proxy = createProxyMiddleware({
      target: 'http://ms_syncer:8000',
      changeOrigin: true,
    });
    return proxy(req, res, () => {});
  }
  
  if (req.url === '/api/services/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const services = [
      { name: 'ms_camera', status: 'checking' },
      { name: 'ms_arduino', status: 'checking' },
      { name: 'ms_syncer', status: 'checking' }
    ];
    res.end(JSON.stringify({ services }));
    return;
  }
  
  // Tudo mais vai para o Nitro SSR
  if (ssrHandler?.fetch) {
    try {
      const proto = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers.host || 'localhost:3000';
      const url = new URL(`${proto}://${host}${req.url}`);
      
      const request = new Request(url, {
        method: req.method,
        headers: req.headers,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : await readBody(req)
      });
      
      const response = await ssrHandler.fetch(request);
      res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
      res.end(await response.text());
    } catch (err) {
      console.error('SSR Error:', err.message);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  } else {
    res.writeHead(500);
    res.end('SSR not available');
  }
});

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Nitro SSR + Proxies + Static Files rodando em http://localhost:${PORT}`);
  console.log(`📂 Servindo arquivos estáticos de: ${publicPath}`);
});
