import { DialogPerfilAction } from '@/components/common/DialogPerfilAction/DialogPerfilAction';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { formatCpf } from '@/utils/transformMasks';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  GraduationCap,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function StudentPortal() {
  const { id: StudentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { name, cpf, email, firstLogin } = useAuthStore();
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  useEffect(() => {
    if (firstLogin) {
      setChangePasswordModal(true);
    }
    useScholarshipFormStore.getState().clearFormData();
  }, []);
  const student = {
    currentStep: 'Análise de documentos',
    status: 'Documentos pendentes',
    documents: {
      identidade: true,
      comprovanteResidencia: true,
      declaracaoRenda: false,
    },
  };

  const getDocStatus = (status: boolean) => {
    return status ? (
      <Badge variant="success" className="flex items-center gap-1">
        <CheckCircle2 className="w-4 h-4" />
        Enviado
      </Badge>
    ) : (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        Pendente
      </Badge>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const processStatus = {
    phase: 'Análise Documental',
    deadline: '31/12/2025',
    scholarship: {
      wantsToParticipate: true,
      hadScholarshipLastYear: false,
      previousPercentage: null
    },
    timeline: [
      { step: 'Inscrição Realizada', completed: true },
      { step: 'Documentos Enviados', completed: false },
      { step: 'Análise Socioeconômica', completed: false },
      { step: 'Resultado Final', completed: false }
    ]
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-10 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Pessoais */}
          <motion.div variants={cardVariants}>
            <Card>
              <CardContent className="p-6">
                <motion.div className="flex items-center gap-3 mb-4">
                  <User className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold">Informações Pessoais</h2>
                </motion.div>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Nome Completo</span>
                    <span className="font-medium">{name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">CPF</span>
                    <span className="font-medium">{formatCpf(cpf)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">E-mail</span>
                    <span className="font-medium">{email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Status do Processo */}
          <motion.div variants={cardVariants}>
            <Card>
              <CardContent className="p-6">
                <motion.div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold">Status do Processo</h2>
                </motion.div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Fase Atual</span>
                    <Badge variant="outline" className="bg-blue-50">
                      {processStatus.phase}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Prazo Final</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{processStatus.deadline}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timeline do Processo */}
          <motion.div variants={cardVariants} className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <motion.div className="flex items-center gap-3 mb-6">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold">Timeline do Processo</h2>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {processStatus.timeline.map((item, index) => (
                    <motion.div
                      key={item.step}
                      className="relative flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {item.completed ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : (
                          <Clock className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="text-center mt-2">
                        <span className={`text-sm font-medium ${
                          item.completed ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {item.step}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Documentação */}
          <motion.div variants={cardVariants} className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <motion.div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold">Documentação</h2>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Status dos Documentos</h3>
                    {Object.entries(student.documents).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        {getDocStatus(value)}
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Ações</h3>
                    <motion.div className="space-y-3">
                      <Button
                        className="w-full flex items-center gap-2"
                        variant="outline"
                      >
                        <FileText className="h-4 w-4" />
                        Completar envio de documentos
                      </Button>
                      <Button
                        onClick={() => navigate(`/students-form/${StudentId}`)}
                        className="w-full flex items-center gap-2"
                      >
                        <GraduationCap className="h-4 w-4" />
                        Acessar Formulário de Inscrição
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <DialogPerfilAction open={changePasswordModal} onOpenChange={setChangePasswordModal} />
    </motion.div>
  );
}
