interface User {
  id: number;
  fullName: string;
  cpf: string;
  email: string;
  status: string;
  role: string;
}

const usersMock: User[] = [
  {
    id: 1,
    fullName: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao.silva@email.com',
    status: 'ativo',
    role: 'Aluno'
  },
  {
    id: 2,
    fullName: 'Maria Santos',
    cpf: '987.654.321-00',
    email: 'maria.santos@email.com',
    status: 'ativo',
    role: 'Gestor'
  },
  {
    id: 3,
    fullName: 'Pedro Oliveira',
    cpf: '456.789.123-00',
    email: 'pedro.oliveira@email.com',
    status: 'inativo',
    role: 'Aluno'
  },
  {
    id: 4,
    fullName: 'Ana Costa',
    cpf: '789.123.456-00',
    email: 'ana.costa@email.com',
    status: 'ativo',
    role: 'Aluno'
  },
  {
    id: 5,
    fullName: 'Carlos Ferreira',
    cpf: '321.654.987-00',
    email: 'carlos.ferreira@email.com',
    status: 'inativo',
    role: 'Gestor'
  }
];

export default usersMock; 