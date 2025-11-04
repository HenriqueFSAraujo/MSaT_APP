import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ValidationFooterProps {
    onReject: () => void;
    onApprove: () => void;
}

export const ValidationFooter = ({ onReject, onApprove }: ValidationFooterProps) => (
    <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex gap-4">
            <Button
                onClick={onReject}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
            >
                <XCircle className="w-4 h-4 mr-2" />
                Rejeitar
            </Button>
            <Button
                onClick={onApprove}
                className="bg-green-600 hover:bg-green-700 text-white"
            >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Aprovar
            </Button>
        </div>
    </div>
);

