import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
} from "@mui/material";
import {
  Equipment,
  EquipmentStateHistory,
  EquipmentState,
} from "../../map/models/map.model";
import ProductivityChart from "./ProductivityChart";

interface EquipmentDetailProps {
  equipment: Equipment;
  stateHistory: EquipmentStateHistory[];
  states: EquipmentState[];
  productivity: number;
}

export default function EquipmentDetail({
  equipment,
  stateHistory,
  states,
  productivity,
}: EquipmentDetailProps) {
  const [selectedState, setSelectedState] = useState<string>("");

  const handleStateChange = (event: SelectChangeEvent<string>) => {
    setSelectedState(event.target.value);
  };

  const filteredStates = stateHistory
    .find((history) => history.equipmentId === equipment.id)
    ?.states.filter((stateItem) =>
      selectedState ? stateItem.equipmentStateId === selectedState : true
    );

  return (
    <Card sx={{ backgroundColor: "#f0f0f0" }}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="h5">{equipment.name}</Typography>
            <Typography variant="subtitle1">Histórico de Estados:</Typography>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Filtrar por Estado</InputLabel>
              <Select
                value={selectedState}
                onChange={handleStateChange}
                label="Filtrar por Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                {states.map((state) => (
                  <MenuItem key={state.id} value={state.id}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <List sx={{ height: "150px", overflowY: "auto" }}>
              {filteredStates?.map((stateItem, index) => {
                const state = states.find(
                  (state) => state.id === stateItem.equipmentStateId
                );
                return (
                  <ListItem key={index}>
                    <ListItemText
                      primaryTypographyProps={{
                        sx: {
                          color: state?.color || "inherit",
                          fontWeight: "bold",
                        },
                      }}
                      primary={` ${state?.name}`}
                      secondary={`Data: ${new Date(
                        stateItem.date
                      ).toLocaleString()}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <ProductivityChart productivity={productivity} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
