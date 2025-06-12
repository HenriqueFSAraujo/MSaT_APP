import { useFormContext, useFieldArray, FieldError } from 'react-hook-form';
import { Plus, Trash, Info } from 'lucide-react';
import autoAnimate from '@formkit/auto-animate';
import { AnimatedIconButton } from '../AnimatedIconButton/AnimatedIconButton';
import { useRef, useEffect } from 'react';
import { DialogAction } from '../DialogAction/DialogAction';
import { TooltipAction } from '../TooltipAction/TooltipAction';

type DynamicInputSectionProps = {
  title?: string;
  info?: string;
  columns: string[];
  fieldNames: string[];
  namePrefix: string;
  required: boolean;
};

export const DynamicInputSection = ({
  title = '',
  info = '',
  columns = [],
  fieldNames = [],
  namePrefix = '',
  required = false,
}: DynamicInputSectionProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: namePrefix,
  });

  const parentRef = useRef<HTMLDivElement>(null);
  // const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current);
    }
  }, []);

  const handleAddRow = () =>
    append(fieldNames.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));

  const handleRemoveRow = (index: number) => remove(index);

  const cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const gridColsClass = cols[columns.length as keyof typeof cols] ?? 'grid-cols-1';

  const hasError = Array.isArray(errors[namePrefix])
    ? errors[namePrefix].some((item) => fieldNames.some((fieldName) => item?.[fieldName]))
    : false;

  return (
    <div className="max-w-[950px] space-y-4">
      <TooltipAction text="Clique aqui, para mais informações">
        <div className="flex gap-2 items-center">
          {title && <h3 className="font-semibold text-md text-muted-foreground">{title}</h3>}
          {required && <span className={`ml-1 ${hasError ? 'text-red-500' : ''}`}>*</span>}
          {info && (
            <DialogAction
              textButton="Entendi."
              textTitle="Despesas mensais básicas"
              textDescription={info}
              icon={Info}
              size="24"
            />
          )}
        </div>
      </TooltipAction>

      <div className="rounded-lg overflow-hidden border border-gray-200">
        <div
          className={`grid ${gridColsClass} gap-4 bg-blue-400 text-white font-medium text-sm px-1 py-1 max-w-[950px] rounded-t-lg`}
        >
          {columns.map((col, idx) => (
            <div
              key={idx}
              className="font-bold text-white truncate bg-blue-400 p-2 rounded-t-md text-sm"
              title={col}
            >
              {col}
            </div>
          ))}
        </div>

        {/* Linhas */}
        <div ref={parentRef} className="max-w-[950px] divide-y ">
          {fields.map((field, rowIdx) => (
            <div key={field.id} className={`grid ${gridColsClass} gap-4 p-4`}>
              {fieldNames.map((fieldName) => {
                const fieldError = (
                  errors[namePrefix] as Record<number, Record<string, FieldError>> | undefined
                )?.[rowIdx]?.[fieldName];
                return (
                  <div key={`${field.id}-${fieldName}`} className="relative">
                    <input
                      {...register(`${namePrefix}.${rowIdx}.${fieldName}` as const, {
                        required: required ? 'Campo obrigatório' : false,
                      })}
                      placeholder="Digite..."
                      className={`
                        m-1 p-2 border w-full bg-transparent text-muted-foreground
                        placeholder-muted-foreground rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        ${fieldError ? 'text-red-500 border-red-500 placeholder:text-current bg-red-200' : 'border-gray-300'}
                      `}
                    />
                    {fieldError && (
                      <p className="absolute text-red-500 text-xs mt-1 bottom-[-13px]">
                        {fieldError.message}
                      </p>
                    )}
                  </div>
                );
              })}

              {rowIdx === fields.length - 1 && (
                <div className="flex gap-2 items-center">
                  <TooltipAction text={'Adicionar linha'}>
                    <div>
                      <AnimatedIconButton
                        onClick={handleAddRow}
                        className="p-1 text-gray-600 rounded-full hover:bg-gray-200 transition"
                      >
                        <Plus size={20} />
                      </AnimatedIconButton>
                    </div>
                  </TooltipAction>

                  {fields.length > 1 && (
                    <TooltipAction text={'Remover linha'}>
                      <div>
                        <AnimatedIconButton
                          onClick={() => handleRemoveRow(fields.length - 1)}
                          className="p-1 text-gray-600 rounded-full hover:bg-gray-200 transition"
                        >
                          <Trash size={19} />
                        </AnimatedIconButton>
                      </div>
                    </TooltipAction>
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
