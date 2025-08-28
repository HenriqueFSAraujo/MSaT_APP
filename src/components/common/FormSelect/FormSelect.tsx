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

interface FormSelectProps {
  name: string;
  label: string;
  required?: boolean;
  description?: string;
  options: { value: string; label: string }[];
  className?: string;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>>;
  withOtherOption?: {
    otherValue: string; // O valor que será considerado como "Outros" (ex: "outros")
    otherFieldName: string; // O nome do campo para armazenar o valor personalizado
    otherPlaceholder?: string; // Placeholder opcional para o campo de "Outros"
  };
}

const FormSelect = ({ 
  name, 
  label, 
  options, 
  required = false, 
  error, 
  withOtherOption 
}: FormSelectProps) => {
  const { control, trigger, watch, setValue } = useFormContext();
  const [showOtherField, setShowOtherField] = useState(false);
  const selectedValue = watch(name);
  
  useEffect(() => {
    // Verifica se o valor selecionado é a opção "Outros"
    if (withOtherOption && selectedValue === withOtherOption.otherValue) {
      setShowOtherField(true);
    } else {
      setShowOtherField(false);
      // Limpa o campo de "Outros" quando outra opção for selecionada
      if (withOtherOption) {
        setValue(withOtherOption.otherFieldName, '');
      }
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
        <FormItem className="w-full">
          <FormLabel
            className={`ml-1 text-sm md:text-base font-medium text-gray-700 ${fieldState.error ? 'text-red-500' : ''}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => handleChange(value, field)}
              value={field.value || ""}
            >
              <SelectTrigger
                className={`peer w-full border border-gray-300 text-black rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm transition-all ${fieldState.error ? 'text-red-500 border-red-500 placeholder:text-current bg-primary-error' : ''}`}
              >
                <SelectValue placeholder="Digite..." />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg rounded-lg border border-gray-200">
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
              {getErrorMessage(error)}
            </FormMessage>
          )}
          
          {/* Campo de entrada para "Outros" */}
          {withOtherOption && showOtherField && (
            <div className="mt-2 animate-in fade-in">
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {withOtherOption.otherPlaceholder || "Especifique..."}
                  {required && <span className="text-red-500 ml-1 font-bold">*</span>}
                </span>
              </div>
              <FormField
                control={control}
                name={withOtherOption.otherFieldName}
                rules={{ required: required ? 'Por favor, especifique' : false }}
                render={({ field: otherField, fieldState: otherFieldState }) => (
                  <>
                    <Input
                      {...otherField}
                      placeholder={withOtherOption.otherPlaceholder || "Especifique..."}
                      className={`w-full px-4 py-2 border ${otherFieldState.error ? 'border-red-500 bg-primary-error ring-2 ring-red-200' : 'border-gray-300'} rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm transition-all`}
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
