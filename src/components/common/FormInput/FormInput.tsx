import MaskedInput from 'react-text-mask';
import { Input } from '@/components/ui/input';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { useFormContext } from 'react-hook-form';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  mask?: 'cpf' | 'phone';
  description?: string;
  withMarginTop?: boolean;
  [key: string]: unknown;
}

const maskPatterns = {
  cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  phone: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
};

const FormInput = ({
  name,
  label,
  required = false,
  type = 'text',
  description,
  mask,
  error,
  withMarginTop = false,
}: FormInputProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem
          className={`relative flex flex-col w-full min-h-[80px] ${withMarginTop ? 'mt-6' : ''}`}
        >
          <FormLabel className="text-sm md:text-base font-medium text-gray-700">
            {label}

            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          {mask ? (
            <MaskedInput
              {...field}
              mask={maskPatterns[mask]}
              className="peer w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              onChange={(e) => field.onChange(e.target.value)}
            />
          ) : (
            <Input
              {...field}
              type={type}
              className="peer w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            />
          )}
          {description && (
            <FormDescription className="text-gray-500 text-xs mt-1">{description}</FormDescription>
          )}
          {fieldState.error && (
            <FormMessage className="block text-red-500 text-xs mt-1">
              {error || fieldState.error.message || 'Erro desconhecido'}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export default FormInput;
