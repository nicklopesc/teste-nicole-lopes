import { RouteObject } from "react-router-dom";
import Login from "../pages/Login";
import DefaultLayout from "../layout/DefaultLayout/DefaultLayout";

import { PathConstants } from "./pathConstants";
import Map from "../modules/map/components/Map";
import EquipmentList from "../modules/historic/components/EquipmentList";
import HistoricEquipament from "../pages/HistoricEquipament";

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
        element: <Map />,
      },
      {
        path: PathConstants.HISTORICEQUIPMENT,
        element: <HistoricEquipament />,
      },
    ],
  },
];
