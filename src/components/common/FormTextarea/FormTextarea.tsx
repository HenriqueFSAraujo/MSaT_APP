import { cn } from '@/utils/utils';
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';

interface FormTextareaProps {
  name: string;
  label: string;
  required?: boolean;
  description?: string;
  withMarginTop?: boolean;
  maxHeight?: number;
}

const FormTextarea = ({
  name,
  label,
  required = false,
  description,
  withMarginTop = false,
  maxHeight = 200,
}: FormTextareaProps) => {
  const { control } = useFormContext();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  };

  useEffect(() => {
    autoResize();
  }, []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ fieldState }) => (
        <FormItem
          className={`relative flex flex-col w-full ${withMarginTop ? 'mt-6' : ''}`}
        >
          <FormLabel
            className={`text-sm md:text-base font-medium text-gray-700 ${fieldState.error ? 'text-red-500' : ''}`}
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </FormLabel>

          <textarea
            className={cn(
              'w-full resize-none overflow-hidden rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm',
              'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'min-h-[46.22px] max-h-[200px]'
            )}
            onInput={(e) => {
              e.currentTarget.style.height = '46.22px'
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
            }}
            rows={1}
            placeholder="Digite..."
          />


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

export default FormTextarea;
