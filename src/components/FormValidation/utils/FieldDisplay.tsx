import { extractDisplayValue } from '@/utils/valueMappings';

interface FieldDisplayProps {
    label: string;
    value: unknown;
    className?: string;
    fieldType?: string;
}

export const FieldDisplay = ({ label, value, className = "", fieldType }: FieldDisplayProps) => {
    const displayValue = extractDisplayValue(value, fieldType);
    return (
        <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
            <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
            <div className="text-base text-gray-900 font-semibold">
                {displayValue || <span className="text-gray-400 italic">Não informado</span>}
            </div>
        </div>
    );
};

