import { ReactNode } from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MODAL_FORM_WIDTH, MOBILE_WIDTH_BREAKPOINT } from '../constants';

interface IFormContentColumn {
  children: Array<ReactNode> | ReactNode;
  props?: StackProps;
}

export function FormContentColumn({ children, props }: IFormContentColumn) {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_WIDTH_BREAKPOINT})`);
  return (
    <Stack
      py={1}
      direction='column'
      spacing={2}
      width={isMobile ? 'auto' : MODAL_FORM_WIDTH}
      {...props}
    >
      { children }
    </Stack>
  );
}
