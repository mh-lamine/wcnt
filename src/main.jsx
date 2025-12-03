import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { PersistLogin } from "@/features/auth/components/PersistLogin";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <PersistLogin>
        <App />
        <Toaster position="top-right" richColors />
      </PersistLogin>
    </BrowserRouter>
  </StrictMode>
);
