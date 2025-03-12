import { AbilityBuilder, createMongoAbility, subject } from '@casl/ability';

/*
    Vamos definir que os termos:
    Get = read
    Post = create
    Put = update

    Ou seja caso um usuário tenha permissão de visualizar é o metodo get

*/

// const appAbilitiesSchema = z.union([

// ])

export function defineAbilitiesFor(role: string) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  subject('Vehicles', {
    Get: 'Get',
  });
  // console.log(role, "role")

  // if (role.includes('ROLE_ADMIN')) {
  //   can('Get', 'Dashboard');
  //   can('Get', 'Consulta');
  //   can('Get', 'Sair');
  //   can('Get', 'Mandatarios');
  //   can('Get', 'Cadastros');
  //   can('Get', 'User');
  //   can('Get', 'Menu');
  // } else if (role.includes('ROLE_AGENTE_OFICIAL')) {
  //   can('Get', 'Dashboard');
  //   can('Get', 'Cadastros');
  //   can('Get', 'Sair');
  // } else {
  can('Get', 'Dashboard');
  can('Get', 'Consulta');
  can('Get', 'Sair');
  can('Get', 'Mandatarios');
  can('Get', 'Cadastros');
  can('Get', 'User');
  can('Get', 'Menu');
  // }

  return build();
}
