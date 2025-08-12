import { DialogPerfilAction } from '@/components/common/DialogPerfilAction/DialogPerfilAction';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { formatCpf } from '@/utils/transformMasks';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
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

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-10 px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div variants={cardVariants}>
          <Card className="mb-6">
            <CardContent className="p-6">
              <motion.h2
                className="text-xl font-bold mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                Bem-vindo, {name} 👋
              </motion.h2>
              <p className="text-gray-600">CPF: {formatCpf(cpf)}</p>
              <p className="text-gray-600">E-mail: {email}</p>
              <div className="mt-4">
                <p className="font-medium">Etapa atual:</p>
                <p className="text-blue-600 font-semibold">{student.currentStep}</p>
                <p className="mt-2 font-medium">Status da inscrição:</p>
                <Badge variant={student.status === 'Completa' ? 'success' : 'outline'}>
                  {student.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-6">
              <motion.h3
                className="text-lg font-semibold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                📑 Documentos
              </motion.h3>
              <motion.div
                className="space-y-3"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                <AnimatePresence>
                  {Object.entries(student.documents).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      className="flex justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span>{key}</span>
                      {getDocStatus(value)}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              <motion.div
                className="mt-6 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  className="w-full"
                >
                  Completar envio de documentos
                </Button>
                <Button
                  onClick={() => navigate(`/students-form/${StudentId}`)}
                  className="w-full"
                >
                  Acessar Formulário de Inscrição
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <DialogPerfilAction open={changePasswordModal} onOpenChange={setChangePasswordModal} />
    </motion.div>
  );
}
