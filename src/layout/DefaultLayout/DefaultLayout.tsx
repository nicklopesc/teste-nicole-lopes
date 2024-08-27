import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export function DefaultLayout() {
  return (
    <>
      <Box>
        <Outlet />
      </Box>
    </>
  );
}

export default DefaultLayout;
