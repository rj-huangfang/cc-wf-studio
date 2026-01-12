/**
 * Claude Code Workflow Studio - Vite 配置
 *
 * Webview UI 的 Vite 构建配置
 * 基于: /specs/001-cc-wf-studio/plan.md
 */

import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    // 生成源映射用于调试
    sourcemap: true,
    // 目标现代浏览器（VSCode 使用 Electron）
    target: 'esnext',
    minify: 'esbuild',
    // 将块大小警告限制提高到 1000 kB（VSCode 扩展上下文）
    chunkSizeWarningLimit: 1000,
  },
  // 解析配置
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@shared': resolve(__dirname, '../shared'),
    },
  },
  // 开发服务器配置
  server: {
    port: 5173,
    strictPort: true,
  },
});
