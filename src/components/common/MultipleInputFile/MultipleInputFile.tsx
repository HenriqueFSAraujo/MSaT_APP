import { useFormContext } from 'react-hook-form';
import { ChangeEvent, useState, useMemo } from 'react';
import { CheckCircle2, UploadCloud, X, AlertCircle } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface FileData {
    file: File;
    type?: string;
    id: string;
}

interface FileType {
    value: string;
    label: string;
    description?: string;
    required?: boolean;
}

interface MultipleInputFileProps {
    name: string;
    label: string;
    description?: string;
    accept?: string;
    required?: boolean;
    maxFiles?: number;
    fileTypes?: FileType[];
    disabled?: boolean;
}

export const MultipleInputFile = ({
    name,
    label,
    description,
    accept = '.pdf',
    required = false,
    maxFiles = 10,
    fileTypes,
    disabled = false,
}: MultipleInputFileProps) => {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();

    const [selectedType, setSelectedType] = useState<string>('');
    const files: FileData[] = watch(name) || [];

    // Calcula o progresso de documentos obrigatórios enviados
    const progress = useMemo(() => {
        if (!fileTypes) return 100;

        const requiredTypes = fileTypes.filter(type => type.required);
        const uploadedRequiredTypes = new Set(
            files
                .filter(file => file.type)
                .map(file => file.type)
        );

        const completedCount = requiredTypes.filter(
            type => uploadedRequiredTypes.has(type.value)
        ).length;

        return (completedCount / requiredTypes.length) * 100;
    }, [files, fileTypes]);

    // Agrupa os arquivos por tipo
    const filesByType = useMemo(() => {
        const grouped = new Map<string, FileData[]>();

        if (fileTypes) {
            fileTypes.forEach(type => {
                grouped.set(type.value, []);
            });

            files.forEach(file => {
                if (file.type) {
                    const typeFiles = grouped.get(file.type) || [];
                    typeFiles.push(file);
                    grouped.set(file.type, typeFiles);
                }
            });
        }

        return grouped;
    }, [files, fileTypes]);

    const validateFiles = (value: FileData[]) => {
        if (!required && (!value || value.length === 0)) return true;
        if (required && (!value || value.length === 0)) return 'Pelo menos um arquivo é obrigatório';

        if (fileTypes) {
            const missingTypes = fileTypes
                .filter(type => type.required)
                .filter(type => !value.some(file => file.type === type.value));

            if (missingTypes.length > 0) {
                return `Faltam documentos obrigatórios: ${missingTypes.map(t => t.label).join(', ')}`;
            }
        }

        return true;
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type?: string) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length === 0) return;

        if (files.length + newFiles.length > maxFiles) {
            e.target.value = '';
            return;
        }

        const updatedFiles = [
            ...files,
            ...newFiles.map(file => ({
                file,
                type,
                id: Math.random().toString(36).substr(2, 9),
            })),
        ];

        setValue(name, updatedFiles, { shouldValidate: true });
        setSelectedType('');
        e.target.value = '';
    };

    const removeFile = (id: string) => {
        const updatedFiles = files.filter(f => f.id !== id);
        setValue(name, updatedFiles, { shouldValidate: true });
    };

    const getFileTypeLabel = (type?: string) => {
        if (!type || !fileTypes) return '';
        const fileType = fileTypes.find(t => t.value === type);
        return fileType ? fileType.label : '';
    };

    return (
        <div className={`w-full space-y-4 p-5 border rounded-lg transition-colors ${errors[name]
            ? 'border-red-300 bg-red-50'
            : 'border-gray-200 bg-transparent'
            }`}>
            <div className="space-y-4">
                <div>
                    <Label className="text-base font-medium text-gray-800">
                        {label}
                    </Label>
                    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                </div>

                {/* Barra de Progresso */}
                {fileTypes && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progresso</span>
                            <span className="text-gray-900 font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                )}

                {fileTypes && (
                    <div className="flex gap-3 items-end">
                        <div className="flex-1">
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-full bg-gray-50">
                                    <SelectValue placeholder="Selecione o tipo de documento" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fileTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            <div className="py-1">
                                                <div className="flex items-center gap-1">
                                                    {type.label}
                                                    {type.required && (
                                                        <span className="text-red-500">*</span>
                                                    )}
                                                </div>
                                                {type.description && (
                                                    <div className="text-xs text-gray-500">{type.description}</div>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <label
                            className={`flex items-center justify-center px-4 py-2 border-2 border-dashed rounded-md cursor-pointer transition-colors ${disabled || !selectedType
                                ? 'bg-gray-50 cursor-not-allowed border-gray-300'
                                : 'border-blue-400 hover:border-blue-500 hover:bg-blue-50'
                                }`}
                        >
                            <UploadCloud className="w-5 h-5 text-gray-400" />
                            <input
                                type="file"
                                accept={accept}
                                className="hidden"
                                onChange={(e) => handleFileChange(e, selectedType)}
                                disabled={disabled || !selectedType}
                                multiple
                            />
                        </label>
                    </div>
                )}

                {!fileTypes && (
                    <label
                        className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${disabled
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
                        <p className="text-xs text-gray-500">{accept} (Max. {maxFiles} arquivos)</p>
                        <input
                            type="file"
                            accept={accept}
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={disabled}
                            multiple
                        />
                    </label>
                )}
            </div>

            {/* Lista de Documentos Agrupados por Tipo */}
            {fileTypes && files.length > 0 && (
                <div className="space-y-4">
                    {Array.from(filesByType.entries()).map(([type, typeFiles]) => {
                        const fileType = fileTypes.find(t => t.value === type);
                        if (!fileType || typeFiles.length === 0) return null;

                        return (
                            <div key={type} className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <h3 className="text-sm font-medium text-gray-700">
                                        {fileType.label}
                                    </h3>
                                    {fileType.required && (
                                        <span className="text-red-500">*</span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {typeFiles.map((fileData) => (
                                        <div
                                            key={fileData.id}
                                            className="flex justify-between items-center p-3 border border-green-200 bg-green-50 rounded-md"
                                        >
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">
                                                        {fileData.file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {(fileData.file.size / 1024).toFixed(2)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(fileData.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Lista de Documentos Simples */}
            {!fileTypes && files.length > 0 && (
                <div className="space-y-2">
                    {files.map((fileData) => (
                        <div
                            key={fileData.id}
                            className="flex justify-between items-center p-3 border border-green-200 bg-green-50 rounded-md"
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {fileData.file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {(fileData.file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(fileData.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {errors[name] && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors[name]?.message as string}</span>
                </div>
            )}

            <input
                type="hidden"
                {...register(name, {
                    validate: validateFiles
                })}
            />
        </div>
    );
}; 