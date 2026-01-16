import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  // server: {
  //   host: '0.0.0.0',
  //   port: 3001,
  //   allowedHosts: ['sigif.dev'],
  //   hmr: {
  //     host: 'SIGIF.dev',
  //     port: 3001,
  //     protocol: 'ws'
  //   },
  //   cors: true,
  // },
})
