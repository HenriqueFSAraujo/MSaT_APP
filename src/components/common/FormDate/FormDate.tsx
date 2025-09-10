import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { FieldError, FieldErrorsImpl, Merge, useFormContext } from 'react-hook-form';

interface FormDateProps {
  name: string;
  label: string;
  required?: boolean;
  description?: string;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>>;
  compact?: boolean;
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

const FormDate: React.FC<FormDateProps> = ({
  name,
  label,
  required = false,
  error,
  compact = false,
}) => {
  const { control, setValue } = useFormContext();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'calendar' | 'months' | 'years'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [justSelected, setJustSelected] = useState(false);

  const minYear = 1900;
  const maxYear = new Date().getFullYear();

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const generateYears = () => {
    const years = [];
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year);
    }
    return years;
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setView('months');
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setView('calendar');
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newYear = currentDate.getFullYear() + (direction === 'next' ? 1 : -1);
    if (newYear >= minYear && newYear <= maxYear) {
      setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const renderHeader = () => {
    switch (view) {
      case 'years':
        return (
          <div className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-t-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateYear('prev')}
              className="text-white hover:bg-blue-600 p-2 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="font-semibold text-lg">Selecione o Ano</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateYear('next')}
              className="text-white hover:bg-blue-600 p-2 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        );

      case 'months':
        return (
          <div className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-t-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('years')}
              className="text-white hover:bg-blue-600 text-lg font-medium"
            >
              {currentDate.getFullYear()}
            </Button>
            <span className="font-semibold text-lg">Selecione o Mês</span>
            <div className="w-10" />
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-t-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="text-white hover:bg-blue-600 p-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('months')}
                className="text-white hover:bg-blue-600 hover:text-white text-lg font-medium"
              >
                {months[currentDate.getMonth()]}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('years')}
                className="text-white hover:bg-blue-600 hover:text-white text-lg font-medium"
              >
                {currentDate.getFullYear()}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="text-white hover:bg-blue-600 p-2"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        );
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const renderContent = () => {
          switch (view) {
            case 'years':
              return (
                <div className="grid grid-cols-3 gap-2 p-4 max-h-80 overflow-y-auto">
                  {generateYears().map((year) => (
                    <Button
                      key={year}
                      variant="ghost"
                      onClick={() => handleYearSelect(year)}
                      className={`p-3 text-base hover:bg-blue-100 min-h-[50px] ${
                        year === currentDate.getFullYear()
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'text-gray-700'
                      }`}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              );

            case 'months':
              return (
                <div className="grid grid-cols-3 gap-3 p-6">
                  {months.map((month, index) => (
                    <Button
                      key={month}
                      variant="ghost"
                      onClick={() => handleMonthSelect(index)}
                      className={`p-4 text-base hover:bg-blue-100 min-h-[60px] ${
                        index === currentDate.getMonth()
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'text-gray-700'
                      }`}
                    >
                      {month}
                    </Button>
                  ))}
                </div>
              );

            default:
              return (
                <div className="p-4">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        setJustSelected(true);
                        setValue(name, date);
                        setOpen(false);
                        setTimeout(() => setJustSelected(false), 200);
                      }
                    }}
                    month={currentDate}
                    onMonthChange={setCurrentDate}
                    fromYear={minYear}
                    toYear={maxYear}
                    locale={ptBR}
                    initialFocus
                    className="w-full"
                    classNames={{
                      months:
                        'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full',
                      month: 'space-y-4 w-full',
                      caption: 'hidden',
                      caption_label: 'hidden',
                      nav: 'hidden',
                      nav_button: 'hidden',
                      nav_button_previous: 'hidden',
                      nav_button_next: 'hidden',
                      table: 'w-full border-collapse space-y-1',
                      head_row: 'flex w-full',
                      head_cell:
                        'text-gray-600 rounded-md w-10 h-10 font-medium text-sm flex items-center justify-center',
                      row: 'flex w-full mt-2',
                      cell: 'text-center text-sm p-0 relative flex-1 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                      day: 'h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-100 rounded-md transition-colors flex items-center justify-center',
                      day_selected:
                        'bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-500 focus:text-white',
                      day_today: 'bg-blue-100 text-blue-700 font-semibold',
                      day_outside: 'text-gray-400 opacity-50',
                      day_disabled: 'text-gray-400 opacity-50',
                      day_range_middle:
                        'aria-selected:bg-accent aria-selected:text-accent-foreground',
                      day_hidden: 'invisible',
                    }}
                    components={{
                      IconLeft: () => null,
                      IconRight: () => null,
                    }}
                    formatters={{
                      formatWeekdayName: (date) => weekDays[date.getDay()],
                    }}
                  />
                </div>
              );
          }
        };

        return (
          <FormItem className={`flex flex-col ${compact ? 'space-y-1' : 'space-y-2'}`}>
            {label && (
              <FormLabel
                className={`ml-1 text-sm md:text-base font-medium text-gray-700 ${
                  fieldState.error ? 'text-red-500' : ''
                }`}
              >
                {label} {required && <span className="text-red-500">*</span>}
              </FormLabel>
            )}

            <Popover
              open={open}
              onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (isOpen) {
                  setView('calendar');
                }
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  onFocus={() => {
                    if (!open && !justSelected) {
                      setOpen(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpen(true);
                    }
                    if (e.key === 'Escape') {
                      setOpen(false);
                    }
                  }}
                  className={`text-left bg-transparent border border-gray-300 rounded-lg px-4 pr-12 hover:bg-transparent text-sm transition-all justify-between w-full min-h-[50px] ${
                    compact ? 'py-3' : 'py-4'
                  } ${
                    fieldState.error
                      ? 'text-red-500 border-red-500 bg-red-50 hover:bg-red-50 placeholder:text-current'
                      : 'text-gray-700 placeholder:text-gray-500 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white'
                  }`}
                >
                  <span className={`flex-1 ${field.value ? 'text-gray-900' : 'text-gray-500'} placeholder:text-gray-500`}>
                    {field.value
                      ? format(field.value, 'dd/MM/yyyy', { locale: ptBR })
                      : 'Selecione uma data'}
                  </span>
                  {/* <CalendarIcon className="h-4 w-4 opacity-50 absolute right-4" /> */}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto p-0 shadow-xl rounded-lg overflow-hidden min-w-[350px]"
                align="center"
                side="bottom"
              >
                {renderHeader()}
                {renderContent()}
              </PopoverContent>
            </Popover>

            {fieldState.error && (
              <FormMessage className="text-red-500 text-xs mt-1">
                {getErrorMessage(error)}
              </FormMessage>
            )}
          </FormItem>
        );
      }}
    />
  );
};

export default FormDate;
