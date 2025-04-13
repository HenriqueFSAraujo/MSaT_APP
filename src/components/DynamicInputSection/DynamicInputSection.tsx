import { useFormContext, useFieldArray, FieldError } from 'react-hook-form';
import { Plus, Trash, Info } from 'lucide-react';
import autoAnimate from '@formkit/auto-animate';
import { AnimatedIconButton } from "../common/AnimatedIconButton/AnimatedIconButton";
import { useRef, useEffect } from 'react';

type DynamicInputSectionProps = {
  title?: string;
  info?: string;
  columns: string[];
  fieldNames: string[];
  namePrefix: string;
};

export const DynamicInputSection = ({
  title,
  info,
  columns,
  fieldNames,
  namePrefix,
}: DynamicInputSectionProps) => {
  const {
    control,
    register,
    formState: { errors }
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: namePrefix,
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current);
    }
  }, []);

  const handleAddRow = () => append(
    fieldNames.reduce((acc, field) => ({ ...acc, [field]: null }), {}
    )
  )

  const handleRemoveRow = (index: number) => remove(index);

  const gridColsClass = `grid-cols-${columns.length}`;

  return (
    <div className="max-w-[950px] space-y-4">
      <div className='flex gap-2 items-center'>
        {title && <h3 className="font-semibold text-md text-muted-foreground">{title}</h3>}
        {info && <div title={info}> <Info size={18} className='text-yellow-800 cursor-pointer' /></div>}
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200">
        {/* Cabeçalho */}
        <div className={`grid ${gridColsClass} gap-4 bg-blue-400 text-white font-medium text-sm px-1 py-1 max-w-[950px] rounded-t-lg`}>
          {columns.map((col, idx) => (
            <div
              key={idx}
              className="font-bold text-white truncate bg-blue-400 p-2 rounded-t-md text-sm"
              title={col} // mostra o texto completo no hover
            >
              {col}
            </div>
          ))}
        </div>

        {/* Linhas */}
        <div ref={parentRef} className="max-w-[950px] divide-y ">
          {fields.map((field, rowIdx) => (
            <div key={field.id} className={`grid ${gridColsClass} gap-4`}>
              {fieldNames.map((fieldName, colIdx) => {
                const fieldError = (errors[namePrefix] as Record<number, Record<string, FieldError>> | undefined)?.[rowIdx]?.[fieldName];
                return (
                  <div key={`${field.id}-${fieldName}`} >
                    <input
                      {...register(`${namePrefix}.${rowIdx}.${fieldName}` as const)}
                      placeholder={columns[colIdx]}
                      className={`
                          m-1 p-2 border border-gray-300 w-full bg-transparent text-muted-foreground
                          placeholder-muted-foreground rounded-lg
                          ${fieldError ? 'text-red-500' : ''}
                        `}
                    />
                    {fieldError && (
                      <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                        {fieldError.message}
                      </p>
                    )}
                  </div>
                );
              })}

              {rowIdx === fields.length - 1 && (
                <div className="flex gap-2 items-center">
                  <AnimatedIconButton
                    onClick={handleAddRow}
                    className="p-1 text-gray-600 rounded-full hover:bg-gray-200 transition"
                    textDialog="Adicionar linha"
                  >
                    <Plus size={20} />
                  </AnimatedIconButton>

                  {fields.length > 1 && (
                    <AnimatedIconButton
                      onClick={() => handleRemoveRow(fields.length - 1)}
                      className="p-1 text-gray-600 rounded-full hover:bg-gray-200 transition"
                      textDialog="Remover linha"
                    >
                      <Trash size={19} />
                    </AnimatedIconButton>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
