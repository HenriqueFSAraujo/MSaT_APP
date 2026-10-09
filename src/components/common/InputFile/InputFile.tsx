import { useFormContext } from 'react-hook-form';
import { CheckCircle2, ExternalLink, Download } from 'lucide-react';
import FileDropzone from '@/components/DragAndDrop';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { InputFileProps } from './type.ds';

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
    clearErrors,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();

  const currentValue = watch(name);

  const handleFilesChange = (files: File[]) => {
    const value = getValues(name);
    const currentData = typeof value === 'object' && value !== null ? value : {};
    const uploadedFiles = files.map((file) => ({
      value: file,
      mimeType: file.type,
    }));

    setValue(
      name,
      {
        ...currentData,
        files: uploadedFiles,
        file: uploadedFiles[0],
      },
      { shouldValidate: true },
    );
    if (files.length > 0) clearErrors(name);
  };

  const handleOptionChange = (value: string) => {
    const currentData = typeof currentValue === 'object' && currentValue !== null
      ? currentValue
      : {};
    const newValue = {
      ...currentData,
      option: {
        type: value === 'none' ? 'none' : 'option',
        value: value,
      },
      ...(value === 'none' ? { files: [], file: undefined } : {}),
    };

    setValue(name, newValue, { shouldValidate: true });
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
    <>
      <div className={`w-full space-y-4 p-5 border rounded-lg transition-colors ${errors[name]
        ? 'border-red-300 bg-red-50'
        : 'border-gray-200 bg-transparent'
        }`}>
        <div className="space-y-2">
          <div>
            <div>
              <Label htmlFor={id} className="text-base font-medium text-gray-800">
                {label}
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
            <SelectTrigger className={`w-full bg-gray-50 ${errors[name] ? 'border-red-500 ring-red-500 bg-red-50 text-red-500' : ''}`}>
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
          multiple
          {...register(name, {
            validate: (value) => {
              if (!required) return true;
              if (!value) return 'Campo obrigatório';

              const hasFiles = value.files && value.files.length > 0;
              const hasFile = value.file?.value instanceof File;
              const hasValidOption = value.option?.value && value.option.value !== 'none';

              if (selectOptions) {
                if (!hasValidOption) return 'Selecione uma opção válida';
                if (!hasFiles && !hasFile) return 'Envie pelo menos um arquivo';
              } else {
                if (!hasFiles && !hasFile) return 'Envie pelo menos um arquivo';
              }

              return true;
            }
          })}
          disabled={isFileInputDisabled()}
        />

        <div className="mt-2 space-y-2">
          {currentValue?.option?.type === 'none' ? (
            <div className="w-full p-4 border border-gray-200 bg-gray-50 rounded-md text-center text-gray-500 text-sm">
              Documento não é necessário
            </div>
          ) : shouldShowFileInput() ? (
            <FileDropzone
              className="w-full"
              label="Arraste os arquivos do Explorador de Arquivos para este campo"
              allowedExtensions={accept.split(',')}
              maxSizeMB={5}
              maxFiles={5}
              multiple
              disabled={isFileInputDisabled()}
              onFilesChange={handleFilesChange}
            />
          ) : (
            <div className={`w-full p-4 border rounded-md text-center text-sm ${errors[name]
              ? 'border-red-300 bg-red-50 text-red-600'
              : 'border-gray-200 bg-gray-50 text-gray-500'
              }`}>
              Selecione uma opção válida para habilitar o upload
            </div>
          )}
        </div>

        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name]?.message as string}</p>
        )}
      </div>
    </>
  );
};
