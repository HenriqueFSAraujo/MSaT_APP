import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface ScholarshipProcessInfoProps {
  onNext: () => void;
  onBack: () => void;
}

export const ScholarshipProcessInfo: React.FC<ScholarshipProcessInfoProps> = ({ onNext, onBack }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Informações do Processo de Bolsa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scholarshipType">Tipo de Bolsa</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de bolsa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Acadêmica</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="research">Pesquisa</SelectItem>
                <SelectItem value="extension">Extensão</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scholarshipValue">Valor da Bolsa</Label>
            <Input id="scholarshipValue" type="number" placeholder="R$ 0,00" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Data de Início</Label>
            <Input id="startDate" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Data de Término</Label>
            <Input id="endDate" type="date" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" placeholder="Descreva o processo de bolsa..." />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="active" />
            <Label htmlFor="active">Bolsa Ativa</Label>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button onClick={onNext}>
            Próximo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 