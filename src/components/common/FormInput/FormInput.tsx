import React from 'react';
import { useFormContext } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';

interface FormInputProps {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  description?: string;
  mask?: 'cpf' | 'telefone';
}

const maskPatterns = {
  cpf: '999.999.999-99',
  telefone: '(99) 99999-9999',
};

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  required = false,
  type = 'text',
  description,
  mask,
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative flex flex-col w-full">
          <FormLabel className="text-sm md:text-base font-medium text-gray-700">
            {label} {required && '*'}
          </FormLabel>
          <FormControl>
            {mask ? (
              <InputMask
                {...field}
                mask={maskPatterns[mask]}
                maskChar=""
                className="peer w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              />
            ) : (
              <Input
                {...field}
                type={type}
                className="peer w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              />
            )}
          </FormControl>
          {description && (
            <FormDescription className="text-gray-500 text-xs mt-1 ">{description}</FormDescription>
          )}
          <FormMessage className="text-red-500 text-xs mt-1" />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
