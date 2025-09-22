import { useScholarshipFormStore } from '@/store/useScholarshipFormStore';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FormValidationHeader } from '@/components/FormValidation/FormValidationHeader';
import { FormValidationSidebar } from '@/components/FormValidation/FormValidationSidebar';
import { FormValidationContent } from '@/components/FormValidation/FormValidationContent';

const FormValidation = () => {
    const { formData } = useScholarshipFormStore();
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();
    const getStudentIdFromUrl = () => {
        const pathname = window.location.pathname;
        let match = pathname.match(/\/form-validation\/(\d+)/);
        if (!match) {
            match = pathname.match(/\/form-validation\/([^\/]+)/);
        }

        if (match) {
            return match[1];
        }

        const patterns = [
            /\/form-validation\/(\d+)/,
            /\/form-validation\/([^\/]+)/,
            /\/form-validation\/(.*)/
        ];

        for (const pattern of patterns) {
            const testMatch = pathname.match(pattern);
            if (testMatch) {
                return testMatch[1];
            }
        }

        return null;
    };

    const studentId = getStudentIdFromUrl();

    const [validationStatus, setValidationStatus] = useState<Record<string, string>>({});
    const [validationComments, setValidationComments] = useState<Record<string, string>>({});

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('pt-BR');
        } catch {
            return 'Data inválida';
        }
    };

    const getStatusIcon = (isCompleted: boolean) => {
        return isCompleted ? (
            <CheckCircle2 className="w-3 h-3 text-green-600" />
        ) : (
            <XCircle className="w-3 h-3 text-red-500" />
        );
    };

    const getValidationStatus = (section: string) => {
        return validationStatus[section] || 'pending';
    };

    const getValidationIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="w-3 h-3 text-green-600" />;
            case 'rejected':
                return <XCircle className="w-3 h-3 text-red-600" />;
            default:
                return <AlertCircle className="w-3 h-3 text-yellow-600" />;
        }
    };

    const getValidationBadge = (status: string, isActive: boolean = false) => {
        const baseClasses = isActive ? 'text-white' : '';

        switch (status) {
            case 'approved':
                return <Badge className={`bg-green-100 ${isActive ? 'text-white bg-green-600' : 'text-green-800'} border-green-200 ${baseClasses}`}>Aprovado</Badge>;
            case 'rejected':
                return <Badge className={`${isActive ? 'bg-red-600 text-white' : ''} ${baseClasses}`} variant={isActive ? undefined : 'destructive'}>Rejeitado</Badge>;
            default:
                return <Badge className={`${isActive ? 'bg-gray-600 text-white border-gray-600' : ''} ${baseClasses}`} variant={isActive ? undefined : 'outline'}>Pendente</Badge>;
        }
    };

    const validateSection = (section: string, status: 'approved' | 'rejected') => {
        setValidationStatus(prev => ({
            ...prev,
            [section]: status
        }));
    };

    const handleSaveValidation = () => {
        console.log('Validações salvas:', { validationStatus, validationComments });
        navigate(-1);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="container mx-auto py-8 px-4">
                <FormValidationHeader
                    studentId={studentId}
                    onBack={() => navigate(-1)}
                    onEditForm={() => navigate(`/students-form/${studentId}`)}
                    onSaveValidation={handleSaveValidation}
                />

                <motion.div variants={cardVariants}>
                    <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden">
                        <CardContent className="p-0">
                            <Tabs defaultValue="scholarship_info" className="w-full">
                                <div className="flex h-[75vh]">
                                    <FormValidationSidebar
                                        validationStatus={validationStatus}
                                        getValidationStatus={getValidationStatus}
                                        getValidationBadge={getValidationBadge}
                                    />

                                    <FormValidationContent
                                        formData={formData}
                                        validationStatus={validationStatus}
                                        validateSection={validateSection}
                                    />
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default FormValidation;
