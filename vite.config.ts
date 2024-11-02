import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
 /*  server: {
    host: '0.0.0.0', // Permite conexiones desde cualquier dirección IP
    port: 5173, // Asegúrate de que el puerto sea el correcto
  }, */
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
