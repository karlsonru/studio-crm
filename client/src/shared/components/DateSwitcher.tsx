import * as React from 'react';
import { useState } from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { BaseSingleInputFieldProps, FieldSection } from '@mui/x-date-pickers';

interface ButtonFieldProps extends BaseSingleInputFieldProps<Date | null, Date, FieldSection, any> {
  date?: Date;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  dateFormatter?: (date: Date | number) => string;
}

function ButtonField(props: ButtonFieldProps) {
  const {
    setOpen,
    date,
    dateFormatter,
    id,
    InputProps: { ref } = {},
  } = props;

  if (!date || !setOpen || !dateFormatter) return null;

  const content = dateFormatter(date);

  return (
    <Button
      variant="text"
      id={id}
      ref={ref}
      onClick={() => setOpen((prev) => !prev)}
    >
      { content }
    </Button>
  );
}

interface IDateSwitcher {
  date: Date,
  onChange: (value: number | Date | null) => void;
  onLeftArrowClick: () => void;
  onRightArrowClick: () => void;
  dateFormatter: (date: Date | number) => string;
  props?: DatePickerProps<Date>;
  wrapperProps?: StackProps,
}

export function DateSwitcher({
  date,
  onChange,
  onLeftArrowClick,
  onRightArrowClick,
  dateFormatter,
  props,
  wrapperProps,
}: IDateSwitcher) {
  const [open, setOpen] = useState(false);

  return (
    <Stack
      direction="row"
      {...wrapperProps}
    >

    <IconButton onClick={onLeftArrowClick}>
      <ArrowBackIosIcon />
    </IconButton>

    <DatePicker
      value={date}
      onChange={onChange}
      views={['day']}
      minDate={new Date(2020, 0, 1)}
      slots={{ field: ButtonField }}
      slotProps={{ field: { setOpen, date, dateFormatter } as ButtonFieldProps }}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      {...props}
    />

    <IconButton onClick={onRightArrowClick}>
      <ArrowForwardIosIcon />
    </IconButton>

  </Stack>
  );
}
