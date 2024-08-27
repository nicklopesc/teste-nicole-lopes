import React from "react";
import ReactDOMClient from "react-dom/client";

import "./index.css";
import { routes } from "./routers";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter(routes);

const root = ReactDOMClient.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
