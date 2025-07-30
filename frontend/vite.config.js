import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
  __CONFIG__: {
    ENVIRONMENT: JSON.stringify(process.env.ENVIRONMENT),
    DEV_BASE_URL: JSON.stringify(process.env.DEV_BASE_URL),
    PROD_BASE_URL: JSON.stringify(process.env.PROD_BASE_URL),
    },
  },
 base: "/",
 plugins: [react()],
 preview: {
  port: 3000,
  strictPort: true,
 },
 server: {
  port: 3000,
  strictPort: true,
  host: true
 },
});
