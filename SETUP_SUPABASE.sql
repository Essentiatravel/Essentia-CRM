-- ============================================================================
-- SCRIPT DE CONFIGURAÇÃO COMPLETA DO BANCO DE DADOS - TURGUIDE
-- ============================================================================
--
-- INSTRUÇÕES:
-- 1. Acesse: https://supabase.com/dashboard
-- 2. Selecione seu projeto: nvviwqoxeznxpzitpwua
-- 3. Se o projeto estiver PAUSADO, clique em "Resume Project" e aguarde
-- 4. Vá em: SQL Editor (menu lateral esquerdo)
-- 5. Clique em "New Query"
-- 6. Cole TODO este script
-- 7. Clique em "Run" ou pressione Ctrl+Enter
--
-- ============================================================================

-- Limpar dados antigos (se existir)
DROP TABLE IF EXISTS passeios CASCADE;

-- ============================================================================
-- CRIAR TABELA DE PASSEIOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS passeios (
  id VARCHAR PRIMARY KEY,
  nome VARCHAR NOT NULL,
  descricao TEXT NOT NULL,
  preco REAL NOT NULL,
  duracao VARCHAR NOT NULL,
  categoria VARCHAR NOT NULL,
  imagens JSONB DEFAULT '[]'::jsonb,
  inclusoes JSONB DEFAULT '[]'::jsonb,
  idiomas JSONB DEFAULT '[]'::jsonb,
  capacidade_maxima INTEGER DEFAULT 20,
  ativo INTEGER DEFAULT 1,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_passeios_ativo ON passeios(ativo);
CREATE INDEX IF NOT EXISTS idx_passeios_categoria ON passeios(categoria);
CREATE INDEX IF NOT EXISTS idx_passeios_preco ON passeios(preco);

-- ============================================================================
-- INSERIR PASSEIOS DE DEMONSTRAÇÃO
-- ============================================================================

INSERT INTO passeios (id, nome, descricao, preco, duracao, categoria, imagens, inclusoes, idiomas, capacidade_maxima, ativo) VALUES

-- Passeio 1: Tour Paris Romântica
('paris-romantica-001',
 'Tour Paris Romântica',
 'Descubra os encantos de Paris com guias especializados. Visite a Torre Eiffel ao pôr do sol, passeie pelos Jardins de Luxemburgo e explore o icônico Museu do Louvre. Uma experiência inesquecível pela Cidade Luz!',
 450.00,
 '8 horas',
 'Romance',
 '["https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800"]'::jsonb,
 '["Guia especializado em português", "Transporte em ônibus de luxo", "Ingressos para Torre Eiffel", "Ingressos para Louvre", "Almoço incluído"]'::jsonb,
 '["Português", "Inglês", "Francês", "Espanhol"]'::jsonb,
 15,
 1),

-- Passeio 2: Aventura nos Alpes Suíços
('alpes-suicos-002',
 'Aventura nos Alpes Suíços',
 'Trilhas incríveis pelos Alpes Suíços com vistas espetaculares e natureza preservada. Explore montanhas nevadas, lagos cristalinos e vilas alpinas tradicionais. Inclui teleférico panorâmico e caminhadas guiadas.',
 680.00,
 '12 horas',
 'Aventura',
 '["https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"]'::jsonb,
 '["Guia de montanha certificado", "Equipamento completo de segurança", "Lanche e água", "Teleférico panorâmico", "Seguro de acidentes"]'::jsonb,
 '["Português", "Inglês", "Alemão"]'::jsonb,
 12,
 1),

-- Passeio 3: Gastronomia Italiana - Toscana
('toscana-gastronomia-003',
 'Tour Gastronômico pela Toscana',
 'Tour gastronômico pela Toscana com degustação de vinhos premiados e pratos típicos. Visite vinícolas familiares, aprenda sobre a produção de azeite e queijos, e saboreie a autêntica culinária toscana.',
 520.00,
 '10 horas',
 'Gastronomia',
 '["https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800", "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=800"]'::jsonb,
 '["Sommelier profissional", "Degustação de 8 vinhos", "Almoço típico toscano", "Visita a 3 vinícolas", "Degustação de azeites e queijos", "Transporte confortável"]'::jsonb,
 '["Português", "Italiano", "Inglês"]'::jsonb,
 10,
 1),

-- Passeio 4: História de Roma Antiga
('roma-historica-004',
 'História de Roma - Império Romano',
 'Explore o Coliseu, Fórum Romano e outros monumentos históricos com guias especializados em história antiga. Viaje no tempo e descubra os segredos do maior império da antiguidade.',
 380.00,
 '6 horas',
 'História',
 '["https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800", "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800"]'::jsonb,
 '["Historiador como guia", "Ingressos sem fila", "Fones de áudio", "Material didático ilustrado", "Água mineral"]'::jsonb,
 '["Português", "Inglês", "Espanhol", "Italiano"]'::jsonb,
 25,
 1),

-- Passeio 5: Arte e Cultura em Florença
('florenca-arte-005',
 'Arte e Cultura - Berço do Renascimento',
 'Visite os principais museus e galerias de arte de Florença. Conheça obras de Michelangelo, Leonardo da Vinci, Botticelli e outros mestres. Explore a Galeria Uffizi e a Academia.',
 420.00,
 '7 horas',
 'Cultural',
 '["https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=800", "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800"]'::jsonb,
 '["Historiador da arte", "Ingressos prioritários Uffizi", "Ingressos Galeria Academia", "Fones de áudio", "Guia ilustrado"]'::jsonb,
 '["Português", "Inglês", "Italiano"]'::jsonb,
 18,
 1),

-- Passeio 6: Natureza Selvagem - Safari Africano
('safari-africa-006',
 'Safari Fotográfico na África',
 'Explore parques nacionais e observe a fauna local em seu habitat natural. Veja leões, elefantes, girafas e muito mais! Inclui safari matinal e ao entardecer com guia especializado.',
 890.00,
 '2 dias',
 'Natureza',
 '["https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800", "https://images.unsplash.com/photo-1547970810-dc1e684f5f4d?w=800"]'::jsonb,
 '["Guia especializado em vida selvagem", "Jipe 4x4 especial para safari", "Binóculos profissionais", "Refeições completas", "Hospedagem em lodge", "Seguro completo"]'::jsonb,
 '["Português", "Inglês", "Francês"]'::jsonb,
 8,
 1),

-- Passeio 7: Santuários Religiosos - Santiago de Compostela
('santiago-compostela-007',
 'Caminho de Santiago - Experiência Espiritual',
 'Percorra os últimos 100km do famoso Caminho de Santiago. Uma jornada de autoconhecimento, fé e superação. Inclui hospedagem em albergues tradicionais e suporte completo.',
 750.00,
 '5 dias',
 'Religioso',
 '["https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800", "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800"]'::jsonb,
 '["Guia espiritual", "Hospedagem em albergues", "3 refeições diárias", "Transporte de bagagem", "Kit do peregrino", "Certificado oficial"]'::jsonb,
 '["Português", "Espanhol", "Inglês"]'::jsonb,
 20,
 1),

-- Passeio 8: Cruzeiro pelo Mediterrâneo
('cruzeiro-mediterraneo-008',
 'Cruzeiro de Luxo pelo Mediterrâneo',
 'Navegue por 7 dias visitando as mais belas cidades do Mediterrâneo: Barcelona, Marselha, Roma, Atenas e mais! Tudo incluso: refeições, entretenimento e excursões.',
 3200.00,
 '7 dias',
 'Romance',
 '["https://images.unsplash.com/photo-1545450660-f90f2ce1748a?w=800", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"]'::jsonb,
 '["Cabine com varanda", "Pensão completa", "Bebidas inclusas", "Excursões em cada porto", "Entretenimento noturno", "Academia e spa"]'::jsonb,
 '["Português", "Inglês", "Espanhol", "Italiano", "Francês"]'::jsonb,
 500,
 1),

-- Passeio 9: Expedição à Patagônia
('patagonia-expedicao-009',
 'Expedição Extrema - Patagônia Argentina',
 'Para os aventureiros de coração! Trekking no Glaciar Perito Moreno, escalada no Cerro Torre, e exploração de paisagens geladas. Uma experiência para poucos!',
 1450.00,
 '10 dias',
 'Aventura',
 '["https://images.unsplash.com/photo-1551632811-561732d1e306?w=800", "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800"]'::jsonb,
 '["Guia de alta montanha", "Equipamento técnico completo", "Hospedagem em refúgios", "Alimentação completa", "Seguro de resgate", "Transfer aeroporto"]'::jsonb,
 '["Português", "Espanhol", "Inglês"]'::jsonb,
 6,
 1),

-- Passeio 10: Culinária Japonesa - Tóquio
('toquio-culinaria-010',
 'Experiência Gastronômica em Tóquio',
 'Mergulhe na cultura culinária japonesa! Visite o famoso mercado de Tsukiji, aprenda a fazer sushi com chefs mestres, explore restaurantes tradicionais e modernos.',
 580.00,
 '8 horas',
 'Gastronomia',
 '["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800"]'::jsonb,
 '["Chef profissional", "Aula de sushi hands-on", "Degustação de sake", "Visita ao mercado Tsukiji", "7 refeições incluídas", "Tradutor"]'::jsonb,
 '["Português", "Inglês", "Japonês"]'::jsonb,
 12,
 1),

-- Passeio 11: Museus de Londres
('londres-museus-011',
 'Tour Cultural - Principais Museus de Londres',
 'Visite os icônicos British Museum, National Gallery e Tate Modern. Descubra tesouros arqueológicos, obras-primas da arte e exposições contemporâneas.',
 340.00,
 '6 horas',
 'Cultural',
 '["https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800", "https://images.unsplash.com/photo-1543832923-44667a44c804?w=800"]'::jsonb,
 '["Historiador da arte", "Ingressos para exposições especiais", "Fones de áudio", "Mapa ilustrado", "Pausa para chá inglês"]'::jsonb,
 '["Português", "Inglês"]'::jsonb,
 20,
 1),

-- Passeio 12: Escalada nos Andes
('andes-escalada-012',
 'Escalada no Aconcágua - Teto das Américas',
 'Desafie o pico mais alto das Américas! Expedição de 15 dias com aclimatação, treinamento técnico e ascensão ao Aconcágua (6.961m). Para montanhistas experientes.',
 4500.00,
 '15 dias',
 'Aventura',
 '["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"]'::jsonb,
 '["Guia de alta montanha IFMGA", "Equipamento técnico completo", "Tendas de expedição", "Oxigênio suplementar", "Alimentação liofilizada", "Resgate de emergência", "Permissões oficiais"]'::jsonb,
 '["Português", "Espanhol", "Inglês"]'::jsonb,
 4,
 1);

-- ============================================================================
-- VERIFICAÇÃO FINAL
-- ============================================================================

-- Contar passeios inseridos
SELECT COUNT(*) as total_passeios FROM passeios;

-- Mostrar resumo por categoria
SELECT
  categoria,
  COUNT(*) as quantidade,
  ROUND(AVG(preco)::numeric, 2) as preco_medio
FROM passeios
GROUP BY categoria
ORDER BY quantidade DESC;

-- Mostrar os 5 passeios mais caros
SELECT nome, preco, duracao, categoria
FROM passeios
ORDER BY preco DESC
LIMIT 5;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================

-- 🎉 PRONTO! Seu banco está configurado com 12 passeios de exemplo.
--
-- Próximos passos:
-- 1. Reinicie o servidor Next.js (Ctrl+C e depois npm run dev)
-- 2. Acesse: http://localhost:5000
-- 3. Os passeios reais do banco devem aparecer!
