import { useFormContext } from 'react-hook-form';
import { ChangeEvent } from 'react';
import { CheckCircle2, UploadCloud, X, ExternalLink, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { InputFileProps, DataProps } from './type.ds';

export const InputFile = ({
  name,
  id = `file-input-${name}`,
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  disabled,
  selectOptions,
  description,
  label,
  linkLabel,
  openLink,
  downloadLabel,
  downloadLink,
  required = false,
}: InputFileProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const currentValue = watch(name);

  const validateField = (value: DataProps) => {
    if (!value) return 'Campo obrigatório';

    const hasFile = value.file?.value instanceof File;
    const hasValidOption = value.option?.value && value.option.value !== 'none';

    return hasFile || hasValidOption || 'Campo obrigatório';
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(
        name,
        {
          ...currentValue,
          file: {
            type: 'file',
            value: file,
            mimeType: file.type,
          },
        },
        { shouldValidate: true }
      );
    }
  };

  const handleRemoveFile = () => {
    setValue(
      name,
      {
        ...currentValue,
        file: null,
      },
      { shouldValidate: true }
    );
  };

  const handleOptionChange = (value: string) => {
    const newValue = {
      ...currentValue,
      option: {
        type: value === 'none' ? 'none' : 'option',
        value: value,
      },
    };

    setValue(name, newValue, { shouldValidate: true });

    if (value === 'none' && currentValue?.file) {
      setValue(
        name,
        {
          ...newValue,
          file: null,
        },
        { shouldValidate: true }
      );
    }
  };

  const getCurrentOption = () => {
    if (!currentValue?.option) return '';
    return currentValue.option.value;
  };

  const shouldShowFileInput = () => {
    if (!selectOptions) return true;
    return currentValue?.option?.value && currentValue.option.value !== 'none';
  };

  const isFileInputDisabled = () => {
    return disabled || !shouldShowFileInput();
  };

  return (
    <div className="w-full space-y-4">
      {(label || description || downloadLabel || linkLabel) && (
        <div className="space-y-2">
          {label && (
            <Label htmlFor={id}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          )}

          {description && <p className="text-sm text-muted-foreground">{description}</p>}

          {openLink && linkLabel && (
            <a
              href={openLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {linkLabel}
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          )}

          {downloadLink && downloadLabel && (
            <a
              href={downloadLink}
              download
              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloadLabel}
            </a>
          )}
        </div>
      )}

      {selectOptions && (
        <div className="mb-3">
          <Select onValueChange={handleOptionChange} value={getCurrentOption()} disabled={disabled}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {selectOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {option.description}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <input
        type="file"
        id={id}
        accept={accept}
        className="hidden"
        {...register(name, {
          validate: (value) => (required ? validateField(value) : true),
        })}
        onChange={handleFileChange}
        disabled={isFileInputDisabled()}
      />

      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]?.message as string}</p>
      )}

      {currentValue?.option?.type === 'none' ? (
        <div className="w-full h-20 border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Documento não é necessário</p>
        </div>
      ) : currentValue?.file?.value ? (
        <div className="w-full border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 rounded-lg p-3 transition-colors">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {currentValue.file.value.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(currentValue.file.value.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : shouldShowFileInput() ? (
        <label
          htmlFor={id}
          className={`flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer transition-colors px-4 py-2 ${
            isFileInputDisabled()
              ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          }`}
        >
          <div className="flex items-center justify-center gap-2 w-full">
            <UploadCloud className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Clique para enviar ou arraste
            </p>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            {accept.split(',').join(', ')} (Max. 5MB)
          </p>
        </label>
      ) : (
        <div className="w-full h-20 border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Selecione uma opção válida para habilitar o upload
          </p>
        </div>
      )}
    </div>
  );
};
