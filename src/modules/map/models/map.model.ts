export interface Equipment {
  id: string;
  name: string;
  equipmentModelId: string;
}

export interface EquipmentState {
  id: string;
  name: string;
  color: string;
}

export interface EquipmentPosition {
  equipmentId: string;
  lat: number;
  lon: number;
  date: string;
  stateId: string;
  equipmentName: string;
}

export interface EquipmentStateHistory {
  equipmentId: string;
  states: {
    date: string;
    equipmentStateId: string;
  }[];
}

export interface EquipmentModel {
  id: string;
  name: string;
  hourlyEarnings: {
    equipmentStateId: string;
    value: number;
  }[];
}

export interface PositionHistory {
  equipmentId: string;
  positions: EquipmentPosition[];
}
