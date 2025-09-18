-- Script para adicionar mais agendamentos confirmados para testar o calendário
-- Executar: sqlite3 tmp/turguide.db < scripts/additional_confirmed_appointments.sql

-- Atualizar alguns agendamentos existentes para status confirmado
UPDATE agendamentos SET status = 'confirmadas' WHERE id IN ('1', '2', '4');

-- Inserir novos agendamentos confirmados
INSERT OR REPLACE INTO agendamentos (id, passeio_id, cliente_id, guia_id, data_passeio, horario_inicio, horario_fim, numero_pessoas, valor_total, valor_comissao, percentual_comissao, status, observacoes) VALUES
('agend-conf-001', '1', '1', '1', '2025-02-15', '09:00', '13:00', 2, 300.00, 90.00, 30, 'confirmadas', 'Cliente VIP, preferência por horário matinal'),
('agend-conf-002', '2', '2', '2', '2025-02-18', '08:00', '16:00', 1, 280.00, 84.00, 30, 'confirmadas', 'Aventura solo, equipamento especial necessário'),
('agend-conf-003', '3', '3', '3', '2025-02-20', '14:00', '19:00', 3, 600.00, 180.00, 30, 'confirmadas', 'Grupo familiar, interesse em arte renascentista'),
('agend-conf-004', '4', '4', '1', '2025-02-22', '10:00', '16:00', 2, 360.00, 108.00, 30, 'confirmadas', 'Casal romântico, preferência por locais menos turísticos'),
('agend-conf-005', '5', '1', '2', '2025-02-25', '18:00', '22:00', 4, 1120.00, 336.00, 30, 'confirmadas', 'Grupo gastronômico, interesse em vinhos'),
('agend-conf-006', '1', '2', '3', '2025-03-01', '09:00', '13:00', 1, 150.00, 45.00, 30, 'confirmadas', 'Estudante de história, interesse em detalhes'),
('agend-conf-007', '2', '3', '1', '2025-03-05', '07:00', '15:00', 2, 560.00, 168.00, 30, 'confirmadas', 'Fotógrafos profissionais, equipamento pesado'),
('agend-conf-008', '3', '4', '2', '2025-03-08', '15:00', '20:00', 3, 900.00, 270.00, 30, 'confirmadas', 'Grupo de amigos, interesse em vida noturna'),
('agend-conf-009', '4', '1', '3', '2025-03-12', '11:00', '17:00', 2, 360.00, 108.00, 30, 'confirmadas', 'Casal em lua de mel, preferência por locais românticos'),
('agend-conf-010', '5', '2', '1', '2025-03-15', '19:00', '23:00', 2, 560.00, 168.00, 30, 'confirmadas', 'Celebração de aniversário, interesse em gastronomia local');

-- Verificar total de agendamentos confirmados
SELECT COUNT(*) as total_confirmados FROM agendamentos WHERE status IN ('confirmadas', 'confirmado');





