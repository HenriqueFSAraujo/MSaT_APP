import { useFormContext } from 'react-hook-form';
import { ChangeEvent, useState, useMemo } from 'react';
import { CheckCircle2, UploadCloud, X, AlertCircle, RotateCw } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface FileData {
    file: File;
    type?: string;
    id: string;
    subtype?: string; // Para casos como "Tutela", "Adoção", etc
}

interface FileType {
    value: string;
    label: string;
    description?: string;
    required?: boolean;
    multiple?: boolean; // Indica se aceita múltiplos arquivos
    subtypes?: { // Para documentos que precisam de categorização
        value: string;
        label: string;
        description?: string;
    }[];
}

interface SmartInputFileProps {
    name: string;
    label: string;
    description?: string;
    accept?: string;
    required?: boolean;
    maxFiles?: number;
    fileTypes?: FileType[];
    disabled?: boolean;
}

export const SmartInputFile = ({
    name,
    label,
    description,
    accept = '.pdf',
    required = false,
    maxFiles = 10,
    fileTypes,
    disabled = false,
}: SmartInputFileProps) => {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();

    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedSubtype, setSelectedSubtype] = useState<string>('');
    const files: FileData[] = watch(name) || [];

    const currentFileType = fileTypes?.find(type => type.value === selectedType);
    const isMultipleType = currentFileType?.multiple;

    // Calcula o progresso de documentos obrigatórios enviados
    const progress = useMemo(() => {
        if (!fileTypes) return 100;

        const requiredTypes = fileTypes.filter(type => type.required);
        if (requiredTypes.length === 0) return 100;

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

    // Agrupa os arquivos por tipo e subtipo
    const filesByType = useMemo(() => {
        const grouped = new Map<string, Map<string, FileData[]>>();

        if (fileTypes) {
            fileTypes.forEach(type => {
                const subtypeMap = new Map<string, FileData[]>();
                if (type.subtypes) {
                    type.subtypes.forEach(subtype => {
                        subtypeMap.set(subtype.value, []);
                    });
                } else {
                    subtypeMap.set('default', []);
                }
                grouped.set(type.value, subtypeMap);
            });

            files.forEach(file => {
                if (file.type) {
                    const typeMap = grouped.get(file.type);
                    if (typeMap) {
                        const subtype = file.subtype || 'default';
                        const subtypeFiles = typeMap.get(subtype) || [];
                        subtypeFiles.push(file);
                        typeMap.set(subtype, subtypeFiles);
                    }
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

    const handleFileChange = (e: Event) => {
        const input = e.target as HTMLInputElement;
        const newFiles = Array.from(input.files || []);
        if (newFiles.length === 0) return;

        if (files.length + newFiles.length > maxFiles) {
            input.value = '';
            return;
        }

        const updatedFiles = [
            ...files,
            ...newFiles.map(file => ({
                file,
                id: Math.random().toString(36).substr(2, 9),
            })),
        ];

        setValue(name, updatedFiles, { shouldValidate: true });
        input.value = '';
    };

    const removeFile = (id: string) => {
        const updatedFiles = files.filter(f => f.id !== id);
        setValue(name, updatedFiles, { shouldValidate: true });
    };

    const getFileTypeLabel = (type?: string, subtype?: string) => {
        if (!type || !fileTypes) return '';
        const fileType = fileTypes.find(t => t.value === type);
        if (!fileType) return '';

        if (subtype && fileType.subtypes) {
            const subtypeObj = fileType.subtypes.find(s => s.value === subtype);
            return subtypeObj ? `${fileType.label} - ${subtypeObj.label}` : fileType.label;
        }

        return fileType.label;
    };

    return (
        <div className="w-full">
            <div className="flex flex-col space-y-4">
                {/* Área de Upload */}
                <div className="flex items-center gap-3">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-full bg-white border-gray-300">
                            <SelectValue placeholder="Selecione o tipo de documento" />
                        </SelectTrigger>
                        <SelectContent>
                            {fileTypes?.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    <div className="py-1">
                                        <div className="flex items-center gap-1">
                                            {type.label}
                                            {type.required && (
                                                <span className="text-red-500">*</span>
                                            )}
                                        </div>
                                        {type.description && (
                                            <div className="text-xs text-gray-500">
                                                {type.description}
                                            </div>
                                        )}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = accept;
                            input.multiple = true;
                            input.onchange = handleFileChange;
                            input.click();
                        }}
                    >
                        <RotateCw className="h-4 w-4" />
                    </Button>
                </div>

                {/* Lista de Arquivos */}
                {files.length > 0 && (
                    <div className="space-y-2">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-gray-700 truncate">
                                        {file.file.name}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile(file.id)}
                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Mensagem de Erro */}
                {errors[name] && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors[name]?.message as string}</span>
                    </div>
                )}
            </div>
        </div>
    );
}; 