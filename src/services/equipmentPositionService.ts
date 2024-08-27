import equipmentPositionHistoryData from "../../data/equipmentPositionHistory.json";

export interface Position {
  date: string;
  lat: number;
  lon: number;
}

export interface EquipmentPositionHistory {
  equipmentId: string;
  positions: Position[];
}

export const getEquipmentPositionHistory = async (): Promise<
  EquipmentPositionHistory[]
> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(equipmentPositionHistoryData), 1000);
  });
};
