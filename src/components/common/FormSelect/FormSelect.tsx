import React from 'react';
import { useFormContext } from 'react-hook-form';
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
}

const FormSelect: React.FC<FormSelectProps> = ({ name, label, options, required = false }) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className="text-sm md:text-base font-medium text-gray-700">
            {label} {required && '*'}
          </FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm transition-all">
                <SelectValue />
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
          <FormMessage className="text-red-500 text-xs mt-1" />
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
