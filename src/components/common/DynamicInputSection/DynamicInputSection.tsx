import { maskDate, parseCurrency, maskCurrencyInput } from '@/utils/transformMasks';
import { Info, Plus, Trash } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { type FieldError, useFieldArray, useFormContext } from 'react-hook-form';
import { DialogAction } from '../DialogAction/DialogAction';
import { TooltipAction } from '../TooltipAction/TooltipAction';
import FormDate from '../FormDate/FormDate';
import FormSelect from '../FormSelect/FormSelect';
import { getOptionsForField } from '@/components/FamilyComposition/form.ds';

type MaskType = 'date' | 'currency' | 'year';

// Global lock para evitar múltiplas adições simultâneas
const globalAddLock = {
  isAdding: false,
  lastAddTime: 0,
};

type DynamicInputSectionProps = {
  title?: string;
  info?: string;
  columns: string[];
  fieldNames: string[];
  namePrefix: string;
  required: boolean;
  fieldMasks?: Record<string, MaskType>;
  footerMessage?: string;
  dateFields?: string[];
  selectFields?: string[];
  showTotalRow?: {
    fieldToSum: string;
    label: string;
  };
  onRemoveRow?: (index: number) => void;
};

const DynamicInputSectionComponent = ({
  title = '',
  info = '',
  columns = [],
  fieldNames = [],
  namePrefix = '',
  required = false,
  fieldMasks = {},
  footerMessage,
  dateFields = [],
  selectFields = [],
  showTotalRow,
  onRemoveRow,
}: DynamicInputSectionProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const [openModal, setOpenModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: namePrefix,
  });

  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const isAddingRef = useRef(false);
  const lastAddTimeRef = useRef<number>(0);

  // Calculate total diretamente dos fields do useFieldArray
  const totalValue = useMemo(() => {
    if (!showTotalRow || !Array.isArray(fields)) {
      return 'R$ 0,00';
    }

    const sumField = showTotalRow.fieldToSum;
    const total = fields.reduce((sum: number, item: Record<string, string | number>) => {
      if (item && item[sumField]) {
        const originalValue = item[sumField] as string;
        const parsedValue = parseCurrency(originalValue);
        const value = parseFloat(parsedValue) || 0;
        return sum + value;
      }
      return sum;
    }, 0);

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(total);
  }, [fields, showTotalRow]);

  const handleAddRow = useCallback(() => {
    const now = Date.now();

    if (globalAddLock.isAdding || isAddingRef.current ||
        (now - globalAddLock.lastAddTime < 500) || (now - lastAddTimeRef.current < 500)) {
      return;
    }

    globalAddLock.isAdding = true;
    globalAddLock.lastAddTime = now;
    isAddingRef.current = true;
    lastAddTimeRef.current = now;
    setIsAdding(true);

    const newRow = fieldNames.reduce((acc, field) => {
      if (field === 'salarioBruto' || field === 'valorMensal' || field === 'despesaMensal' || field === 'valor') {
        acc[field] = 'R$ 0,00';
      } else {
        acc[field] = '';
      }
      return acc;
    }, {} as Record<string, string>);

    append(newRow);

    setTimeout(() => {
      globalAddLock.isAdding = false;
      isAddingRef.current = false;
      setIsAdding(false);
    }, 500);
  }, [append, fieldNames]);

  const handleRemoveRow = useCallback((index: number) => {
    const scrollContainer = tableBodyRef.current?.closest('.overflow-y-auto');
    const scrollTop = scrollContainer?.scrollTop || 0;

    if (onRemoveRow) {
      onRemoveRow(index);
    } else {
      remove(index);
    }

    if (scrollContainer) {
      setTimeout(() => {
        scrollContainer.scrollTop = scrollTop;
      }, 0);
    }
  }, [remove, onRemoveRow]);

  const hasError = Array.isArray(errors[namePrefix])
    ? errors[namePrefix].some((item) => fieldNames.some((fieldName) => item?.[fieldName]))
    : false;

  const createMaskedInput = useCallback((path: string, mask: MaskType | undefined, fieldError?: FieldError, placeholder?: string) => {
    const { onChange, onBlur, ...registerProps } = register(path, {
      required: required ? 'Campo obrigatório' : false,
      validate: (val: string) => {
        if (mask === 'year') {
          if (!val) return true;
          if (!/^\d{1,4}$/.test(val)) return 'Apenas números são permitidos';
          if (val.length !== 4) return 'O ano deve conter exatamente 4 dígitos';
          const yearNum = parseInt(val, 10);
          if (yearNum < 1900 || yearNum > new Date().getFullYear() + 1)
            return 'Ano inválido';
          return true;
        } else if (mask === 'date') {
          return !val || /^\d{2}\/\d{2}\/\d{4}$/.test(val) || 'Formato deve ser DD/MM/AAAA';
        }
        return true;
      }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;

      if (mask === 'year') {
        val = val.replace(/\D/g, '').slice(0, 4);
      } else if (mask === 'date') {
        val = maskDate(val);
      } else if (mask === 'currency') {
        val = maskCurrencyInput(val);
      }

      // Criar um novo evento com o valor mascarado
      const maskedEvent = {
        ...e,
        target: {
          ...e.target,
          value: val
        }
      } as React.ChangeEvent<HTMLInputElement>;

      // Chamar o onChange do register com o valor mascarado
      onChange(maskedEvent);
    };

    return (
      <div className="w-full">
        <input
          {...registerProps}
          placeholder={
            placeholder || (mask === 'date' ? 'DD/MM/AAAA' : mask === 'year' ? 'AAAA' : 'Digite...')
          }
          onChange={handleChange}
          onBlur={onBlur}
          inputMode={mask === 'date' || mask === 'year' || mask === 'currency' ? 'numeric' : 'text'}
          maxLength={mask === 'year' ? 4 : mask === 'date' ? 10 : undefined}
          className={`
            w-full px-4 py-3 text-sm border rounded-lg
            placeholder:text-gray-500
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500
            transition-all min-h-[50px]
            ${fieldError ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 bg-white text-gray-700'}
          `}
        />
        {fieldError && (
          <p className="text-red-500 text-xs mt-1">
            {fieldError.message}
          </p>
        )}
      </div>
    );
  }, [register, required]);

  const renderField = useCallback((
    fieldName: string,
    rowIdx: number,
    fieldError?: FieldError,
    placeholder?: string
  ) => {
    const path = `${namePrefix}.${rowIdx}.${fieldName}` as const;
    const otherPath = `${namePrefix}.${rowIdx}.${fieldName}_other` as const;

    if (dateFields.includes(fieldName)) {
      return (
        <div className="w-full">
          <FormDate
            name={path}
            label=""
            required={required}
            error={fieldError?.message}
            compact={true}
          />
        </div>
      );
    }

    if (selectFields.includes(fieldName)) {
      const options = getOptionsForField(fieldName);

      return (
        <div className="w-full">
          <FormSelect
            name={path}
            label=""
            options={options}
            required={required}
            compact={true}
            error={fieldError?.message}
            withOtherOption={
              options.some((opt) => opt.value === 'outros')
                ? {
                    otherValue: 'outros',
                    otherFieldName: otherPath,
                    otherPlaceholder: fieldName === 'escolaridade'
                      ? 'Especifique a escolaridade'
                      : fieldName === 'grauParentesco'
                      ? 'Especifique o grau de parentesco'
                      : 'Especifique...',
                  }
                : undefined
            }
          />
        </div>
      );
    }

    const mask = fieldMasks[fieldName];
    return createMaskedInput(path, mask, fieldError, placeholder);
  }, [namePrefix, dateFields, selectFields, required, fieldMasks, createMaskedInput]);

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-3 items-center">
        {title && <h3 className="font-semibold text-gray-700">{title}</h3>}
        {required && (
          <span className={`ml-1 ${hasError ? 'text-red-500' : 'text-red-500'}`}>*</span>
        )}
        {info && (
          <DialogAction
            textButton="Entendi."
            textTitle="Informações"
            textDescription={info}
            icon={Info}
            size="16"
            open={openModal}
            setOpenModal={() => setOpenModal(!openModal)}
          />
        )}
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
          {/* Mobile view */}
          <div className="md:hidden">
            {fields.map((field, rowIdx) => (
              <div key={field.id} className="p-3 border-b last:border-b-0 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-600">Pessoa {rowIdx + 1}</h4>
                  {fields.length > 1 && (
                    <button
                      onClick={() => handleRemoveRow(rowIdx)}
                      className="p-1 rounded-full hover:bg-red-100 text-red-500"
                      type="button"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {fieldNames.map((fieldName, colIdx) => {
                  const fieldError = (
                    errors[namePrefix] as Record<number, Record<string, FieldError>> | undefined
                  )?.[rowIdx]?.[fieldName];

                  return (
                    <div key={`${field.id}-${fieldName}`} className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {columns[colIdx]}
                      </label>
                      {renderField(fieldName, rowIdx, fieldError, `${columns[colIdx]}`)}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Add total row for mobile */}
            {showTotalRow && (
              <div className="p-3 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">{showTotalRow.label}</h4>
                  <div className="font-bold text-blue-700">{totalValue}</div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop table view */}
          <table className="w-full table-fixed hidden md:table">
            <thead className="bg-blue-500 text-white sticky top-0 z-10">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="text-left p-3 text-sm font-medium">
                    {col}
                  </th>
                ))}
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody ref={tableBodyRef} className="divide-y divide-gray-200">
              {fields.map((field, rowIdx) => (
                <tr key={field.id} className="hover:bg-gray-50">
                  {fieldNames.map((fieldName, colIdx) => {
                    const fieldError = (
                      errors[namePrefix] as Record<number, Record<string, FieldError>> | undefined
                    )?.[rowIdx]?.[fieldName];

                    return (
                      <td key={`${field.id}-${fieldName}`} className="p-3 align-top">
                        {renderField(fieldName, rowIdx, fieldError, `${columns[colIdx]}`)}
                      </td>
                    );
                  })}
                  <td className="p-3 w-10 align-middle">
                    {fields.length > 1 && (
                      <TooltipAction text="Remover">
                        <button
                          onClick={() => handleRemoveRow(rowIdx)}
                          className="p-1 rounded-full hover:bg-red-100 text-red-500"
                          type="button"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </TooltipAction>
                    )}
                  </td>
                </tr>
              ))}

              {/* Add total row for desktop */}
              {showTotalRow && (
                <tr className="bg-gray-50">
                  <td className="p-3 align-middle font-medium">{showTotalRow.label}</td>
                  {/* Empty cells to fill the space */}
                  {Array(columns.length - 2)
                    .fill(0)
                    .map((_, idx) => (
                      <td key={`spacer-${idx}`}></td>
                    ))}
                  <td className="p-3 align-middle text-right font-bold text-blue-700">
                    {totalValue}
                  </td>
                  <td className="w-10"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add buttons */}
        <div className="p-3 md:hidden">
          <button
            onClick={handleAddRow}
            disabled={isAdding}
            className="flex items-center justify-center w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <Plus size={20} className="mr-2" />
            <span className="font-medium">{isAdding ? 'Adicionando...' : 'Adicionar Pessoa'}</span>
          </button>
        </div>

        <div className="hidden md:flex justify-end p-3 bg-gray-50">
          <button
            onClick={handleAddRow}
            disabled={isAdding}
            className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <Plus size={14} /> {isAdding ? 'Adicionando...' : 'Adicionar linha'}
          </button>
        </div>
      </div>

      {footerMessage && <div className="text-xs text-gray-500 mt-1">{footerMessage}</div>}
    </div>
  );
};

// Export sem memo para testar
export const DynamicInputSection = DynamicInputSectionComponent;
