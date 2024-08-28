import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Stack, Typography } from "@mui/material";

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

export default function Map() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [equipmentStates, setEquipmentStates] = useState<EquipmentState[]>([]);
  const [equipmentModels, setEquipmentModels] = useState<EquipmentModel[]>([]);
  const [stateHistories, setStateHistories] = useState<StateHistory[]>([]);
  const [positionHistories, setPositionHistories] = useState<PositionHistory[]>(
    []
  );

  useEffect(() => {
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
      center={[-19.126536, -45.947756]}
      zoom={13}
      style={{ height: "85vh", width: "100%" }}
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
              <Stack>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ marginBottom: "-50px" }}
                >
                  {equip.name}
                </Typography>
                <Typography variant="caption">
                  Estado:{" "}
                  {latestState ? latestState.name : "Estado não encontrado"}
                </Typography>
                <Typography variant="caption">
                  Data/Hora: {new Date(latestPosition.date).toLocaleString()}
                </Typography>
              </Stack>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
