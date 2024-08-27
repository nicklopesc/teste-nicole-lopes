import equipmentStateHistoryData from "../../data/equipmentStateHistory.json";

export interface EquipmentStateHistory {
  equipmentId: string;
  states: {
    date: string;
    equipmentStateId: string;
  }[];
}

export const getEquipmentStateHistory = async (): Promise<
  EquipmentStateHistory[]
> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(equipmentStateHistoryData), 1000);
  });
};
