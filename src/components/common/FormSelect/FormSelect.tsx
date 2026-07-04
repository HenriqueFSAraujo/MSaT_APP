import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldError, FieldErrorsImpl, Merge, useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from '@/utils/toast';

interface FormSelectProps {
  name: string;
  label: string;
  required?: boolean;
  description?: string;
  options: { value: string; label: string }[];
  className?: string;
  compact?: boolean;
  disabled?: boolean;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>>;
  withOtherOption?: {
    otherValue: string;
    otherFieldName: string;
    otherPlaceholder?: string;
  };
  openGuard?: {
    blocked: boolean;
    message: string;
  };
}

const FormSelect = ({
  name,
  label,
  options,
  required = false,
  compact = false,
  disabled = false,
  error,
  withOtherOption,
  openGuard,
}: FormSelectProps) => {
  const { control, trigger, watch, setValue } = useFormContext();
  const [showOtherField, setShowOtherField] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const selectedValue = watch(name);

  const handleOpenChange = (nextOpen: boolean) => {
    if (openGuard?.blocked && nextOpen) {
      toast.error(openGuard.message);
      setIsOpen(false);
      return;
    }
    setIsOpen(nextOpen);
  };

  useEffect(() => {
    if (withOtherOption && selectedValue === withOtherOption.otherValue) {
      setShowOtherField(true);
    } else {
      setShowOtherField(false);
    }
  }, [selectedValue, withOtherOption]);

  useEffect(() => {
    if (withOtherOption && selectedValue === withOtherOption.otherValue) {
      setShowOtherField(true);
    } else if (withOtherOption) {
      setShowOtherField(false);
      setValue(withOtherOption.otherFieldName, '');
    }
  }, [selectedValue, withOtherOption, setValue]);

  const getErrorMessage = (
    error:
      | string
      | FieldError
      | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>>
      | undefined
  ): string => {
    if (typeof error === 'string') {
      return error;
    }
    if (error && 'message' in error) {
      return typeof error.message === 'string' ? error.message : 'Erro desconhecido';
    }
    return 'Erro desconhecido';
  };

  const handleChange = async (value: string, field: { onChange: (value: string) => void }) => {
    field.onChange(value);
    await trigger(name);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={`w-full ${compact ? 'space-y-1' : 'space-y-2'}`}>
          {label && (
            <FormLabel
              className={`ml-1 text-sm md:text-base font-medium text-gray-700 ${fieldState.error ? 'text-red-500' : ''}`}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Select
              onValueChange={(value) => handleChange(value, field)}
              value={field.value || ''}
              defaultValue={field.value || ''}
              disabled={disabled}
              {...(openGuard ? { open: isOpen, onOpenChange: handleOpenChange } : {})}
            >
              <SelectTrigger
                className={`peer w-full border outline-none focus:outline-none rounded-lg px-4 text-sm transition-all justify-between min-h-[50px] ${compact ? 'py-2' : 'py-3'} ${fieldState.error
                    ? 'text-red-500 border-red-500 bg-red-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                    : 'text-gray-700 border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                  }`}
              >
                <SelectValue placeholder="Selecione a opção" className={fieldState.error ? 'text-red-500' : 'text-gray-500'} />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg rounded-lg border border-gray-200 max-h-[300px] overflow-y-auto">
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="px-4 py-2 text-sm hover:bg-blue-100 cursor-pointer transition-all"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {(error || fieldState.error) && (
            <FormMessage className="text-red-500 text-xs mt-1">
              {getErrorMessage(error || fieldState.error)}
            </FormMessage>
          )}

          {/* Campo de entrada para "Outros" */}
          {withOtherOption && showOtherField && (
            <div className={`${compact ? 'mt-1' : 'mt-2'} animate-in fade-in`}>
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {withOtherOption.otherPlaceholder || 'Especifique...'}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </span>
              </div>
              <FormField
                control={control}
                name={withOtherOption.otherFieldName}
                rules={{
                  required: required && field.value === 'outros' ? 'Por favor, especifique' : false,
                }}
                render={({ field: otherField, fieldState: otherFieldState }) => (
                  <>
                    <Input
                      {...otherField}
                      placeholder={withOtherOption.otherPlaceholder || 'Especifique...'}
                      className={`w-full px-4 ${compact ? 'py-1.5' : 'py-2'} border ${otherFieldState.error ? 'border-red-500 bg-primary-error ring-2 ring-red-200' : 'border-gray-300'} rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm transition-all placeholder:text-gray-500 min-h-[${compact ? '38px' : '45px'}]`}
                    />
                    {otherFieldState.error && (
                      <FormMessage className="text-red-500 text-xs mt-1">
                        {otherFieldState.error.message}
                      </FormMessage>
                    )}
                  </>
                )}
              />
            </div>
          )}
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
