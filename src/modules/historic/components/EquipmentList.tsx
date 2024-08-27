import { List, ListItemButton, ListItemText } from "@mui/material";
import { Equipment } from "../../map/models/map.model";

interface EquipmentListProps {
  equipments: Equipment[];
  onSelect: (equipmentId: string) => void;
}

export default function EquipmentList({
  equipments,
  onSelect,
}: EquipmentListProps) {
  return (
    <List>
      {equipments.map((equipment) => (
        <ListItemButton
          key={equipment.id}
          onClick={() => onSelect(equipment.id)}
        >
          <ListItemText primary={equipment.name} />
        </ListItemButton>
      ))}
    </List>
  );
}
