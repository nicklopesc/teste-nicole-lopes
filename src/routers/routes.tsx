import { RouteObject } from "react-router-dom";
import Login from "../pages/Login";
import DefaultLayout from "../layout/DefaultLayout/DefaultLayout";
import Home from "../pages/Home";
import { PathConstants } from "./pathConstants";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: PathConstants.PROJECT,
    element: <DefaultLayout />,
    children: [
      {
        path: PathConstants.HOME,
        element: <Home />,
      },
    ],
  },
];
