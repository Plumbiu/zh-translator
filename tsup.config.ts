import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['lib/index.ts', 'lib/service_worker.ts'],
  splitting: true,
  format: 'esm',
  clean: true,
  bundle: true,
  minify: true,
  external: [/data/],
  noExternal: ['zh-translator'],
})
