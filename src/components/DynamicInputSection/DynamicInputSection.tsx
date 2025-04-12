import { useState } from 'react';

type DynamicInputSectionProps = {
  title: string;
  columns: string[];
  initialRows?: number;
};

export const DynamicInputSection = ({
  title,
  columns,
  initialRows = 1,
}: DynamicInputSectionProps) => {
  const [rows, setRows] = useState<number>(initialRows);

  const handleAddRow = () => {
    setRows((prev) => prev + 1);
  };

  const handleRemoveRow = () => {
    if (rows > 1) {
      setRows((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded border space-y-4">
      <h3 className="font-semibold">{title}</h3>

      {/* Cabeçalhos */}
      <div className={`grid grid-cols-${columns.length} gap-2`}>
        {columns.map((col, idx) => (
          <div
            key={idx}
            className="bg-blue-600 text-white font-medium text-sm text-center py-2 rounded"
          >
            {col}
          </div>
        ))}
      </div>

      {/* Linhas de inputs */}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className={`grid grid-cols-${columns.length} gap-2`}>
            {columns.map((col, colIdx) => (
              <input
                key={colIdx}
                type="text"
                placeholder={col}
                className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>
        ))}
      </div>

      {/* Botões de ação */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleAddRow}
          className="px-4 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          + Adicionar
        </button>
        <button
          type="button"
          onClick={handleRemoveRow}
          className="px-4 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
          disabled={rows <= 1}
        >
          − Remover Última
        </button>
      </div>
    </div>
  );
};
