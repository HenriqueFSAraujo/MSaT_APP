// src/mock/usersMock.ts
export type usersMockProps = {
  id: string
  fullName: string
  email: string
  cpf: string
  role: string
  status: string
}

const usersMock = [
  {
    id: 1,
    fullName: 'Ana Souza',
    email: 'ana@example.com',
    cpf: '12345678901',
    role: 'gestor',
    status: 'ativo',
  },
  {
    id: 2,
    fullName: 'Ana Souza',
    email: 'ana@example.com',
    cpf: '12345678901',
    role: 'gestor',
    status: 'ativo',
  },
  {
    id: 3,
    fullName: 'Ana Souza',
    email: 'ana@example.com',
    cpf: '12345678901',
    role: 'gestor',
    status: 'inativo',
  },
  {
    id: 4,
    fullName: 'Ana Souza',
    email: 'ana@example.com',
    cpf: '12345678901',
    role: 'gestor',
    status: 'ativo',
  },
  {
    id: 5,
    fullName: 'Ana Souza',
    email: 'ana@example.com',
    cpf: '12345678901',
    role: 'gestor',
    status: 'inativo',
  },
  {
    id: 6,
    fullName: 'Ana Souza',
    email: 'ana@example.com',
    cpf: '12345678901',
    role: 'gestor',
    status: 'inativo',
  },
  {
    id: 7,
    fullName: 'Ana Souza',
    email: 'ana@example.com',
    cpf: '12345678901',
    role: 'gestor',
    status: 'ativo',
  },
];


const params = {
  relacao: [
    {id: ""},
    {
      marca: "",
      ano_fabricacao: "",
      utilizacao: "",
    },
    {
      marca: "",
      ano_fabricacao: "",
      utilizacao: "",
    },
    {
      marca: "",
      ano_fabricacao: "",
      utilizacao: "",
    }
  ]
}

export default usersMock;
