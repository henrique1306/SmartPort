import { createProxyMiddleware } from 'http-proxy-middleware';

export default defineEventHandler(async (event) => {
  const target = event.node.req.url;
  
  // Mapeamento para ms_camera
  const cameraRoutes = [
    '/api/config', 
    '/api/devices', 
    '/api/capture', 
    '/api/records', 
    '/api/veiculos_autorizados', 
    '/api/auth'
  ];
  
  if (cameraRoutes.some(route => target?.startsWith(route))) {
    return proxyRequest(event, 'http://ms_camera:8000');
  }
  
  if (target?.startsWith('/api/arduino')) {
    return proxyRequest(event, 'http://ms_arduino:8000');
  }
  
  if (target?.startsWith('/api/liberar_passagem')) {
    const req = event.node.req;
    req.url = target.replace(/^\/api\/liberar_passagem/, '/api/arduino/command');
    // Injeta payload
    req.body = { action: "open" };
    return proxyRequest(event, 'http://ms_arduino:8000');
  }
  
  if (target?.startsWith('/api/sync')) {
    return proxyRequest(event, 'http://ms_syncer:8000');
  }
  
  if (target === '/api/services/status') {
    return {
      services: [
        { name: 'ms_camera', status: 'checking' },
        { name: 'ms_arduino', status: 'checking' },
        { name: 'ms_syncer', status: 'checking' }
      ]
    };
  }
});
