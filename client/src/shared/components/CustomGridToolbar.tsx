import Box from '@mui/material/Box';
import { GridToolbarContainer, GridToolbarFilterButton, GridToolbarExport } from '@mui/x-data-grid';
import { useMobile } from '../hooks/useMobile';

export function CustomGridToolbar(elements: React.ReactNode[]) {
  const isMobile = useMobile();

  return (
    <GridToolbarContainer sx={{
      minHeight: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
    }}>
      <Box>
        <GridToolbarFilterButton sx={{ fontSize: '1rem' }} />
        {!isMobile && <GridToolbarExport sx={{ fontSize: '1rem' }} />}
      </Box>
      {elements}
    </GridToolbarContainer>
  );
}
