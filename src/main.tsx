import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import { ThemeProvider } from "@/components/theme-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="transporte-app-theme" >
      <RouterProvider router={routes}></RouterProvider>
    </ThemeProvider>
  </StrictMode>
);
