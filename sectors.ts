export type Sector = {
  id: string;
  name: string;
  label: string;
  description: string;
  responsibilities: string[];
  team: string[];
  color: string;
};

export const sectors: Sector[] = [
  {
    id: 'adm',
    name: 'Administração',
    label: 'Gestão administrativa',
    description: 'Apoio administrativo e organização das demandas internas da Assessoria.',
    responsibilities: [
      'Organizar e acompanhar demandas administrativas.',
      'Manter registros e informações do setor atualizados.',
      'Apoiar o planejamento e o acompanhamento das atividades.',
    ],
    team: [],
    color: '#c83a42',
  },
  {
    id: 'sistemas',
    name: 'Sistemas',
    label: 'Desenvolvimento e sustentação',
    description: 'Desenvolvimento, manutenção e evolução dos sistemas institucionais.',
    responsibilities: [
      'Levantar requisitos e documentar necessidades.',
      'Desenvolver e manter aplicações institucionais.',
      'Apoiar testes, homologação e correção de falhas.',
    ],
    team: [],
    color: '#4779bd',
  },
  {
    id: 'infra',
    name: 'Infraestrutura',
    label: 'Redes e equipamentos',
    description: 'Apoio à infraestrutura tecnológica, redes, equipamentos e serviços.',
    responsibilities: [
      'Acompanhar a disponibilidade dos recursos tecnológicos.',
      'Apoiar a configuração e manutenção de equipamentos.',
      'Registrar incidentes e acompanhar sua resolução.',
    ],
    team: [],
    color: '#2b9c83',
  },
  {
    id: 'suporte',
    name: 'Suporte Técnico',
    label: 'Atendimento ao usuário',
    description: 'Atendimento técnico e orientação aos usuários dos recursos de TI.',
    responsibilities: [
      'Receber e classificar solicitações de suporte.',
      'Orientar usuários e registrar soluções aplicadas.',
      'Encaminhar incidentes especializados quando necessário.',
    ],
    team: [],
    color: '#d49b36',
  },
  {
    id: 'contratos',
    name: 'Contratos',
    label: 'Gestão e fiscalização',
    description: 'Acompanhamento administrativo e apoio à fiscalização dos contratos de TI.',
    responsibilities: [
      'Organizar documentos e informações contratuais.',
      'Apoiar o acompanhamento de prazos, entregas e obrigações.',
      'Registrar pendências e encaminhamentos relacionados aos contratos.',
    ],
    team: [],
    color: '#8a6ac8',
  },
];