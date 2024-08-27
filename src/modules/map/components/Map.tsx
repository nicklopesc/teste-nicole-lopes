import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const equipmentUrl = "/data/equipment.json";
const equipmentStateUrl = "/data/equipmentState.json";
const equipmentStateHistoryUrl = "/data/equipmentStateHistory.json";
const equipmentPositionHistoryUrl = "/data/equipmentPositionHistory.json";

const svgIconUrl = "src/modules/map/icons/map-pin.svg";

const customIcon = L.icon({
  iconUrl: svgIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: "",
});

interface Equipment {
  id: string;
  equipmentModelId: string;
  name: string;
}

interface EquipmentState {
  id: string;
  name: string;
  color: string;
}

interface EquipmentModel {
  id: string;
  name: string;
  hourlyEarnings: { equipmentStateId: string; value: number }[];
}

interface StateHistory {
  equipmentId: string;
  states: { date: string; equipmentStateId: string }[];
}

interface PositionHistory {
  equipmentId: string;
  positions: { date: string; lat: number; lon: number }[];
}

const Map: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [equipmentStates, setEquipmentStates] = useState<EquipmentState[]>([]);
  const [equipmentModels, setEquipmentModels] = useState<EquipmentModel[]>([]);
  const [stateHistories, setStateHistories] = useState<StateHistory[]>([]);
  const [positionHistories, setPositionHistories] = useState<PositionHistory[]>(
    []
  );

  useEffect(() => {
    // Função para carregar todos os dados
    const loadData = async () => {
      try {
        const equipmentResponse = await fetch(equipmentUrl);
        const equipmentData = await equipmentResponse.json();
        setEquipment(equipmentData);

        const equipmentStateResponse = await fetch(equipmentStateUrl);
        const equipmentStateData = await equipmentStateResponse.json();
        setEquipmentStates(equipmentStateData);

        const equipmentModelResponse = await fetch("/data/equipmentModel.json");
        const equipmentModelData = await equipmentModelResponse.json();
        setEquipmentModels(equipmentModelData);

        const stateHistoryResponse = await fetch(equipmentStateHistoryUrl);
        const stateHistoryData = await stateHistoryResponse.json();
        setStateHistories(stateHistoryData);

        const positionHistoryResponse = await fetch(
          equipmentPositionHistoryUrl
        );
        const positionHistoryData = await positionHistoryResponse.json();
        setPositionHistories(positionHistoryData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // Processar os dados para vincular estados e posições
  const getEquipmentState = (equipmentId: string, date: string) => {
    const stateHistory = stateHistories.find(
      (sh) => sh.equipmentId === equipmentId
    );
    if (stateHistory) {
      const stateEntry = stateHistory.states.find(
        (s) => new Date(s.date) <= new Date(date)
      );
      if (stateEntry) {
        return equipmentStates.find(
          (es) => es.id === stateEntry.equipmentStateId
        );
      }
    }
    return null;
  };

  const getPosition = (equipmentId: string) => {
    const positionHistory = positionHistories.find(
      (ph) => ph.equipmentId === equipmentId
    );
    if (positionHistory && positionHistory.positions.length > 0) {
      return positionHistory.positions[positionHistory.positions.length - 1];
    }
    return null;
  };

  return (
    <MapContainer
      center={[-19.126536, -45.947756]} // Ajuste o centro conforme necessário
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {equipment.map((equip) => {
        const latestPosition = getPosition(equip.id);
        const latestState = latestPosition
          ? getEquipmentState(equip.id, latestPosition.date)
          : null;

        if (!latestPosition) {
          console.warn(`No position found for equipmentId: ${equip.id}`);
          return null;
        }

        return (
          <Marker
            key={equip.id}
            position={[latestPosition.lat, latestPosition.lon]}
            icon={customIcon}
          >
            <Popup>
              <div>
                <h3>{equip.name}</h3>
                <p>
                  Estado:{" "}
                  {latestState ? latestState.name : "Estado não encontrado"}
                </p>
                <p>Data: {new Date(latestPosition.date).toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
