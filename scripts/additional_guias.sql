-- Script para adicionar mais guias para testes
-- Executar: sqlite3 tmp/turguide.db < scripts/additional_guias.sql

-- Inserir Guias Adicionais para Testes
INSERT OR REPLACE INTO guias (id, nome, email, telefone, cpf, especialidades, idiomas, avaliacao_media, total_avaliacoes, passeios_realizados, comissao_total, percentual_comissao, biografia, foto, status) VALUES
('guia-009', 'Lucas Mendes', 'lucas.mendes@tourguide.com', '+55 11 99876-5432', '111.222.333-44', 'História, Arqueologia', '["Português", "Inglês", "Espanhol"]', 4.9, 28, 85, 3825.00, 30, 'Arqueólogo com especialização em história antiga. Especialista em sítios arqueológicos e ruínas romanas.', 'https://exemplo.com/foto9.jpg', 'ativo'),
('guia-010', 'Isabella Costa', 'isabella.costa@tourguide.com', '+55 21 98765-4321', '222.333.444-55', 'Arte, Museus', '["Português", "Inglês", "Italiano"]', 4.8, 35, 92, 4140.00, 30, 'Historiadora da arte com mestrado em museologia. Especialista em arte renascentista e barroca.', 'https://exemplo.com/foto10.jpg', 'ativo'),
('guia-011', 'Rafael Oliveira', 'rafael.oliveira@tourguide.com', '+55 85 97654-3210', '333.444.555-66', 'Aventura, Esportes Radicais', '["Português", "Inglês"]', 4.7, 22, 68, 3060.00, 30, 'Instrutor de esportes radicais certificado. Especialista em trilhas, escalada e rapel.', 'https://exemplo.com/foto11.jpg', 'ativo'),
('guia-012', 'Carolina Santos', 'carolina.santos@tourguide.com', '+55 31 96543-2109', '444.555.666-77', 'Gastronomia, Vinhos', '["Português", "Inglês", "Francês"]', 4.9, 31, 78, 3510.00, 30, 'Sommelier certificada e chef de cozinha. Especialista em vinhos italianos e gastronomia regional.', 'https://exemplo.com/foto12.jpg', 'ativo'),
('guia-013', 'Gabriel Silva', 'gabriel.silva@tourguide.com', '+55 47 95432-1098', '555.666.777-88', 'Fotografia, Paisagens', '["Português", "Inglês", "Espanhol"]', 4.6, 19, 45, 2025.00, 30, 'Fotógrafo profissional especializado em paisagens e fotografia de viagem.', 'https://exemplo.com/foto13.jpg', 'ativo'),
('guia-014', 'Amanda Ferreira', 'amanda.ferreira@tourguide.com', '+55 11 94321-0987', '666.777.888-99', 'Cultura, Tradições', '["Português", "Inglês", "Italiano"]', 4.8, 26, 71, 3195.00, 30, 'Antropóloga com especialização em cultura italiana. Conhece profundamente as tradições locais.', 'https://exemplo.com/foto14.jpg', 'ativo'),
('guia-015', 'Pedro Almeida', 'pedro.almeida@tourguide.com', '+55 21 93210-9876', '777.888.999-00', 'Arquitetura, Design', '["Português", "Inglês"]', 4.5, 15, 38, 1710.00, 30, 'Arquiteto especializado em arquitetura histórica e design contemporâneo.', 'https://exemplo.com/foto15.jpg', 'ativo'),
('guia-016', 'Julia Costa', 'julia.costa@tourguide.com', '+55 85 92109-8765', '888.999.000-11', 'Música, Ópera', '["Português", "Inglês", "Italiano"]', 4.7, 23, 52, 2340.00, 30, 'Musicóloga com especialização em ópera italiana. Conhece todos os teatros e casas de ópera.', 'https://exemplo.com/foto16.jpg', 'ativo'),
('guia-017', 'Matheus Lima', 'matheus.lima@tourguide.com', '+55 31 91098-7654', '999.000.111-22', 'História Militar', '["Português", "Inglês"]', 4.4, 12, 29, 1305.00, 30, 'Historiador especializado em história militar e estratégias de guerra antiga.', 'https://exemplo.com/foto17.jpg', 'ativo'),
('guia-018', 'Fernanda Oliveira', 'fernanda.oliveira@tourguide.com', '+55 47 90987-6543', '000.111.222-33', 'Moda, Design', '["Português", "Inglês", "Francês"]', 4.6, 18, 41, 1845.00, 30, 'Designer de moda com experiência em ateliês italianos. Especialista em história da moda.', 'https://exemplo.com/foto18.jpg', 'ativo'),
('guia-019', 'Bruno Santos', 'bruno.santos@tourguide.com', '+55 11 89876-5432', '111.222.333-55', 'Tecnologia, Inovação', '["Português", "Inglês"]', 4.3, 8, 16, 720.00, 30, 'Engenheiro especializado em tecnologia e inovação. Conhece os centros de tecnologia italianos.', 'https://exemplo.com/foto19.jpg', 'ativo'),
('guia-020', 'Larissa Mendes', 'larissa.mendes@tourguide.com', '+55 21 88765-4321', '222.333.444-66', 'Literatura, Poesia', '["Português", "Inglês", "Italiano"]', 4.5, 14, 33, 1485.00, 30, 'Professora de literatura com especialização em poesia italiana e literatura clássica.', 'https://exemplo.com/foto20.jpg', 'ativo');

-- Verificar total de guias
SELECT COUNT(*) as total_guias FROM guias;





