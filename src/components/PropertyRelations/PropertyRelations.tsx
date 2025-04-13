import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { toast } from '@/utils/toast';
import { dynamicSections } from './form.ds';
import { DynamicInputSection } from '../DynamicInputSection/DynamicInputSection';

const formSchema = z.object({
    vehicles: z
        .array(
            z.object({
                model: z.string().min(1, 'Campo obrigatório'),
                year: z.string().min(1, 'Campo obrigatório'),
                usage: z.string().min(1, 'Campo obrigatório'),
            })
        )
        .min(1, 'Pelo menos uma linha é obrigatória'),
    peopleSchool: z
        .array(
            z.object({
                name: z.string().min(1, 'Campo obrigatório'),
                school: z.string().min(1, 'Campo obrigatório'),
                monthlyValue: z.string().min(1, 'Campo obrigatório'),

            })
        )
        .min(1, 'Pelo menos uma linha é obrigatória'),
});

type FormData = z.infer<typeof formSchema>;

export const PropertyRelations = ({ label }: { label: string }) => {
    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vehicles: [{ model: '', year: '', usage: '' }],
            peopleSchool: [{ name: '', school: '', monthlyValue: '' }],
        },
    });

    const { handleSubmit } = methods;

    const onSubmit = async (data: FormData) => {
        try {
            console.log('Dados enviados:', data);
            toast.success('Sucesso!', 'salva com sucesso!');
        } catch (error) {
            console.error('Erro no processamento:', error);
            toast.error('Erro', 'Ocorreu um erro ao salvar.');
        }
    };

    return (
        <FormProvider {...methods}>
            <div className="max-w-6xl mx-auto bg-white p-6">
                <h1 className="text-2xl font-semibold text-gray-700 text-center m-6">{label}</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-wrap gap-6">
                        {dynamicSections.map((section) => (
                            <div key={section.key} className="w-full md:w-[520px]">
                                <DynamicInputSection
                                    title={section.title}
                                    columns={section.columns}
                                    fieldNames={section.fields}
                                    namePrefix={section.key}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-6">
                        <Button
                            type="submit"
                            className="mt-4 w-35 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors"
                        >
                            Salvar e continuar
                        </Button>
                    </div>
                </form>
            </div>
        </FormProvider>
    );
};
