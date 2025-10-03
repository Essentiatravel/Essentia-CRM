CREATE TABLE `reservas` (
	`id` text PRIMARY KEY NOT NULL,
	`passeio_id` text NOT NULL,
	`passeio_nome` text NOT NULL,
	`data` text NOT NULL,
	`pessoas` integer NOT NULL,
	`tipo_reserva` text NOT NULL,
	`valor_total` real NOT NULL,
	`status` text DEFAULT 'confirmada',
	`cliente_nome` text NOT NULL,
	`cliente_email` text NOT NULL,
	`cliente_telefone` text,
	`cliente_observacoes` text,
	`metodo_pagamento` text NOT NULL,
	`criado_em` text,
	`atualizado_em` text
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sid` text PRIMARY KEY NOT NULL,
	`sess` text NOT NULL,
	`expire` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`first_name` text,
	`last_name` text,
	`nome` text,
	`profile_image_url` text,
	`user_type` text DEFAULT 'admin',
	`telefone` text,
	`endereco` text,
	`cpf` text,
	`data_nascimento` text,
	`senha` text,
	`password_hash` text,
	`status` text DEFAULT 'ativo',
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_agendamentos` (
	`id` text PRIMARY KEY NOT NULL,
	`passeio_id` text NOT NULL,
	`cliente_id` text NOT NULL,
	`guia_id` text,
	`data_passeio` text NOT NULL,
	`horario_inicio` text,
	`horario_fim` text,
	`numero_pessoas` integer DEFAULT 1 NOT NULL,
	`valor_total` real NOT NULL,
	`valor_comissao` real DEFAULT 0,
	`percentual_comissao` real DEFAULT 30,
	`status` text DEFAULT 'em_progresso' NOT NULL,
	`observacoes` text,
	`motivo_cancelamento` text,
	`avaliacao_cliente` integer,
	`comentario_cliente` text,
	`criado_em` text,
	`atualizado_em` text
);
--> statement-breakpoint
INSERT INTO `__new_agendamentos`("id", "passeio_id", "cliente_id", "guia_id", "data_passeio", "horario_inicio", "horario_fim", "numero_pessoas", "valor_total", "valor_comissao", "percentual_comissao", "status", "observacoes", "motivo_cancelamento", "avaliacao_cliente", "comentario_cliente", "criado_em", "atualizado_em") SELECT "id", "passeio_id", "cliente_id", "guia_id", "data_passeio", "horario_inicio", "horario_fim", "numero_pessoas", "valor_total", "valor_comissao", "percentual_comissao", "status", "observacoes", "motivo_cancelamento", "avaliacao_cliente", "comentario_cliente", "criado_em", "atualizado_em" FROM `agendamentos`;--> statement-breakpoint
DROP TABLE `agendamentos`;--> statement-breakpoint
ALTER TABLE `__new_agendamentos` RENAME TO `agendamentos`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_avaliacoes` (
	`id` text PRIMARY KEY NOT NULL,
	`agendamento_id` text NOT NULL,
	`cliente_id` text NOT NULL,
	`guia_id` text NOT NULL,
	`passeio_id` text NOT NULL,
	`nota` integer NOT NULL,
	`comentario` text,
	`aspectos` text,
	`recomenda` integer DEFAULT 1,
	`criado_em` text
);
--> statement-breakpoint
INSERT INTO `__new_avaliacoes`("id", "agendamento_id", "cliente_id", "guia_id", "passeio_id", "nota", "comentario", "aspectos", "recomenda", "criado_em") SELECT "id", "agendamento_id", "cliente_id", "guia_id", "passeio_id", "nota", "comentario", "aspectos", "recomenda", "criado_em" FROM `avaliacoes`;--> statement-breakpoint
DROP TABLE `avaliacoes`;--> statement-breakpoint
ALTER TABLE `__new_avaliacoes` RENAME TO `avaliacoes`;--> statement-breakpoint
CREATE TABLE `__new_transacoes` (
	`id` text PRIMARY KEY NOT NULL,
	`agendamento_id` text NOT NULL,
	`tipo` text NOT NULL,
	`valor` real NOT NULL,
	`status` text DEFAULT 'pendente' NOT NULL,
	`metodo_pagamento` text,
	`data_vencimento` text,
	`data_pagamento` text,
	`observacoes` text,
	`criado_em` text,
	`atualizado_em` text
);
--> statement-breakpoint
INSERT INTO `__new_transacoes`("id", "agendamento_id", "tipo", "valor", "status", "metodo_pagamento", "data_vencimento", "data_pagamento", "observacoes", "criado_em", "atualizado_em") SELECT "id", "agendamento_id", "tipo", "valor", "status", "metodo_pagamento", "data_vencimento", "data_pagamento", "observacoes", "criado_em", "atualizado_em" FROM `transacoes`;--> statement-breakpoint
DROP TABLE `transacoes`;--> statement-breakpoint
ALTER TABLE `__new_transacoes` RENAME TO `transacoes`;--> statement-breakpoint
CREATE TABLE `__new_clientes` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`telefone` text,
	`cpf` text,
	`data_nascimento` text,
	`endereco` text,
	`preferencias` text,
	`observacoes` text,
	`status` text DEFAULT 'ativo',
	`criado_em` text,
	`atualizado_em` text
);
--> statement-breakpoint
INSERT INTO `__new_clientes`("id", "nome", "email", "telefone", "cpf", "data_nascimento", "endereco", "preferencias", "observacoes", "status", "criado_em", "atualizado_em") SELECT "id", "nome", "email", "telefone", "cpf", "data_nascimento", "endereco", "preferencias", "observacoes", "status", "criado_em", "atualizado_em" FROM `clientes`;--> statement-breakpoint
DROP TABLE `clientes`;--> statement-breakpoint
ALTER TABLE `__new_clientes` RENAME TO `clientes`;--> statement-breakpoint
CREATE UNIQUE INDEX `clientes_email_unique` ON `clientes` (`email`);--> statement-breakpoint
CREATE TABLE `__new_guias` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`telefone` text,
	`cpf` text,
	`especialidades` text,
	`idiomas` text,
	`avaliacao_media` real DEFAULT 0,
	`total_avaliacoes` integer DEFAULT 0,
	`passeios_realizados` integer DEFAULT 0,
	`comissao_total` real DEFAULT 0,
	`percentual_comissao` real DEFAULT 30,
	`biografia` text,
	`foto` text,
	`status` text DEFAULT 'ativo',
	`data_registro` text,
	`criado_em` text,
	`atualizado_em` text
);
--> statement-breakpoint
INSERT INTO `__new_guias`("id", "nome", "email", "telefone", "cpf", "especialidades", "idiomas", "avaliacao_media", "total_avaliacoes", "passeios_realizados", "comissao_total", "percentual_comissao", "biografia", "foto", "status", "data_registro", "criado_em", "atualizado_em") SELECT "id", "nome", "email", "telefone", "cpf", "especialidades", "idiomas", "avaliacao_media", "total_avaliacoes", "passeios_realizados", "comissao_total", "percentual_comissao", "biografia", "foto", "status", "data_registro", "criado_em", "atualizado_em" FROM `guias`;--> statement-breakpoint
DROP TABLE `guias`;--> statement-breakpoint
ALTER TABLE `__new_guias` RENAME TO `guias`;--> statement-breakpoint
CREATE UNIQUE INDEX `guias_email_unique` ON `guias` (`email`);--> statement-breakpoint
CREATE TABLE `__new_passeios` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`descricao` text NOT NULL,
	`preco` real NOT NULL,
	`duracao` text NOT NULL,
	`categoria` text NOT NULL,
	`imagens` text,
	`inclusoes` text,
	`idiomas` text,
	`capacidade_maxima` integer DEFAULT 20,
	`ativo` integer DEFAULT 1,
	`criado_em` text,
	`atualizado_em` text
);
--> statement-breakpoint
INSERT INTO `__new_passeios`("id", "nome", "descricao", "preco", "duracao", "categoria", "imagens", "inclusoes", "idiomas", "capacidade_maxima", "ativo", "criado_em", "atualizado_em") SELECT "id", "nome", "descricao", "preco", "duracao", "categoria", "imagens", "inclusoes", "idiomas", "capacidade_maxima", "ativo", "criado_em", "atualizado_em" FROM `passeios`;--> statement-breakpoint
DROP TABLE `passeios`;--> statement-breakpoint
ALTER TABLE `__new_passeios` RENAME TO `passeios`;