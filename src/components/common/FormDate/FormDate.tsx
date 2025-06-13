import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { FieldError, Merge, FieldErrorsImpl, useFormContext } from 'react-hook-form';

interface FormDateProps {
  name: string;
  label: string;
  required?: boolean;
  description?: string;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>>;
}

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

const FormDate: React.FC<FormDateProps> = ({ name, label, required = false, error }) => {
  const { control, setValue } = useFormContext();
  const [open, setOpen] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const minYear = 1900;
  const maxYear = new Date().getFullYear();
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).reverse();
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="flex flex-col">
          <FormLabel
            className={`ml-1 text-sm md:text-base font-medium text-gray-700 ${fieldState.error ? 'text-red-500' : ''}`}
          >
            {label} {required && '*'}
          </FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={'ghost'}
                className={`text-muted-foreground bg-transparent peer w-full border border-gray-300 rounded-lg px-4 py-3 hover:bg-transparent hover:text-muted text focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm transition-all ${
                  fieldState.error
                    ? 'text-red-500 border-red-500 placeholder:text-current bg-primary-error hover:bg-primary-error hover:text-red-500'
                    : ''
                }`}
              >
                {field.value
                  ? format(new Date(field.value), 'dd/MM/yyyy', { locale: ptBR })
                  : 'clique para selecionar data'}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 p-2 shadow-lg rounded-lg flex flex-col items-center"
              align="start"
              side="top"
            >
              <div className="p-3 border-b bg-blue-300 flex items-center justify-between rounded-t-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowYearSelector(!showYearSelector)}
                  className="w-full"
                >
                  {currentYear}
                </Button>
              </div>

              {showYearSelector && (
                <div className="max-h-40 overflow-y-auto p-2 bg-white border-b">
                  {years.map((year) => (
                    <Button
                      key={year}
                      variant="ghost"
                      onClick={() => {
                        setCurrentYear(year);
                        setCurrentDate(new Date(year, currentDate.getMonth(), 1));
                        setShowYearSelector(false);
                      }}
                      className={`w-full py-1 ${year === currentYear ? 'bg-blue-500 text-white' : ''}`}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              )}

              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  setValue(name, date);
                  setOpen(false);
                }}
                fromYear={minYear}
                toYear={maxYear}
                month={currentDate}
                onMonthChange={(date) => {
                  const newMonth = date.getMonth();
                  const newYear = date.getFullYear();

                  setCurrentYear(newYear);
                  setCurrentDate(new Date(newYear, newMonth, 1));
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {fieldState.error && (
            <FormMessage className="block text-red-500 text-xs mt-1">
              {getErrorMessage(error)}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export default FormDate;
