import MaskedInput from 'react-text-mask';
import { Input } from '@/components/ui/input';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { useFormContext } from 'react-hook-form';
import { forwardRef } from 'react';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  mask?: 'cpf' | 'rg' | 'phone' | 'cep';
  description?: string;
  withMarginTop?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  [key: string]: unknown;
}

const maskPatterns = {
  cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  rg: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  phone: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  cep: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/], // Corrigido para 8 dígitos
};

interface CustomMaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: (string | RegExp)[];
  guide?: boolean;
}

const CustomMaskedInput = forwardRef<HTMLInputElement, CustomMaskedInputProps>((props, ref) => (
  <MaskedInput
    {...props}
    ref={(inputRef: MaskedInput | null) => {
      if (typeof ref === 'function') {
        ref(inputRef ? (inputRef.inputElement as HTMLInputElement | null) : null);
      } else if (ref) {
        ref.current = inputRef ? (inputRef.inputElement as HTMLInputElement | null) : null;
      }
    }}
  />
));

CustomMaskedInput.displayName = 'CustomMaskedInput';

const FormInput = ({
  name,
  label,
  required = false,
  type = 'text',
  description,
  mask,
  withMarginTop = false,
  onBlur,
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
          <FormLabel
            className={`text-sm md:text-base font-medium text-gray-700 ${fieldState.error ? 'text-red-500' : ''}`}
          >
            {label}
            {required && <span className={`${fieldState.error ? 'text-red-500' : ''}`}>*</span>}
          </FormLabel>

          {mask ? (
            <CustomMaskedInput
              {...field}
              mask={maskPatterns[mask]}
              guide={false}
              className={`peer w-full border border-gray-300 rounded-lg px-4 py-3 text-sm transition-all outline-none focus:outline-none ${
                fieldState.error
                  ? 'text-red-500 border-red-500 placeholder:text-current bg-primary-error focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                  : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              }`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                field.onChange(value);
              }}
              onBlur={(e) => {
                field.onBlur(); // <- importante para RHF
                if (onBlur && typeof onBlur === 'function') {
                  onBlur(e); // <- isso chama o handleCepBlur que você passou no pai!
                }
              }}
              placeholder="Digite..."
            />
          ) : (
            <Input
              {...field}
              type={type}
              className={`peer w-full border border-gray-300 rounded-lg px-4 py-3 text-sm transition-all outline-none focus:outline-none ${
                fieldState.error
                  ? 'text-red-500 border-red-500 placeholder:text-current bg-primary-error focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                  : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              }`}
              placeholder="Digite..."
              onBlur={(e) => {
                field.onBlur();
                if (onBlur) {
                  onBlur(e);
                }
              }}
            />
          )}

          {description && (
            <FormDescription className="text-gray-500 text-xs mt-1">{description}</FormDescription>
          )}

          {fieldState.error && (
            <FormMessage className="block text-red-500 text-xs mt-1">
              {fieldState.error.message || 'Campo obrigatório'}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export default FormInput;
