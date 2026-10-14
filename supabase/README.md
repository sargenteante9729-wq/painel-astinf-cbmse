# Banco de dados do Painel ASTINF/CBMSE

## Etapa 1: criar a estrutura

1. Crie um projeto no Supabase usando uma conta institucional autorizada.
2. Abra **SQL Editor** no painel do projeto.
3. Abra o arquivo `schema.sql` deste diretório, copie o conteúdo e execute-o no projeto.
4. Confira em **Table Editor** se foram criadas as tabelas `sectors`, `activities`, `team_members`, `systems`, `activity_systems` e `user_roles`.
5. Confirme que os cinco setores iniciais foram inseridos. As atividades oficiais não são semeadas automaticamente para evitar publicar exemplos como se fossem atribuições validadas.

## Tabelas

- **sectors**: nome, descrição, finalidade, ordem e situação do setor.
- **activities**: atividades associadas a um setor, descrição e situação.
- **team_members**: integrantes e funções que a instituição autorizar divulgar.
- **systems**: sistemas atendidos.
- **activity_systems**: relação entre atividades e sistemas.
- **user_roles**: autorização administrativa ligada ao usuário do Supabase Auth.

## Segurança

- O visitante pode consultar somente registros ativos.
- Alterações nas tabelas de conteúdo exigem usuário autenticado que tenha o papel `admin` em `user_roles`.
- Não habilite cadastro público de usuários administrativos.
- Nunca coloque a chave `service_role` no frontend ou no repositório.
- As políticas RLS precisam permanecer habilitadas.

## Criar o primeiro administrador

1. Em **Authentication > Users**, crie o usuário administrador usando e-mail institucional autorizado.
2. Copie o UUID desse usuário.
3. No SQL Editor, execute a instrução abaixo, substituindo o UUID pelo valor real:

```sql
insert into public.user_roles (user_id, role)
values ('COLE-AQUI-O-UUID-REAL', 'admin');
```

Execute essa instrução como proprietário do projeto. Não compartilhe a senha nem o UUID em páginas públicas.

## Observação

Esta etapa prepara o modelo de dados e as políticas. Ainda não conecta o frontend ao Supabase nem cria as telas administrativas; isso será feito na etapa seguinte, após confirmar que o projeto e as tabelas estão configurados.
