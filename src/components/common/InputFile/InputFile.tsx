import { useFormContext } from 'react-hook-form';
import { ChangeEvent } from 'react';

interface InputFileProps {
  name: string;
  id: string;
  accept?: string;
  multiple?: boolean;
}

export const InputFile = ({
  name,
  id,
  accept = 'image/*,.pdf,.doc,.docx',
  multiple = false,
}: InputFileProps) => {
  const { register, setValue, watch } = useFormContext();
  const currentValue = watch(name);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(name, file, { shouldValidate: true });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        id={id}
        accept={accept}
        multiple={multiple}
        className="hidden"
        {...register(name)}
        onChange={handleFileChange}
      />

      <label
        htmlFor={id}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
      >
        <svg
          className="-ml-1 mr-2 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        {currentValue?.name || 'Selecionar arquivo'}
      </label>

      {currentValue && (
        <div className="text-sm text-gray-500 mt-1">
          <p>Arquivo selecionado: {currentValue.name}</p>
          <p>Tamanho: {(currentValue.size / 1024).toFixed(2)} KB</p>
        </div>
      )}
    </div>
  );
};
