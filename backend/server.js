const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const getData = () => {
  const filePath = path.join(__dirname, 'questions.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const urlParts = req.url.split('/').filter(Boolean);

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

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Route not found' }));

  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});

