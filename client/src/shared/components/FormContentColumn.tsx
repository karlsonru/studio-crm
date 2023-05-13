import { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MODAL_FORM_WIDTH, MOBILE_WIDTH_BREAKPOINT } from '../constants';

export function FormContentColumn({ children }: { children: Array<ReactNode> }) {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_WIDTH_BREAKPOINT})`);
  return (
    <Stack
      py={1}
      direction='column'
      spacing={2}
      width={isMobile ? 'auto' : MODAL_FORM_WIDTH}
    >
      { children }
    </Stack>
  );
}
