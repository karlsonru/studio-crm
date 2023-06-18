import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

function isSerializedError(
  error: unknown,
): error is SerializedError {
  return (
    typeof error === 'object'
    && error !== null
    && 'name' in error
    && 'message' in error
    && 'stack' in error
    && 'code' in error
  );
}

function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

type DataWithMessage = {
  message: string;
};

function isDataWithMessage(
  data: unknown,
): data is DataWithMessage {
  return typeof data === 'object' && data !== null && 'message' in data;
}

export function getErrorMessage(
  details: FetchBaseQueryError | SerializedError | string | undefined,
) {
  if (isSerializedError(details)) {
    return JSON.stringify(details.message);
  }

  if (isFetchBaseQueryError(details)) {
    if (isDataWithMessage(details.data)) {
      return details.data?.message;
    }

    const data = JSON.stringify(details.data);
    return data;
  }

  return details;
}
