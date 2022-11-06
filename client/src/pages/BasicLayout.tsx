import { Grid, Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { SideMenu } from "../components/SideMenu"
import { StickyFooter } from "../components/StickyFooter"

export function Layout() {
  const [firstColumnWidth, setFirstColumnWidth] = useState(200);

  return (
    <Grid container columns={2} spacing={0}>
      <Grid
        item
        sx={{
          position: 'relative',
          width: `${firstColumnWidth}px`,
        }}
      >
        <SideMenu width={firstColumnWidth} setWidthHandler={setFirstColumnWidth}/>
      </Grid>
  
      <Grid 
        item 
        sx={{
          height: '100%',
          width: `calc(100% - ${firstColumnWidth}px)`,
        }}
        container
        direction="column"
        justifyContent="space-between"
        alignItems="stretch"
      >
        <Box sx={{
          p: 2,
        }}>
          <Outlet />
        </Box>
        <StickyFooter />
      </Grid>
    </Grid>
  );
}
