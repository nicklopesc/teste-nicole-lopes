import equipmentStateData from "../../data/equipmentState.json";

export interface EquipmentState {
  id: string;
  name: string;
  color: string;
}

export const getEquipmentState = async (): Promise<EquipmentState[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(equipmentStateData), 1000);
  });
};
