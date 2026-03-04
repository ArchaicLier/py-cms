import React from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Table, Button } from 'react-bootstrap';

interface Props {
  data: any[];
  schema: any;
  onSelect: (item: any) => void;
}

const RelatedTable: React.FC<Props> = ({ data, schema, onSelect }) => {
  console.log("GAVNO111", schema)
  const columns: ColumnDef<any>[] = React.useMemo(() => 
    Object.keys(schema.properties).map(key => ({
      accessorKey: key,
      header: schema.properties[key].title || key,
    })), [schema]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table striped bordered hover>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
            <th>Действия</th>
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
            <td>
              <Button variant="success" size="sm" onClick={() => onSelect(row.original)}>
                Выбрать
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default RelatedTable;