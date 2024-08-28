import { RouteObject } from "react-router-dom";
import Login from "../pages/Login";
import DefaultLayout from "../layout/DefaultLayout/DefaultLayout";
import { PathConstants } from "./pathConstants";
import HistoricEquipament from "../pages/HistoricEquipament";
import MapPage from "../pages/MapPage";

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
        path: PathConstants.MAP,
        element: <MapPage />,
      },
      {
        path: PathConstants.HISTORICEQUIPMENT,
        element: <HistoricEquipament />,
      },
    ],
  },
];
