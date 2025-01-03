import { ReactNode, useState } from 'react';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table, { TableProps } from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow, { TableRowProps } from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { PrimaryButton } from './buttons/PrimaryButton';

interface IBasicTable {
  headers: string[],
  rows: ReactNode[],
  props?: TableProps,
}

interface ICreateRow {
  content: Array<string | number | ReactNode>;
  props?: TableRowProps;
}

interface ICreateRowWithCollapse extends ICreateRow {
  contentCollapsed: Array<string | number | ReactNode>;
}

export function CreateRowWithCollapse({
  content, contentCollapsed, props,
}: ICreateRowWithCollapse) {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <TableRow hover {...props} onClick={() => setOpen(!isOpen)}>
          { content.map((item, idx) => <TableCell key={idx}>{item}</TableCell>) }
      </TableRow>
      <TableRow>
        <TableCell colSpan={content.length} sx={{ py: 0, textAlign: 'left' }}>
          <Collapse in={isOpen} timeout='auto' unmountOnExit>
            <List dense>
              { contentCollapsed.map((item, idx) => <ListItem key={idx}>{item}</ListItem>)}
            </List>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export function CreateRow({ content, props }: ICreateRow) {
  return (
    <TableRow hover {...props}>
      { content.map((item, idx) => <TableCell key={idx}>{item}</TableCell>) }
    </TableRow>
  );
}

export function BasicTable({ headers, rows, props }: IBasicTable) {
  return (
    <TableContainer component={Paper}>
      <Table {...props} >
        <TableHead>
          <TableRow>
            { headers.map((header) => <TableCell key={header}>{header}</TableCell>) }
          </TableRow>
        </TableHead>
        <TableBody>
          { rows }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

interface IBasicTableWithTitleAndButton extends IBasicTable {
  tableTitle: string;
  buttomTitle: string;
  buttomAction: () => void;
}

export function BasicTableWithTitleAndButton({
  tableTitle,
  headers,
  rows,
  buttomTitle,
  buttomAction,
}: IBasicTableWithTitleAndButton) {
  return (
    <>
      <Typography
        variant="h5"
        component={'h5'}
        my={1}
      >
        { tableTitle }
      </Typography>
      <BasicTable
        headers={headers}
        rows={rows}
      />
      <PrimaryButton
        content={buttomTitle}
        props={{
          onClick: buttomAction,
          sx: {
            marginY: '1rem',
          },
        }}
      />
    </>
  );
}
