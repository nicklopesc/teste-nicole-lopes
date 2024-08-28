import { useState } from "react";
import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Box,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, Outlet, useLocation } from "react-router-dom";
import { PathConstants } from "../../routers";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

export function DefaultLayout() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const getItemStyle = (path: string) => ({
    color: location.pathname === path ? "#D9D9D9" : "inherit",
  });

  return (
    <Stack sx={{ display: "flex", height: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundImage: "linear-gradient(to bottom, #00796b, #00796b )",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            fontWeight="bold"
            noWrap
            component="div"
            sx={{ flexGrow: 1, color: "#000" }}
          >
            EquipmentMap
          </Typography>
          <IconButton
            aria-label="logout"
            component={Link}
            to={PathConstants.SAIR}
          >
            <LogoutIcon sx={{ color: "#000" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundImage:
              "linear-gradient(to bottom, #00796b, #00796b, #004d40, #000)",
          },
        }}
        variant="permanent"
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
      >
        <Toolbar />

        <List sx={{ marginTop: "10px" }}>
          <ListItemButton
            component={Link}
            to={PathConstants.MAP}
            onClick={handleDrawerToggle}
            sx={getItemStyle(PathConstants.MAP)}
          >
            <ListItemText primary="Mapa de Equipamentos" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to={PathConstants.HISTORICEQUIPMENT}
            onClick={handleDrawerToggle}
            sx={getItemStyle(PathConstants.HISTORICEQUIPMENT)}
          >
            <ListItemText primary="Histórico de Equipamentos" />
          </ListItemButton>
        </List>
        <Toolbar />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          ml: open ? `${drawerWidth}px` : 30,
          transition: "margin 0.3s",
          mt: 8,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Stack>
  );
}

export default DefaultLayout;
