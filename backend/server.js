const http = require('http');
const fs = require('fs');
const path = require('path');

// Render usa PORT dinâmica
const PORT = process.env.PORT || 3000;

// Caminhos
const frontendPath = path.join(__dirname, '../frontend');
const dataPath = path.join(__dirname, 'questions.json');

// ======================
// Utils
// ======================
const getData = () => {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
};

const getContentType = (ext) => {
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };
  return types[ext] || 'text/plain';
};

// ======================
// Server
// ======================
const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const urlParts = req.url.split('/').filter(Boolean);

  // ======================
  // FRONTEND
  // ======================

  // Home → index.html
  if (req.method === 'GET' && req.url === '/') {
    const filePath = path.join(frontendPath, 'index.html');
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(content);
  }

  // Arquivos estáticos (css, js, imagens)
  const filePath = path.join(frontendPath, req.url);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const contentType = getContentType(ext);
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    return res.end(content);
  }

  // ======================
  // API
  // ======================
  try {
    const data = getData();

    // GET /modules
    if (req.method === 'GET' && urlParts[0] === 'modules' && urlParts.length === 1) {
      const modules = data.modules.map(m => ({
        id: m.id,
        name: m.name,
        level: m.level
      }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(modules));
    }

    // GET /modules/:moduleId
    if (req.method === 'GET' && urlParts[0] === 'modules' && urlParts.length === 2) {
      const moduleId = Number(urlParts[1]);
      const module = data.modules.find(m => m.id === moduleId);

      if (!module) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: 'Module not found' }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(module));
    }

    // GET /modules/:moduleId/lessons/:lessonId
    if (
      req.method === 'GET' &&
      urlParts[0] === 'modules' &&
      urlParts[2] === 'lessons' &&
      urlParts.length === 4
    ) {
      const moduleId = Number(urlParts[1]);
      const lessonId = Number(urlParts[3]);

      const module = data.modules.find(m => m.id === moduleId);
      if (!module) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: 'Module not found' }));
      }

      const lesson = module.lessons.find(l => l.lesson === lessonId);
      if (!lesson) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: 'Lesson not found' }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(lesson));
    }

    // Fallback
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Route not found' }));

  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Server error' }));
  }
});

// ======================
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

