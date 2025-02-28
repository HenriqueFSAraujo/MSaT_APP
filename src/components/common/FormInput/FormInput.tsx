import React from 'react';
import { useFormContext, FieldError } from 'react-hook-form';
import MaskedInput from 'react-text-mask';
import { Input } from '@/components/ui/input';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string | FieldError;
  mask?: 'cpf' | 'telefone';
  description?: string;
  [key: string]: unknown;
}

const maskPatterns = {
  cpf: ['1', '1', '1', '.', '1', '1', '1', '.', '1', '1', '1', '-', '1', '1'],
  telefone: ['(', '1', '1', ')', ' ', '1', '1', '1', '1', '1', '-', '1', '1', '1', '1'],
};

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  required = false,
  type = 'text',
  description,
  mask,
}: FormInputProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="relative flex flex-col w-full min-h-[80px]">
          <FormLabel className="text-sm md:text-base font-medium text-gray-700">
            {label} {required && '*'}
          </FormLabel>
          {mask ? (
            <MaskedInput
              {...field}
              mask={maskPatterns[mask]}
              className="peer w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm transition-all"
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
          {fieldState?.error && (
            <FormMessage className="block text-red-500 text-xs mt-1">
              {fieldState.error?.message || 'Erro desconhecido'}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export default FormInput;
