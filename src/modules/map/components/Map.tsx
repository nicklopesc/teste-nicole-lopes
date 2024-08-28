import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Stack, Typography } from "@mui/material";
import { useEquipment } from "../../../contexts/EquipmentContext";

const svgIconUrl = "src/modules/map/icons/map-pin.svg";

const customIcon = L.icon({
  iconUrl: svgIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: "",
});

export default function Map() {
  const {
    equipments,
    states,
    stateHistory,
    positionHistories,
    loading,
    error,
  } = useEquipment();

  const getEquipmentState = (equipmentId: string, date: string) => {
    const stateHistoryEntry = stateHistory.find(
      (sh) => sh.equipmentId === equipmentId
    );
    if (stateHistoryEntry) {
      const stateEntry = stateHistoryEntry.states.find(
        (s) => new Date(s.date) <= new Date(date)
      );
      if (stateEntry) {
        return states.find((es) => es.id === stateEntry.equipmentStateId);
      }
    }
    return null;
  };

  const getLatestPosition = (equipmentId: string) => {
    console.log("Searching position for equipmentId:", equipmentId);
    const positionHistory = positionHistories.find(
      (ph) => ph.equipmentId === equipmentId
    );
    console.log("Found positionHistory:", positionHistory);
    if (positionHistory) {
      return positionHistory;
    }
    return null;
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

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
      {equipments.map((equip) => {
        const latestPosition = getLatestPosition(equip.id);

        const latestState = latestPosition
          ? getEquipmentState(equip.id, latestPosition.positions[0].date)
          : null;

        if (
          !latestPosition ||
          latestPosition.positions[0].lat === undefined ||
          latestPosition.positions[0].lon === undefined
        ) {
          console.warn(`Posição inválida para equipmentId: ${equip.id}`);
          return null;
        }

        return (
          <Marker
            key={equip.id}
            position={[
              latestPosition.positions[0].lat,
              latestPosition.positions[0].lon,
            ]}
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
                  Data/Hora:{" "}
                  {new Date(latestPosition.positions[0].date).toLocaleString()}
                </Typography>
              </Stack>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
