import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3000;

// ==========================================
// PROXIES REVERSOS (http-proxy-middleware)
// ==========================================

// Mapeamento para ms_camera
const cameraRoutes = [
    '/api/config', 
    '/api/devices', 
    '/api/capture', 
    '/api/records', 
    '/api/veiculos_autorizados', 
    '/api/auth'
];
app.use(cameraRoutes, createProxyMiddleware({
    target: 'http://ms_camera:8000',
    changeOrigin: true,
}));

// Mapeamento direto para ms_arduino
app.use('/api/arduino', createProxyMiddleware({
    target: 'http://ms_arduino:8000',
    changeOrigin: true,
}));

// Proxy especial com pathRewrite e injeção de Body para liberar passagem
app.use('/api/liberar_passagem', createProxyMiddleware({
    target: 'http://ms_arduino:8000',
    changeOrigin: true,
    pathRewrite: { '^/api/liberar_passagem': '/api/arduino/command' },
    onProxyReq: (proxyReq, req, res) => {
        // Injeta forçadamente o payload de abertura da cancela
        const bodyData = JSON.stringify({ action: "open" });
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
}));

// Mapeamento para ms_syncer
app.use('/api/sync', createProxyMiddleware({
    target: 'http://ms_syncer:8000',
    changeOrigin: true,
}));

// ==========================================
// ROTA DE AGREGAÇÃO: STATUS DOS SERVIÇOS
// ==========================================
app.get('/api/services/status', async (req, res) => {
    const services = [
        { name: 'ms_camera', url: 'http://ms_camera:8000/health' },
        { name: 'ms_arduino', url: 'http://ms_arduino:8000/health' },
        { name: 'ms_syncer', url: 'http://ms_syncer:8000/health' }
    ];

    const results = await Promise.allSettled(
        services.map(s => axios.get(s.url, { timeout: 3000 })
            .then(response => ({ name: s.name, status: 'up', data: response.data })))
    );

    const status = results.map((result, index) => {
        if (result.status === 'fulfilled') return result.value;
        return { name: services[index].name, status: 'down', error: result.reason.message };
    });

    res.json({ services: status });
});

// ==========================================
// WEBSOCKETS (Socket.io)
// ==========================================
io.on('connection', (socket) => {
    console.log(`[WebSocket] Cliente conectado: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`[WebSocket] Cliente desconectado: ${socket.id}`);
    });
});

// ==========================================
// SERVIDOR DE ARQUIVOS ESTÁTICOS + NITRO SSR
// ==========================================
const publicPath = path.join(__dirname, '.output', 'public');
app.use(express.static(publicPath));

// Detectar dinamicamente o arquivo index com hash
let indexFilePath = '/assets/index.js';
try {
    const assetsDir = path.join(publicPath, 'assets');
    const files = readdirSync(assetsDir);
    const indexFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
    if (indexFile) {
        indexFilePath = `/assets/${indexFile}`;
        console.log(`✅ Arquivo index detectado: ${indexFilePath}`);
    }
} catch (err) {
    console.warn('⚠️ Erro ao detectar arquivo index:', err.message);
}

// ==========================================
// FALLBACK PARA SPA (HTML genérico)
// ==========================================
// Simples fallback: deixa o React/TanStack hidratar no cliente
app.get('*', (req, res) => {
    res.type('text/html').send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SmartPort Dashboard</title>
    <link rel="preload" href="${indexFilePath}" as="script" type="module" />
</head>
<body>
    <div id="app"></div>
    <script type="module" src="${indexFilePath}"></script>
</body>
</html>
    `);
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================
server.listen(PORT, () => {
    console.log(`🚀 Gateway Node.js rodando na porta ${PORT}`);
    console.log(`📂 Servindo assets estáticos a partir de: ${publicPath}`);
});
