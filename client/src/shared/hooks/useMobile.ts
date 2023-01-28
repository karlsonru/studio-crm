import useMediaQuery from '@mui/material/useMediaQuery';

export function useMobile() {
  return useMediaQuery('(max-width: 767px)');
}
