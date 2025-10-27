import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft,  FileText,  AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormValidationHeaderProps {
    studentId: string | null;
    onBack: () => void;
    onEditForm: () => void;
    onSaveValidation?: () => void;
}

export const FormValidationHeader = ({
    studentId,
    onBack,
    onEditForm,
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
        <motion.div variants={cardVariants}>
            <Card className="shadow-2xl bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5  rounded-lg ">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4">
                              <Button
                                  size="sm"
                                  onClick={onBack}
                                  className="mt-4 w-45 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors"
                              >
                                <ArrowLeft className="w-2 h-2" />
                                Voltar
                              </Button>
                              <div>
                              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text mb-2 text-muted-foreground">
                                  Detalhes do Formulário de bolsa
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                  <div className="p-1 bg-blue-100 text-blue-800 rounded-full text-sm ">
                                      Aluno ID: {studentId || 'Não encontrado'}
                                  </div>
                                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                  <span className="text-gray-600 text-sm text-muted-foreground">
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
                                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 px-3 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <FileText className="w-2 h-2 mr-2" />
                                Editar Formulário
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </motion.div>
    );
};
