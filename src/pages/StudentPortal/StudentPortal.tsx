import { DialogPerfilAction } from '@/components/common/DialogPerfilAction/DialogPerfilAction';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { formatCpf } from '@/utils/transformMasks';
import { CheckCircle2, AlertCircle } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-2">Bem-vindo, {name} 👋</h2>
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

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">📑 Documentos</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Identidade</span>
                {getDocStatus(student.documents.identidade)}
              </div>
              <div className="flex justify-between">
                <span>Comprovante de Residência</span>
                {getDocStatus(student.documents.comprovanteResidencia)}
              </div>
              <div className="flex justify-between">
                <span>Declaração de Renda</span>
                {getDocStatus(student.documents.declaracaoRenda)}
              </div>
            </div>

            <Button className="mt-6 w-full">Completar envio de documentos</Button>
            <Button onClick={() => navigate(`/students-form/${StudentId}`)} className="w-full mt-6">
              Acessar Formulário de Inscrição
            </Button>
          </CardContent>
        </Card>
      </div>
      <DialogPerfilAction open={changePasswordModal} onOpenChange={setChangePasswordModal} />
    </div>
  );
}
