const useDist = process.argv.includes('--dist');
const root = useDist ? 'dist' : '.';
const server = Bun.serve({
  port: Number(process.env.PORT ?? 5173),
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname === '/' ? '/index.html' : url.pathname;
    const file = Bun.file(`${root}${path}`);
    if (await file.exists()) return new Response(file);
    return new Response(Bun.file(`${root}/index.html`));
  },
});
console.log(`Cat Adventure running at http://localhost:${server.port}`);
