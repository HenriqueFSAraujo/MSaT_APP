import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileCheck, FileText, Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormValidationHeaderProps {
    studentId: string | null;
    onBack: () => void;
    onEditForm: () => void;
    onSaveValidation: () => void;
}

export const FormValidationHeader = ({
    studentId,
    onBack,
    onEditForm,
    onSaveValidation
}: FormValidationHeaderProps) => {
    const cardVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div variants={cardVariants} className="mb-8">
            <Card className="shadow-2xl border-0 bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30 backdrop-blur-md rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onBack}
                                className="flex items-center gap-2 border-transparent bg-transparent hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar
                            </Button>
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                                    <FileCheck className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                        Detalhes do Formulário de bolsa
                                    </CardTitle>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            Aluno ID: {studentId || 'Não encontrado'}
                                        </div>
                                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                        <span className="text-gray-600 text-sm">
                                            Validação de dados do processo seletivo
                                        </span>
                                    </div>
                                    {!studentId && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                            <p className="text-red-500 text-sm font-medium">
                                                ID do aluno não foi encontrado na URL
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={onEditForm}
                                variant="outline"
                                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Editar Formulário
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </motion.div>
    );
};
