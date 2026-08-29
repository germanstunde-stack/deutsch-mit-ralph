-- Nível de início escolhido no cadastro (A0, A1, A2...). Usado junto com a
-- nota da Prova (exam_results) pra calcular quais módulos o usuário já pode
-- acessar: começa liberado a partir daqui, e só avança se tirar >=96% na
-- Prova do módulo atual (lógica calculada no cliente, sem view nova).
alter table public.profiles add column if not exists starting_level text;
