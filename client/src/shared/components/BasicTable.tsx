import { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

interface IBasicTable {
  headers: string[],
  rows: ReactNode[]
}

export function BasicTable({ headers, rows }: IBasicTable) {
  return (
    <TableContainer component={Paper}>
      <Table>
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
