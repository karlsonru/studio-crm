import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { Stack } from '@mui/system';
import { MODAL_FORM_WIDTH } from '../constants';

function isSerializedError(
  error: unknown,
): error is SerializedError {
  return (
    typeof error === 'object'
    && error != null
    && 'name' in error
    && 'message' in error
    && 'stack' in error
    && 'code' in error
  );
}

function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

function getErrorMsg(details: FetchBaseQueryError | SerializedError | string | undefined) {
  if (isFetchBaseQueryError(details)) {
    return JSON.stringify(details.data);
  }

  if (isSerializedError(details)) {
    return JSON.stringify(details.message);
  }

  return details;
}

interface IShowError {
  details?: FetchBaseQueryError | string | SerializedError;
}

export function ShowError({ details }: IShowError) {
  const message = getErrorMsg(details);

  return (
    <Stack
      alignItems='center'
      gap={1}
      height='100%'
      padding='1rem'
    >
      <Accordion sx={{ maxWidth: MODAL_FORM_WIDTH }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant='h5'
            color='error'
            paddingX={1}
          >
            Что-то пошло не так :(
            <br />
            Попробуйте позднее.
          </Typography>
        </AccordionSummary>
        {message && <AccordionDetails>
          <Typography>
            { message }
          </Typography>
        </AccordionDetails>
        }
      </Accordion>
    </Stack>
  );
}
