import equipmentData from "../../data/equipment.json";

export interface Equipment {
  id: string;
  equipmentModelId: string;
  name: string;
}

export const getEquipmentData = async (): Promise<Equipment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(equipmentData), 1000);
  });
};
