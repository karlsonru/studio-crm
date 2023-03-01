import { GridToolbarContainer, GridToolbarFilterButton, GridToolbarExport } from '@mui/x-data-grid';

export function CustomGridToolbar() {
  return (
    <GridToolbarContainer sx={{ minHeight: '2rem' }}>
      <GridToolbarFilterButton sx={{ fontSize: '1rem' }} />
      <GridToolbarExport sx={{ fontSize: '1rem' }} />
    </GridToolbarContainer>
  );
}
