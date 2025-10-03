INSERT INTO users (id, email, nome, user_type, password_hash, status)
VALUES
  ('user_admin', 'admin@turguide.com', 'Administrador', 'admin', crypt('admin123', gen_salt('bf')), 'ativo'),
  ('user_guia', 'guia@turguide.com', 'Guia Demo', 'guia', crypt('guia123', gen_salt('bf')), 'ativo'),
  ('user_cliente', 'cliente@turguide.com', 'Cliente Demo', 'cliente', crypt('cliente123', gen_salt('bf')), 'ativo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO passeios (id, nome, descricao, preco, duracao, categoria, imagens, inclusoes, idiomas, capacidade_maxima, ativo)
VALUES
  ('1', 'Roma Histórica', 'Tour pelos pontos históricos de Roma incluindo Coliseu, Fórum Romano e Pantheon', 120, '4h', 'História', '["/images/roma1.jpg", "/images/roma2.jpg"]', '["Guia especializado", "Entrada nos monumentos", "Transporte"]', '["Português", "Italiano", "Inglês"]', 15, 1),
  ('2', 'Aventura na Trilha', 'Trilha nas montanhas italianas com vista espetacular e experiência única na natureza', 200, '6h', 'Aventura', '["/images/trilha1.jpg", "/images/trilha2.jpg"]', '["Equipamentos de segurança", "Lanche", "Guia especializado"]', '["Português", "Italiano", "Espanhol"]', 8, 1),
  ('3', 'Florença Renascentista', 'Explore a arte e cultura de Florença com visitas aos principais museus e galerias', 150, '5h', 'Arte', '["/images/florenca1.jpg", "/images/florenca2.jpg"]', '["Entrada nos museus", "Guia especialista em arte", "Audioguia"]', '["Português", "Italiano", "Francês"]', 12, 1),
  ('4', 'Veneza Romântica', 'Passeio romântico pelos canais de Veneza com gôndola e jantar especial', 180, '3h', 'Romance', '["/images/veneza1.jpg", "/images/veneza2.jpg"]', '["Passeio de gôndola", "Jantar romântico", "Guia local"]', '["Português", "Italiano", "Inglês"]', 6, 1),
  ('5', 'Culinária Toscana', 'Experiência gastronômica completa com aula de culinária e degustação de vinhos', 250, '8h', 'Gastronomia', '["/images/toscana1.jpg", "/images/toscana2.jpg"]', '["Aula de culinária", "Degustação de vinhos", "Almoço completo", "Receitas"]', '["Português", "Italiano"]', 10, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO clientes (id, nome, email, telefone, cpf, endereco, preferencias, observacoes, status)
VALUES
  ('1', 'Maria Silva', 'maria.silva@email.com', '+55 11 99999-0001', '123.456.789-01', '{"rua":"Rua das Flores, 123","cidade":"São Paulo","estado":"SP","cep":"01234-567","pais":"Brasil"}', '["História","Arte","Cultura"]', 'Cliente VIP, prefere passeios culturais', 'ativo'),
  ('2', 'João Santos', 'joao.santos@email.com', '+55 11 99999-0002', '234.567.890-12', '{"rua":"Avenida Paulista, 456","cidade":"São Paulo","estado":"SP","cep":"01311-000","pais":"Brasil"}', '["Arte","Museus","Fotografia"]', 'Fotógrafo profissional', 'ativo'),
  ('3', 'Ana Costa', 'ana.costa@email.com', '+55 21 99999-0003', '345.678.901-23', '{"rua":"Rua das Palmeiras, 789","cidade":"Rio de Janeiro","estado":"RJ","cep":"22070-000","pais":"Brasil"}', '["Aventura","Natureza","Esportes"]', 'Gosta de atividades ao ar livre', 'ativo'),
  ('4', 'Carlos Oliveira', 'carlos.oliveira@email.com', '+55 11 99999-0004', '456.789.012-34', '{"rua":"Rua dos Jardins, 321","cidade":"São Paulo","estado":"SP","cep":"01234-890","pais":"Brasil"}', '["Gastronomia","Vinhos","Cultura Local"]', 'Chef de cozinha, interesse em gastronomia', 'ativo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO guias (id, nome, email, telefone, cpf, especialidades, idiomas, avaliacao_media, total_avaliacoes, passeios_realizados, comissao_total, percentual_comissao, biografia, status, data_registro)
VALUES
  ('1', 'Marco Rossi', 'marco.rossi@email.com', '+39 333 123 4567', '111.222.333-44', '["História","Arte","Culinária"]', '["Português","Italiano","Inglês"]', 4.9, 127, 89, 12450, 35, 'Guia especializado em história romana com 10 anos de experiência', 'ativo', '2024-03-15T00:00:00Z'),
  ('2', 'Giulia Ferrari', 'giulia.ferrari@email.com', '+39 344 987 6543', '222.333.444-55', '["Aventura","Natureza","Fotografia"]', '["Português","Italiano","Espanhol"]', 4.8, 98, 67, 8930, 30, 'Especialista em trilhas e aventuras na natureza italiana', 'ativo', '2024-05-22T00:00:00Z'),
  ('3', 'Alessandro Bianchi', 'alessandro.bianchi@email.com', '+39 320 555 7890', '333.444.555-66', '["Arte","Museus","Arquitetura"]', '["Português","Italiano","Francês"]', 4.7, 156, 123, 15670, 32, 'Historiador da arte especializado no período renascentista', 'ativo', '2024-01-08T00:00:00Z'),
  ('4', 'Sofia Romano', 'sofia.romano@email.com', '+39 331 444 2211', '444.555.666-77', '["Vinhos","Gastronomia","Tradições"]', '["Português","Italiano"]', 4.9, 89, 56, 7890, 28, 'Sommelier e chef especializada na culinária toscana tradicional', 'ativo', '2024-07-12T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO agendamentos (id, passeio_id, cliente_id, guia_id, data_passeio, numero_pessoas, valor_total, valor_comissao, percentual_comissao, status, observacoes)
VALUES
  ('1', '2', '1', '2', '2025-02-12', 2, 400, 160, 40, 'em_progresso', 'Lua de mel, querem experiência romântica'),
  ('2', '3', '2', '3', '2025-01-26', 8, 1440, 547, 38, 'pendente_cliente', 'Grupo de estudantes de arte'),
  ('3', '1', '3', '1', '2025-01-28', 4, 1000, 300, 30, 'confirmadas', 'Celebração de aniversário, preferem locais exclusivos'),
  ('4', '4', '4', '2', '2025-01-18', 3, 225, 101.25, 45, 'concluidas', 'Interesse especial em período colonial'),
  ('5', '5', '1', NULL, '2025-02-08', 3, 840, 0, 0, 'canceladas', 'Cancelado devido ao clima')
ON CONFLICT (id) DO NOTHING;

INSERT INTO transacoes (id, agendamento_id, tipo, valor, status, metodo_pagamento)
VALUES
  ('1', '1', 'receita', 400, 'pendente', 'cartao'),
  ('2', '1', 'comissao', 160, 'pendente', 'repasse'),
  ('3', '2', 'receita', 1440, 'pendente', 'pix'),
  ('4', '3', 'receita', 1000, 'pago', 'transferencia')
ON CONFLICT (id) DO NOTHING;
