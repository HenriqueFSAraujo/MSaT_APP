import MaskedInput from 'react-text-mask';
import { Input } from '@/components/ui/input';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { useFormContext } from 'react-hook-form';
import { forwardRef } from 'react';
import { moneyMask } from '@/utils/transformMasks';
import React from 'react';

interface FormInputProps {
  name: string;
  label: string | React.ReactNode;
  type?: string;
  required?: boolean;
  error?: string;
  mask?: 'cpf' | 'rg' | 'phone' | 'cep' | 'money';
  description?: string | React.ReactNode;
  withMarginTop?: boolean;
  disabled?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  [key: string]: unknown;
}

const maskPatterns = {
  cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  rg: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  phone: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  cep: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
  money: moneyMask,
};

interface CustomMaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: (string | RegExp)[] | ((value: string) => (string | RegExp)[]);
  guide?: boolean;
  keepCharPositions?: boolean;
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
  disabled,
}: FormInputProps) => {
  const { control, trigger } = useFormContext();

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
              value={field.value ?? ''}
              mask={mask === 'money' ? (value) => moneyMask(value) : maskPatterns[mask]}
              guide={false}
              disabled={disabled}
              keepCharPositions={mask === 'money'}
              className={`peer w-full border border-gray-300 rounded-lg px-4 py-3 text-sm transition-all outline-none focus:outline-none ${
                fieldState.error
                  ? 'text-red-500 border-red-500 placeholder:text-current bg-primary-error focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                  : disabled ? 'bg-gray-50 text-gray-700 cursor-not-allowed border-dashed border-gray-400' : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              }`}
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                field.onChange(value);
                await trigger(name);
              }}
              onBlur={async (e) => {
                field.onBlur();
                if (onBlur && typeof onBlur === 'function') {
                  onBlur(e);
                }
                await trigger(name);
              }}
              placeholder="Digite..."
            />
          ) : (
            <Input
              {...field}
              value={field.value ?? ''}
              type={type}
              disabled={disabled}
              className={`peer w-full border border-gray-300 rounded-lg px-4 py-3 text-sm transition-all outline-none focus:outline-none ${
                fieldState.error
                  ? 'text-red-500 border-red-500 placeholder:text-current bg-primary-error focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                  : disabled ? 'bg-gray-50 text-gray-700 cursor-not-allowed border-dashed border-gray-400' : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              }`}
              placeholder="Digite..."
              onBlur={async (e) => {
                field.onBlur();
                await trigger(name);
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
