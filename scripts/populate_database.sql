-- Script para popular o banco de dados TourGuide CRM
-- Executar: sqlite3 tmp/turguide.db < scripts/populate_database.sql

-- Limpar dados existentes (opcional - descomente se quiser resetar)
-- DELETE FROM avaliacoes;
-- DELETE FROM transacoes;
-- DELETE FROM agendamentos;
-- DELETE FROM clientes;
-- DELETE FROM guias;
-- DELETE FROM passeios;

-- Inserir Passeios
INSERT OR REPLACE INTO passeios (id, nome, descricao, preco, duracao, categoria, imagens, inclusoes, idiomas, capacidade_maxima, ativo) VALUES
('passeio-001', 'City Tour Histórico', 'Explore o centro histórico da cidade com guias especializados em história e arquitetura. Visite monumentos, igrejas e praças centenárias.', 150.00, '4h', 'Histórico', '["https://exemplo.com/imagem1.jpg", "https://exemplo.com/imagem2.jpg"]', '["Guia especializado", "Transporte", "Água", "Mapa turístico"]', '["Português", "Inglês", "Espanhol"]', 15, 1),
('passeio-002', 'Aventura na Natureza', 'Passeio emocionante pelo parque nacional com trilhas, cachoeiras e observação de fauna local. Ideal para amantes da natureza.', 280.00, '8h', 'Aventura', '["https://exemplo.com/imagem3.jpg", "https://exemplo.com/imagem4.jpg"]', '["Guia especializado", "Equipamentos de segurança", "Lanche", "Seguro"]', '["Português", "Inglês"]', 12, 1),
('passeio-003', 'Tour Gastronômico', 'Descubra os sabores locais em um tour pelos melhores restaurantes, mercados e bares da cidade. Degustação incluída.', 200.00, '5h', 'Gastronômico', '["https://exemplo.com/imagem5.jpg", "https://exemplo.com/imagem6.jpg"]', '["Guia especializado", "Degustações", "Água", "Aperitivos"]', '["Português", "Inglês", "Espanhol"]', 10, 1),
('passeio-004', 'Passeio Cultural', 'Imersão na cultura local através de museus, galerias de arte e centros culturais. Conheça a história e arte da região.', 180.00, '6h', 'Cultural', '["https://exemplo.com/imagem7.jpg", "https://exemplo.com/imagem8.jpg"]', '["Guia especializado", "Ingressos", "Água", "Material informativo"]', '["Português", "Inglês"]', 20, 1),
('passeio-005', 'Vida Noturna Premium', 'Explore a vida noturna da cidade com acesso VIP aos melhores bares, casas noturnas e shows ao vivo.', 250.00, '6h', 'Romântico', '["https://exemplo.com/imagem9.jpg", "https://exemplo.com/imagem10.jpg"]', '["Guia especializado", "Ingressos VIP", "Bebidas", "Transporte noturno"]', '["Português", "Inglês"]', 8, 1),
('passeio-006', 'Tour pelo Centro Histórico', 'Passeio compacto pelo centro histórico, ideal para quem tem pouco tempo mas quer conhecer os principais pontos.', 75.00, '3h', 'Histórico', '["https://exemplo.com/imagem11.jpg"]', '["Guia especializado", "Água", "Mapa turístico"]', '["Português", "Inglês"]', 25, 1),
('passeio-007', 'Aventura na Floresta', 'Trilha pela floresta com observação de pássaros, plantas nativas e cachoeiras escondidas.', 120.00, '6h', 'Natureza', '["https://exemplo.com/imagem12.jpg", "https://exemplo.com/imagem13.jpg"]', '["Guia especializado", "Binóculos", "Lanche", "Seguro"]', '["Português"]', 15, 1),
('passeio-008', 'Tour Gastronômico', 'Tour pelos mercados tradicionais e restaurantes locais, conhecendo a culinária típica da região.', 95.00, '4h', 'Gastronômico', '["https://exemplo.com/imagem14.jpg"]', '["Guia especializado", "Degustações", "Água"]', '["Português", "Inglês"]', 12, 1);

-- Inserir Guias
INSERT OR REPLACE INTO guias (id, nome, email, telefone, cpf, especialidades, idiomas, avaliacao_media, total_avaliacoes, passeios_realizados, comissao_total, percentual_comissao, biografia, foto, status) VALUES
('guia-001', 'Mariana Silva', 'mariana.silva@tourguide.com', '+55 11 91234-5678', '123.456.789-01', 'História, Arquitetura', '["Português", "Inglês", "Espanhol"]', 4.8, 45, 120, 5400.00, 30, 'Guia especializada em história e arquitetura com 5 anos de experiência. Apaixonada por contar histórias e mostrar os detalhes que fazem cada lugar único.', 'https://exemplo.com/foto1.jpg', 'ativo'),
('guia-002', 'Carlos Eduardo', 'carlos.eduardo@tourguide.com', '+55 21 92345-6789', '234.567.890-12', 'Aventura, Natureza', '["Português", "Inglês"]', 4.9, 38, 95, 4560.00, 30, 'Guia de aventura com certificação em primeiros socorros e experiência em trilhas. Especialista em ecoturismo e observação de fauna.', 'https://exemplo.com/foto2.jpg', 'ativo'),
('guia-003', 'Ana Paula Costa', 'ana.paula@tourguide.com', '+55 85 93456-7890', '345.678.901-23', 'Gastronomia, Cultura', '["Português", "Inglês", "Espanhol", "Francês"]', 4.7, 52, 150, 7800.00, 30, 'Chef de formação, Ana é especialista em gastronomia local e internacional. Conhece todos os melhores restaurantes e mercados da cidade.', 'https://exemplo.com/foto3.jpg', 'ativo'),
('guia-004', 'Roberto Lima', 'roberto.lima@tourguide.com', '+55 31 94567-8901', '456.789.012-34', 'História, Arte', '["Português", "Inglês"]', 4.6, 29, 78, 3120.00, 30, 'Historiador e artista plástico, Roberto tem conhecimento profundo sobre arte, história e cultura local. Guia experiente com 3 anos de atuação.', 'https://exemplo.com/foto4.jpg', 'ativo'),
('guia-005', 'Fernanda Santos', 'fernanda.santos@tourguide.com', '+55 47 95678-9012', '567.890.123-45', 'Vida Noturna, Entretenimento', '["Português", "Inglês"]', 4.8, 41, 110, 5280.00, 30, 'Especialista em vida noturna e entretenimento. Conhece todos os melhores bares, casas noturnas e eventos da cidade.', 'https://exemplo.com/foto5.jpg', 'ativo'),
('guia-006', 'Thiago Almeida', 'thiago.almeida@tourguide.com', '+55 11 96789-0123', '678.901.234-56', 'Fotografia, Natureza', '["Português", "Inglês"]', 4.5, 23, 65, 2340.00, 30, 'Fotógrafo profissional e guia de natureza. Especialista em fotografia de paisagem e observação de pássaros.', 'https://exemplo.com/foto6.jpg', 'ativo'),
('guia-007', 'Camila Ferreira', 'camila.ferreira@tourguide.com', '+55 21 97890-1234', '789.012.345-67', 'Gastronomia, Mercados', '["Português", "Inglês", "Espanhol"]', 4.7, 35, 88, 3696.00, 30, 'Especialista em mercados tradicionais e culinária local. Conhece todos os segredos dos melhores ingredientes e receitas tradicionais.', 'https://exemplo.com/foto7.jpg', 'ativo'),
('guia-008', 'Diego Costa', 'diego.costa@tourguide.com', '+55 85 98901-2345', '890.123.456-78', 'História, Arquitetura', '["Português", "Inglês"]', 4.4, 19, 52, 1872.00, 30, 'Arquiteto de formação, Diego é especialista em arquitetura histórica e moderna. Guia com 2 anos de experiência.', 'https://exemplo.com/foto8.jpg', 'ativo');

-- Inserir Clientes
INSERT OR REPLACE INTO clientes (id, nome, email, telefone, cpf, data_nascimento, endereco, preferencias, observacoes, status) VALUES
('cliente-001', 'Lucas Almeida', 'lucas.almeida@tourguide.com', '+55 11 91234-5678', '111.222.333-44', '1990-05-15', 'Rua das Flores, 123 - São Paulo, SP', '["História", "Cultura"]', 'Cliente VIP, sempre pontual', 'ativo'),
('cliente-002', 'Carla Moreira', 'carla.moreira@tourguide.com', '+55 21 92345-6789', '222.333.444-55', '1985-08-22', 'Av. Copacabana, 456 - Rio de Janeiro, RJ', '["Gastronomia", "Vinhos"]', 'Interessada em tours gastronômicos', 'ativo'),
('cliente-003', 'Rafael Santos', 'rafael.santos@tourguide.com', '+55 85 93456-7890', '333.444.555-66', '1992-03-10', 'Rua do Sol, 789 - Fortaleza, CE', '["Aventura", "Natureza"]', 'Prefere passeios ao ar livre', 'ativo'),
('cliente-004', 'Beatriz Ferreira', 'beatriz.ferreira@tourguide.com', '+55 31 94567-8901', '444.555.666-77', '1988-12-05', 'Rua da Liberdade, 321 - Belo Horizonte, MG', '["História", "Arquitetura"]', 'Historiadora, muito interessada em detalhes', 'ativo'),
('cliente-005', 'Diego Costa', 'diego.costa@tourguide.com', '+55 47 95678-9012', '555.666.777-88', '1995-07-18', 'Rua das Palmeiras, 654 - Blumenau, SC', '["Cultura", "Gastronomia"]', 'Fotógrafo amador', 'ativo'),
('cliente-006', 'Patricia Alves', 'patricia.alves@tourguide.com', '+55 11 96789-0123', '666.777.888-99', '1983-11-30', 'Rua Augusta, 987 - São Paulo, SP', '["Romântico", "História"]', 'Prefere passeios românticos', 'ativo'),
('cliente-007', 'Marcos Silva', 'marcos.silva@tourguide.com', '+55 21 97890-1234', '777.888.999-00', '1991-04-12', 'Rua do Ouvidor, 147 - Rio de Janeiro, RJ', '["Aventura", "Esportes"]', 'Atleta, gosta de desafios', 'ativo'),
('cliente-008', 'Ana Paula', 'ana.paula@tourguide.com', '+55 85 98901-2345', '888.999.000-11', '1987-09-25', 'Rua das Dunas, 258 - Fortaleza, CE', '["Cultura", "Arte"]', 'Artista plástica', 'ativo'),
('cliente-009', 'Roberto Lima', 'roberto.lima@tourguide.com', '+55 31 99012-3456', '999.000.111-22', '1993-01-08', 'Rua da Serra, 369 - Belo Horizonte, MG', '["Gastronomia", "História"]', 'Chef de cozinha', 'ativo'),
('cliente-010', 'Fernanda Costa', 'fernanda.costa@tourguide.com', '+55 47 90123-4567', '000.111.222-33', '1989-06-14', 'Rua das Bromélias, 741 - Blumenau, SC', '["Natureza", "Fotografia"]', 'Fotógrafa profissional', 'ativo'),
('cliente-011', 'Carlos Eduardo', 'carlos.eduardo@tourguide.com', '+55 11 91234-5679', '111.222.333-55', '1986-02-20', 'Rua dos Ipês, 852 - São Paulo, SP', '["História", "Arquitetura"]', 'Arquiteto', 'ativo'),
('cliente-012', 'Juliana Santos', 'juliana.santos@tourguide.com', '+55 21 92345-6780', '222.333.444-66', '1994-10-03', 'Rua das Acácias, 963 - Rio de Janeiro, RJ', '["Cultura", "Gastronomia"]', 'Jornalista gastronômica', 'ativo'),
('cliente-013', 'Ricardo Oliveira', 'ricardo.oliveira@tourguide.com', '+55 85 93456-7891', '333.444.555-77', '1990-12-17', 'Rua dos Coqueiros, 159 - Fortaleza, CE', '["Aventura", "Esportes"]', 'Instrutor de esportes radicais', 'ativo'),
('cliente-014', 'Mariana Silva', 'mariana.silva@tourguide.com', '+55 31 94567-8902', '444.555.666-88', '1984-07-29', 'Rua das Orquídeas, 753 - Belo Horizonte, MG', '["Romântico", "História"]', 'Prefere passeios tranquilos', 'ativo'),
('cliente-015', 'Thiago Almeida', 'thiago.almeida@tourguide.com', '+55 47 95678-9013', '555.666.777-99', '1996-05-11', 'Rua das Azaleias, 951 - Blumenau, SC', '["Natureza", "Fotografia"]', 'Estudante de biologia', 'ativo'),
('cliente-016', 'Camila Ferreira', 'camila.ferreira@tourguide.com', '+55 11 96789-0124', '666.777.888-00', '1982-08-07', 'Rua dos Jasmins, 357 - São Paulo, SP', '["Gastronomia", "Vinhos"]', 'Sommelier', 'ativo');

-- Inserir Agendamentos
INSERT OR REPLACE INTO agendamentos (id, passeio_id, cliente_id, guia_id, data_passeio, horario_inicio, horario_fim, numero_pessoas, valor_total, valor_comissao, percentual_comissao, status, observacoes) VALUES
('agend-001', 'passeio-001', 'cliente-001', 'guia-001', '2024-01-15', '09:00', '13:00', 2, 300.00, 90.00, 30, 'concluido', 'Cliente muito satisfeito'),
('agend-002', 'passeio-002', 'cliente-003', 'guia-002', '2024-01-20', '08:00', '16:00', 1, 280.00, 84.00, 30, 'concluido', 'Passeio cancelado por chuva'),
('agend-003', 'passeio-003', 'cliente-002', 'guia-003', '2024-01-25', '14:00', '19:00', 3, 600.00, 180.00, 30, 'concluido', 'Excelente experiência gastronômica'),
('agend-004', 'passeio-004', 'cliente-004', 'guia-004', '2024-02-01', '10:00', '16:00', 2, 360.00, 108.00, 30, 'concluido', 'Cliente muito interessado em história'),
('agend-005', 'passeio-005', 'cliente-006', 'guia-005', '2024-02-10', '20:00', '02:00', 2, 500.00, 150.00, 30, 'concluido', 'Passeio romântico muito bem avaliado'),
('agend-006', 'passeio-006', 'cliente-011', 'guia-001', '2024-02-15', '14:00', '17:00', 1, 75.00, 22.50, 30, 'concluido', 'Passeio rápido mas informativo'),
('agend-007', 'passeio-007', 'cliente-010', 'guia-006', '2024-02-20', '07:00', '13:00', 2, 240.00, 72.00, 30, 'concluido', 'Fotógrafa capturou belas imagens'),
('agend-008', 'passeio-008', 'cliente-009', 'guia-007', '2024-02-25', '09:00', '13:00', 1, 95.00, 28.50, 30, 'concluido', 'Chef muito interessado nos ingredientes'),
('agend-009', 'passeio-001', 'cliente-012', 'guia-001', '2024-03-01', '09:00', '13:00', 2, 300.00, 90.00, 30, 'em_progresso', 'Agendamento confirmado'),
('agend-010', 'passeio-003', 'cliente-016', 'guia-003', '2024-03-05', '14:00', '19:00', 2, 400.00, 120.00, 30, 'em_progresso', 'Sommelier, interesse especial em vinhos'),
('agend-011', 'passeio-002', 'cliente-013', 'guia-002', '2024-03-10', '08:00', '16:00', 1, 280.00, 84.00, 30, 'pendente', 'Aguardando confirmação'),
('agend-012', 'passeio-004', 'cliente-005', 'guia-004', '2024-03-15', '10:00', '16:00', 1, 180.00, 54.00, 30, 'pendente', 'Fotógrafo amador'),
('agend-013', 'passeio-005', 'cliente-014', 'guia-005', '2024-03-20', '20:00', '02:00', 2, 500.00, 150.00, 30, 'pendente', 'Passeio romântico'),
('agend-014', 'passeio-007', 'cliente-015', 'guia-006', '2024-03-25', '07:00', '13:00', 1, 120.00, 36.00, 30, 'pendente', 'Estudante de biologia'),
('agend-015', 'passeio-008', 'cliente-007', 'guia-007', '2024-03-30', '09:00', '13:00', 1, 95.00, 28.50, 30, 'pendente', 'Atleta, interesse em ingredientes saudáveis');

-- Inserir Avaliações
INSERT OR REPLACE INTO avaliacoes (id, agendamento_id, cliente_id, guia_id, passeio_id, nota, comentario, aspectos, recomenda) VALUES
('aval-001', 'agend-001', 'cliente-001', 'guia-001', 'passeio-001', 5, 'Excelente passeio! A guia Mariana é muito conhecedora e apaixonada pela história da cidade.', '["Conhecimento", "Pontualidade", "Simpatia"]', 1),
('aval-002', 'agend-003', 'cliente-002', 'guia-003', 'passeio-003', 5, 'Tour gastronômico incrível! Ana conhece todos os melhores lugares e tem conhecimento profundo sobre culinária.', '["Conhecimento", "Organização", "Experiência"]', 1),
('aval-003', 'agend-004', 'cliente-004', 'guia-004', 'passeio-004', 4, 'Passeio cultural muito interessante. Roberto tem conhecimento profundo sobre arte e história.', '["Conhecimento", "Pontualidade"]', 1),
('aval-004', 'agend-005', 'cliente-006', 'guia-005', 'passeio-005', 5, 'Passeio romântico perfeito! Fernanda nos levou aos melhores lugares da vida noturna.', '["Organização", "Simpatia", "Conhecimento"]', 1),
('aval-005', 'agend-006', 'cliente-011', 'guia-001', 'passeio-006', 4, 'Passeio rápido mas muito informativo. Ideal para quem tem pouco tempo.', '["Eficiência", "Conhecimento"]', 1),
('aval-006', 'agend-007', 'cliente-010', 'guia-006', 'passeio-007', 5, 'Passeio na natureza espetacular! Thiago é excelente fotógrafo e conhece todos os melhores pontos.', '["Conhecimento", "Fotografia", "Segurança"]', 1),
('aval-007', 'agend-008', 'cliente-009', 'guia-007', 'passeio-008', 5, 'Tour pelos mercados foi incrível! Camila conhece todos os melhores ingredientes e fornecedores.', '["Conhecimento", "Organização", "Experiência"]', 1);

-- Inserir Transações
INSERT OR REPLACE INTO transacoes (id, agendamento_id, tipo, valor, status, metodo_pagamento, data_vencimento, data_pagamento, observacoes) VALUES
('trans-001', 'agend-001', 'pagamento', 300.00, 'pago', 'cartao_credito', '2024-01-10', '2024-01-10', 'Pagamento antecipado'),
('trans-002', 'agend-002', 'reembolso', 280.00, 'pago', 'transferencia', '2024-01-22', '2024-01-22', 'Reembolso por cancelamento'),
('trans-003', 'agend-003', 'pagamento', 600.00, 'pago', 'pix', '2024-01-20', '2024-01-20', 'Pagamento via PIX'),
('trans-004', 'agend-004', 'pagamento', 360.00, 'pago', 'cartao_credito', '2024-01-28', '2024-01-28', 'Pagamento parcelado'),
('trans-005', 'agend-005', 'pagamento', 500.00, 'pago', 'dinheiro', '2024-02-08', '2024-02-08', 'Pagamento em dinheiro'),
('trans-006', 'agend-006', 'pagamento', 75.00, 'pago', 'pix', '2024-02-12', '2024-02-12', 'Pagamento instantâneo'),
('trans-007', 'agend-007', 'pagamento', 240.00, 'pago', 'cartao_debito', '2024-02-18', '2024-02-18', 'Pagamento com cartão de débito'),
('trans-008', 'agend-008', 'pagamento', 95.00, 'pago', 'pix', '2024-02-22', '2024-02-22', 'Pagamento via PIX'),
('trans-009', 'agend-009', 'pagamento', 300.00, 'pendente', 'cartao_credito', '2024-02-28', NULL, 'Aguardando pagamento'),
('trans-010', 'agend-010', 'pagamento', 400.00, 'pendente', 'pix', '2024-03-02', NULL, 'Aguardando pagamento'),
('trans-011', 'agend-011', 'pagamento', 280.00, 'pendente', 'cartao_credito', '2024-03-07', NULL, 'Aguardando confirmação'),
('trans-012', 'agend-012', 'pagamento', 180.00, 'pendente', 'pix', '2024-03-12', NULL, 'Aguardando pagamento'),
('trans-013', 'agend-013', 'pagamento', 500.00, 'pendente', 'cartao_credito', '2024-03-17', NULL, 'Aguardando pagamento'),
('trans-014', 'agend-014', 'pagamento', 120.00, 'pendente', 'pix', '2024-03-22', NULL, 'Aguardando pagamento'),
('trans-015', 'agend-015', 'pagamento', 95.00, 'pendente', 'cartao_debito', '2024-03-27', NULL, 'Aguardando pagamento');

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data_passeio);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_agendamentos_cliente ON agendamentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_guia ON agendamentos(guia_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_passeio ON agendamentos(passeio_id);

CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_status ON clientes(status);

CREATE INDEX IF NOT EXISTS idx_guias_email ON guias(email);
CREATE INDEX IF NOT EXISTS idx_guias_status ON guias(status);
CREATE INDEX IF NOT EXISTS idx_guias_avaliacao ON guias(avaliacao_media);

CREATE INDEX IF NOT EXISTS idx_passeios_categoria ON passeios(categoria);
CREATE INDEX IF NOT EXISTS idx_passeios_ativo ON passeios(ativo);

CREATE INDEX IF NOT EXISTS idx_transacoes_status ON transacoes(status);
CREATE INDEX IF NOT EXISTS idx_transacoes_data_pagamento ON transacoes(data_pagamento);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_nota ON avaliacoes(nota);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_guia ON avaliacoes(guia_id);

-- Atualizar estatísticas dos guias
UPDATE guias SET 
    passeios_realizados = (
        SELECT COUNT(*) FROM agendamentos 
        WHERE guia_id = guias.id AND status = 'concluido'
    ),
    comissao_total = (
        SELECT COALESCE(SUM(valor_comissao), 0) FROM agendamentos 
        WHERE guia_id = guias.id AND status = 'concluido'
    ),
    avaliacao_media = (
        SELECT COALESCE(AVG(nota), 0) FROM avaliacoes 
        WHERE guia_id = guias.id
    ),
    total_avaliacoes = (
        SELECT COUNT(*) FROM avaliacoes 
        WHERE guia_id = guias.id
    );

-- Verificar dados inseridos
SELECT 'Passeios' as tabela, COUNT(*) as total FROM passeios
UNION ALL
SELECT 'Guias', COUNT(*) FROM guias
UNION ALL
SELECT 'Clientes', COUNT(*) FROM clientes
UNION ALL
SELECT 'Agendamentos', COUNT(*) FROM agendamentos
UNION ALL
SELECT 'Avaliações', COUNT(*) FROM avaliacoes
UNION ALL
SELECT 'Transações', COUNT(*) FROM transacoes;
