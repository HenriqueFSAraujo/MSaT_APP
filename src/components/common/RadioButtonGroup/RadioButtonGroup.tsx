import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface RadioButtonGroupProps {
  name: string;
  label: string;
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
  required?: boolean;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  error?: string; // Adicionado para exibir erros
}

export const RadioButtonGroup = ({
  name,
  label,
  options,
  required = false,
  className = '',
  orientation = 'vertical',
}: RadioButtonGroupProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`space-y-3 ${className}`}>
          <FormLabel htmlFor={name} className='text-xm font-medium text-muted"'>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className={`flex ${orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col space-y-2'
                }`}
            >
              {options.map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem id={`${name}-${option.value}`} value={option.value} />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel
                      htmlFor={`${name}-${option.value}`}
                      className="font-normal cursor-pointer"
                    >
                      {option.label}
                    </FormLabel>
                    {option.description && (
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    )}
                  </div>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
