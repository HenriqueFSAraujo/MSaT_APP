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
    watch,
    formState: { errors },
  } = useFormContext();

  const currentValue = watch(name);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);

    if (newFiles.length === 0) return;

    // Limita a 5 arquivos
    const filesToAdd = newFiles.slice(0, 5);

    // Obtém arquivos existentes
    const existingFiles = currentValue?.files || [];

    // Combina com os novos arquivos, mantendo o limite de 5
    const allFiles = [...existingFiles, ...filesToAdd].slice(0, 5);

    setValue(
      name,
      {
        ...currentValue,
        files: allFiles.map(file => ({
          value: file,
          mimeType: file.type,
        })),
        // Mantém compatibilidade com versão antiga
        file: allFiles.length > 0 ? {
          value: allFiles[0],
          mimeType: allFiles[0].type,
        } : undefined,
      },
      { shouldValidate: true }
    );

    // Reseta o input para permitir adicionar o mesmo arquivo novamente se necessário
    e.target.value = '';
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const currentFiles = currentValue?.files || [];
    const updatedFiles = currentFiles.filter((_item: { value: File; mimeType: string }, index: number) => index !== indexToRemove);

    setValue(
      name,
      {
        ...currentValue,
        files: updatedFiles,
        // Mantém compatibilidade com versão antiga
        file: updatedFiles.length > 0 ? updatedFiles[0] : undefined,
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
          onChange={handleFileChange}
          disabled={isFileInputDisabled()}
        />

        <div className="mt-2 space-y-2">
          {currentValue?.option?.type === 'none' ? (
            <div className="w-full p-4 border border-gray-200 bg-gray-50 rounded-md text-center text-gray-500 text-sm">
              Documento não é necessário
            </div>
          ) : currentValue?.files && currentValue.files.length > 0 ? (
            <div className="space-y-2">
              {currentValue.files.map((fileItem: { value: File; mimeType: string }, index: number) => (
                <div key={index} className="w-full p-3 border border-green-200 bg-green-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate max-w-[180px]">
                          {fileItem.value.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(fileItem.value.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
              {currentValue.files.length < 5 && shouldShowFileInput() && (
                <label
                  htmlFor={id}
                  className="flex items-center justify-center w-full p-3 border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-600"
                >
                  <UploadCloud className="w-4 h-4 mr-2" />
                  Adicionar mais documentos ({currentValue.files.length}/5)
                </label>
              )}
            </div>
          ) : shouldShowFileInput() ? (
            <label
              htmlFor={id}
              className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${isFileInputDisabled()
                ? 'bg-gray-50 cursor-not-allowed border-gray-300'
                : errors[name]
                  ? 'border-red-500 bg-red-50 hover:border-red-600'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
            >
              <UploadCloud className={`w-6 h-6 mb-2 ${errors[name] ? 'text-red-500' : 'text-gray-400'}`} />
              <p className={`text-sm mb-1 ${errors[name] ? 'text-red-600' : 'text-gray-600'}`}>
                Clique para enviar ou arraste
              </p>
              <p className="text-xs text-gray-500">{accept.split(',').join(', ')} (Max. 5 documentos, 5MB cada)</p>
            </label>
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
