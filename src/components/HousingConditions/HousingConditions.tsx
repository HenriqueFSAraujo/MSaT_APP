import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { toast } from '@/utils/toast';
import { RadioButtonGroup } from '@/components/common/RadioButtonGroup/RadioButtonGroup';
import { radioGroups } from './form.ds';

const formSchema = z.object(
  Object.fromEntries(
    radioGroups.map((group) => [
      group.name,
      group.required ? z.string().min(1, 'Campo obrigatório') : z.string().optional(),
    ])
  )
);

export const HousingConditions = ({ label }: { label: string }) => {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: Object.fromEntries(radioGroups.map((group) => [group.name, ''])),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    try {
      console.log('Dados enviados:', data);
      toast.success('Sucesso!', 'Condições de moradia salvas com sucesso!');
    } catch (error) {
      console.error('Erro no processamento:', error);
      toast.error('Erro', 'Ocorreu um erro ao salvar as condições de moradia.');
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-6xl mx-auto bg-white p-6">
        <h1 className="text-2xl font-semibold text-gray-700 text-center m-6">{label}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {radioGroups.map((group) => (
              <div key={group.name} className="border-b pb-6">
                <RadioButtonGroup
                  name={group.name}
                  label={group.label}
                  required={group.required}
                  options={group.options}
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
