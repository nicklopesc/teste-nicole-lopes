import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  Equipment,
  EquipmentState,
  EquipmentStateHistory,
  EquipmentPosition,
  EquipmentModel,
  PositionHistory,
} from "../modules/map/models/map.model";

interface EquipmentContextProps {
  equipments: Equipment[];
  states: EquipmentState[];
  stateHistory: EquipmentStateHistory[];
  positionHistories: PositionHistory[];
  equipmentModels: EquipmentModel[];
  loading: boolean;
  error: string | null;
}

const EquipmentContext = createContext<EquipmentContextProps | undefined>(
  undefined
);

export const EquipmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [states, setStates] = useState<EquipmentState[]>([]);
  const [stateHistory, setStateHistory] = useState<EquipmentStateHistory[]>([]);
  const [positionHistories, setPositionHistories] = useState<PositionHistory[]>(
    []
  );
  const [equipmentModels, setEquipmentModels] = useState<EquipmentModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipmentResponse = await axios.get("/data/equipment.json");
        const statesResponse = await axios.get("/data/equipmentState.json");
        const stateHistoryResponse = await axios.get(
          "/data/equipmentStateHistory.json"
        );
        const positionHistoryResponse = await axios.get(
          "/data/equipmentPositionHistory.json"
        );
        const equipmentModelResponse = await axios.get(
          "/data/equipmentModel.json"
        );

        setEquipments(equipmentResponse.data);
        setStates(statesResponse.data);
        setStateHistory(stateHistoryResponse.data);
        setPositionHistories(positionHistoryResponse.data);
        setEquipmentModels(equipmentModelResponse.data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <EquipmentContext.Provider
      value={{
        equipments,
        states,
        stateHistory,
        positionHistories,
        equipmentModels,
        loading,
        error,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = (): EquipmentContextProps => {
  const context = useContext(EquipmentContext);
  if (context === undefined) {
    throw new Error("useEquipment must be used within an EquipmentProvider");
  }
  return context;
};
