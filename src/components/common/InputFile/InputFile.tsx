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
    <div className="w-full space-y-4 p-5 border border-gray-200 rounded-lg bg-white">
      <div className="space-y-2">
        <div>
          <div>
            <Label htmlFor={id} className="text-base font-medium text-gray-800">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>

          {openLink && linkLabel && (
            <a
              href={openLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              {linkLabel}
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          )}
        </div>

        {downloadLink && downloadLabel && (
          <a
            href={downloadLink}
            download
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            <Download className="mr-1 h-4 w-4" />
            {downloadLabel}
          </a>
        )}
      </div>

      {selectOptions && (
        <Select onValueChange={handleOptionChange} value={getCurrentOption()} disabled={disabled}>
          <SelectTrigger className="w-full bg-gray-50">
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      <div className="mt-2">
        {currentValue?.option?.type === 'none' ? (
          <div className="w-full p-4 border border-gray-200 bg-gray-50 rounded-md text-center text-gray-500 text-sm">
            Documento não é necessário
          </div>
        ) : currentValue?.file?.value ? (
          <div className="w-full p-3 border border-green-200 bg-green-50 rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">
                    {currentValue.file.value.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(currentValue.file.value.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : shouldShowFileInput() ? (
          <label
            htmlFor={id}
            className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer transition-colors ${
              isFileInputDisabled()
                ? 'bg-gray-50 cursor-not-allowed'
                : 'hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">Clique para enviar ou arraste</p>
            <p className="text-xs text-gray-500">{accept.split(',').join(', ')} (Max. 5MB)</p>
          </label>
        ) : (
          <div className="w-full p-4 border border-gray-200 bg-gray-50 rounded-md text-center text-gray-500 text-sm">
            Selecione uma opção válida para habilitar o upload
          </div>
        )}
      </div>

      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]?.message as string}</p>
      )}
    </div>
  );
};
