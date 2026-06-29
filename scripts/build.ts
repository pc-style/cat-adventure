import { mkdir, cp, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist/src', { recursive: true });
await Promise.all([
  cp('index.html', 'dist/index.html'),
  cp('src', 'dist/src', { recursive: true }),
]);
console.log('Built static site to dist/');
