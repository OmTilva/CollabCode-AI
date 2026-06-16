import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import router from "./app/router";

import { QueryProvider } from "./app/providers/query-provider";
import { ToastProvider } from "./app/providers/toast-provider";
import { ThemeProvider } from "./app/providers/theme-provider";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        <ToastProvider />
      </ThemeProvider>
    </QueryProvider>
  </React.StrictMode>,
);
