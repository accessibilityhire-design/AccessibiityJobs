import { Check, X } from 'lucide-react';

export interface ComparisonColumn {
  name: string;
  highlight?: boolean;
}

export interface ComparisonRow {
  feature: string;
  values: (string | boolean)[];
}

interface ComparisonTableProps {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
}

export function ComparisonTable({ columns, rows }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-gray-50 px-4 py-3 text-left font-semibold text-gray-900">
              Feature
            </th>
            {columns.map((column) => (
              <th
                key={column.name}
                className={`border border-gray-300 px-4 py-3 text-left font-semibold ${
                  column.highlight
                    ? 'bg-blue-50 text-blue-900'
                    : 'bg-gray-50 text-gray-900'
                }`}
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                {row.feature}
              </td>
              {row.values.map((value, colIndex) => (
                <td
                  key={colIndex}
                  className={`border border-gray-300 px-4 py-3 ${
                    columns[colIndex].highlight ? 'bg-blue-50/50' : ''
                  }`}
                >
                  {typeof value === 'boolean' ? (
                    value ? (
                      <Check className="h-5 w-5 text-green-600" aria-label="Yes" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" aria-label="No" />
                    )
                  ) : (
                    <span className="text-gray-700">{value}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

