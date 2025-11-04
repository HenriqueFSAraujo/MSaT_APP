import { XCircle } from 'lucide-react';

interface EmptySectionProps {
    title: string;
}

export const EmptySection = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 bg-gray-100 rounded-full mb-4">
            <XCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Seção não preenchida</h3>
        <p className="text-gray-500">Esta seção ainda não possui dados para validação.</p>
    </div>
);

