import { useState, useMemo } from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Box,
  Paper,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EquipmentDetail from "../modules/historic/components/EquipmentDetail";

import equipmentsData from "../../data/equipment.json";
import equipmentModelsData from "../../data/equipmentModel.json";
import equipmentStatesData from "../../data/equipmentState.json";
import stateHistoryData from "../../data/equipmentStateHistory.json";
import React from "react";

export default function HistoricEquipament() {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState] = useState("");
  const [filterModel, setFilterModel] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterModel = (event: SelectChangeEvent<string>) => {
    setFilterModel(event.target.value);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredEquipments = useMemo(() => {
    return equipmentsData.filter((equipment) => {
      const equipmentModel = equipmentModelsData.find(
        (model) => model.id === equipment.equipmentModelId
      );
      const state = equipmentStatesData.find(
        (state) => state.id === filterState
      );

      return (
        equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterModel ? equipmentModel?.id === filterModel : true) &&
        (filterState
          ? stateHistoryData.some(
              (history) =>
                history.equipmentId === equipment.id &&
                history.states.some((s) => s.equipmentStateId === filterState)
            )
          : true)
      );
    });
  }, [searchTerm, filterModel, filterState]);

  const handleRowClick = (equipmentId: string) => {
    setSelectedEquipmentId(
      selectedEquipmentId === equipmentId ? null : equipmentId
    );
  };

  const selectedEquipment = filteredEquipments.find(
    (e) => e.id === selectedEquipmentId
  );

  const calculateProductivity = (equipmentId: string) => {
    const equipmentHistory = stateHistoryData.find(
      (history) => history.equipmentId === equipmentId
    );

    if (!equipmentHistory) return 0;

    const totalHours = 24;
    const productiveHours = equipmentHistory.states.reduce((sum, state) => {
      const stateDetail = equipmentStatesData.find(
        (s) => s.id === state.equipmentStateId
      );
      if (stateDetail?.name === "Operando") {
        return sum + (1 / equipmentHistory.states.length) * totalHours;
      }
      return sum;
    }, 0);

    return (productiveHours / totalHours) * 100;
  };

  return (
    <Box sx={{ padding: "16px" }}>
      <Box sx={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <TextField
          label="Pesquisar Equipamento"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flex: 1 }}
        />

        <FormControl variant="outlined" sx={{ flex: 1 }}>
          <InputLabel>Filtrar por Modelo</InputLabel>
          <Select
            value={filterModel}
            onChange={handleFilterModel}
            label="Filtrar por Modelo"
          >
            <MenuItem value="">Todos</MenuItem>
            {equipmentModelsData.map((model) => (
              <MenuItem key={model.id} value={model.id}>
                {model.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredEquipments.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          Nenhum equipamento encontrado.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#00796b" }}>
                <TableRow>
                  <TableCell>Nome do Equipamento</TableCell>
                  <TableCell>Modelo</TableCell>
                  <TableCell>Estado Atual</TableCell>
                  <TableCell>Detalhes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEquipments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((equipment) => {
                    const equipmentModel = equipmentModelsData.find(
                      (model) => model.id === equipment.equipmentModelId
                    );
                    const currentState = stateHistoryData.find(
                      (history) =>
                        history.equipmentId === equipment.id &&
                        history.states.length > 0
                    )?.states[0];
                    const state = currentState
                      ? equipmentStatesData.find(
                          (state) => state.id === currentState.equipmentStateId
                        )
                      : null;

                    const isExpanded = selectedEquipmentId === equipment.id;

                    return (
                      <React.Fragment key={equipment.id}>
                        <TableRow
                          onClick={() => handleRowClick(equipment.id)}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell>{equipment.name}</TableCell>
                          <TableCell>{equipmentModel?.name}</TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                color: state?.color || "text.secondary",
                              }}
                            >
                              {state?.name || "Desconhecido"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton>
                              {isExpanded ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} sx={{ padding: 0 }}>
                            <Collapse
                              in={isExpanded}
                              timeout="auto"
                              unmountOnExit
                            >
                              {selectedEquipment && (
                                <EquipmentDetail
                                  equipment={selectedEquipment}
                                  stateHistory={stateHistoryData}
                                  states={equipmentStatesData}
                                  productivity={calculateProductivity(
                                    selectedEquipment.id
                                  )}
                                />
                              )}
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredEquipments.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}
