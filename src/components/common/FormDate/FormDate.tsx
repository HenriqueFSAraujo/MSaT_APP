import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/calendar';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

interface FormDateProps {
  name: string;
  label: string;
  required?: boolean;
}

const FormDate: React.FC<FormDateProps> = ({ name, label, required = false }) => {
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
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm md:text-base font-medium text-gray-700">
            {label} {required && '*'}
          </FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left peer border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              >
                {field.value
                  ? format(new Date(field.value), 'dd/MM/yyyy', { locale: ptBR })
                  : 'Selecionar data'}
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

                  setCurrentDate(new Date(newYear, newMonth, 1));
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormDate;
