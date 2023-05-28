import useMediaQuery from '@mui/material/useMediaQuery';
import { MOBILE_WIDTH_BREAKPOINT } from '../constants';

export function useMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_WIDTH_BREAKPOINT})`);
}
