import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // listen to all connections, host name
    // https: {
    //   // see ../../../java-mono/tower/doc/https.md
    //   //key: fs.readFileSync('../../../java-mono/cert/key.pem'),
    //   //cert: fs.readFileSync('../../../java-mono/cert/cert.pem'),
    // }
  },
})
