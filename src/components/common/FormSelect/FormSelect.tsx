import { FieldError, Merge, FieldErrorsImpl, useFormContext } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';

interface FormSelectProps {
  name: string;
  label: string;
  required?: boolean;
  description?: string;
  options: { value: string; label: string }[];
  className?: string;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>>;
}

const FormSelect = ({ name, label, options, required = false, error }: FormSelectProps) => {
  const { control, trigger } = useFormContext();

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

            {required && <span>*</span>}
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => handleChange(value, field)}
              defaultValue={field.value}
            >
              <SelectTrigger
                className={`peer w-full border border-gray-300 text-muted-foreground rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm transition-all ${fieldState.error ? 'text-red-500 border-red-500 placeholder:text-current bg-primary-error' : ''}`}
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
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
