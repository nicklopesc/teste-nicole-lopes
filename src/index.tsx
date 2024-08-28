import React from "react";
import ReactDOMClient from "react-dom/client";

import "./index.css";
import { routes } from "./routers";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { EquipmentProvider } from "./contexts/EquipmentContext";

const router = createBrowserRouter(routes);

const root = ReactDOMClient.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <EquipmentProvider>
      <RouterProvider router={router} />
    </EquipmentProvider>
  </React.StrictMode>
);
