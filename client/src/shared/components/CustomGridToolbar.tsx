import Box from '@mui/material/Box';
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { useMobile } from '../hooks/useMobile';

export function CustomGridToolbar(elements: React.ReactNode[]) {
  const isMobile = useMobile();

  return (
    <GridToolbarContainer sx={{
      marginBottom: '1rem',
      minHeight: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
    }}>

      <Box>
        <GridToolbarQuickFilter placeholder="Поиск" size="small" variant="outlined" inputProps={{ sx: { height: '25.5px' } }}/>

        {!isMobile && <GridToolbarFilterButton componentsProps={{
          button: {
            size: 'large', variant: 'outlined',
          },
        }} />
        }

        {!isMobile && <GridToolbarExport size="large" variant="outlined" />}
      </Box>

      <Box>
        {elements.map((elem, idx) => <span key={idx}>{elem}</span>)}
      </Box>

    </GridToolbarContainer>
  );
}
