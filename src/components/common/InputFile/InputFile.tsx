import { useFormContext } from 'react-hook-form';
import { ChangeEvent } from 'react';
import { CheckCircle2, UploadCloud, X } from 'lucide-react';

interface InputFileProps {
  name: string;
  id: string;
  accept?: string;
  multiple?: boolean;
}

export const InputFile = ({ name, id, accept }: InputFileProps) => {
  const { register, setValue, watch } = useFormContext();
  const currentValue = watch(name);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(name, file, { shouldValidate: true }); // Força validação imediata
    }
  };

  const handleRemoveFile = () => {
    setValue(name, null, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <input
        type="file"
        id={id}
        accept={accept}
        className="hidden"
        {...register(name)}
        onChange={handleFileChange}
      />

      {!currentValue ? (
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors px-4 py-2"
        >
          <div className="flex items-center justify-center gap-2 w-full">
            <UploadCloud className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-500 text-center">Clique para enviar ou arraste</p>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">PDF, JPG, PNG, DOC (Max. 5MB)</p>
        </label>
      ) : (
        <div className="w-full border border-green-300 bg-green-50 rounded-lg p-2 transition-colors">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              <div className="min-w-0 ">
                <p className="text-sm font-medium text-gray-800 truncate">{currentValue.name}</p>
                <p className="text-xs text-gray-500">{(currentValue.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
