// src/components/DynamicTable.tsx
import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,

} from '@tanstack/react-table';
import type{
    ColumnFiltersState,
    SortingState,
    ColumnDef,
} from '@tanstack/react-table'
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';

interface DynamicTableProps {
  schema: any;                // JSON Schema модели
  data: any[];                // массив записей
  modelKey: string;           // 'users', 'products' и т.д.
  onRefresh: () => void;      // callback для перезагрузки данных после удаления/редактирования
  onEdit?: (item: any) => void; // опционально — если хочешь открывать форму редактирования
}

const DynamicTable: React.FC<DynamicTableProps> = ({
  schema,
  data,
  modelKey,
  onRefresh,
  onEdit,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Формируем колонки на основе свойств схемы
  const columns = useMemo<ColumnDef<any>[]>(
    () =>
      Object.entries(schema.properties || {}).map(([key, prop]: [string, any]) => {
        let header = prop.title || key;
        let cell: any = (info: any) => {
          const value = info.getValue();

          // Особая отрисовка для ссылок (показываем ID или имя, если есть)
          if (key.endsWith('_id') && typeof value === 'number') {
            return value;
          }

          // Для массивов (например tag_ids)
          if (Array.isArray(value)) {
            return value.join(', ');
          }

          // Для рейтинга (можно улучшить)
          if (prop['ui:widget'] === 'starRating' && typeof value === 'number') {
            return '★'.repeat(value) + '☆'.repeat(5 - value);
          }

          return value ?? '—';
        };

        return {
          accessorKey: key,
          header,
          cell: ({ getValue }: any) => cell({ getValue }),
          enableSorting: true,
          enableColumnFilter: true,
        };
      }),
    [schema]
  );

  // Добавляем колонку действий
  const actionColumn: ColumnDef<any> = {
    id: 'actions',
    header: 'Действия',
    cell: ({ row }) => (
      <div className="d-flex gap-2">
        {onEdit && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onEdit(row.original)}
          >
            ✎
          </Button>
        )}
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleDelete(row.original.id)}
        >
          🗑
        </Button>
      </div>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  };

  const table = useReactTable({
    data,
    columns: [...columns, actionColumn],
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleDelete = async (id: number | string) => {
    if (!window.confirm('Удалить запись?')) return;

    try {
      await axios.delete(
        `http://localhost:8000/models/${modelKey}/items/${id}`
      );
      onRefresh();
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Не удалось удалить запись');
    }
  };

  // Глобальный поиск (по всем колонкам)
  const globalFilterValue = columnFilters.find(f => f.id === 'global')?.value || '';

  return (
    <div>
      {/* Поле глобального поиска */}
      <Form.Group className="mb-3" style={{ maxWidth: 400 }}>
        <Form.Label>Поиск по таблице</Form.Label>
        <Form.Control
          type="text"
          placeholder="Введите текст для поиска..."
          value={globalFilterValue as string}
          onChange={e =>
            setColumnFilters(
              e.target.value
                ? [{ id: 'global', value: e.target.value }]
                : []
            )
          }
        />
      </Form.Group>

      <Table striped bordered hover responsive size="sm">
        <thead className="table-light">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} style={{ whiteSpace: 'nowrap' }}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' ↑',
                        desc: ' ↓',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={table.getAllColumns().length} className="text-center py-4">
                Нет данных
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <div className="text-muted small mt-2">
        Показано {table.getRowModel().rows.length} из {data.length} записей
      </div>
    </div>
  );
};

export default DynamicTable;