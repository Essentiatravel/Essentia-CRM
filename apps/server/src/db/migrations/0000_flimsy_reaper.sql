CREATE TABLE `agendamentos` (
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
	`criado_em` text DEFAULT CURRENT_TIMESTAMP,
	`atualizado_em` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`passeio_id`) REFERENCES `passeios`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`guia_id`) REFERENCES `guias`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `avaliacoes` (
	`id` text PRIMARY KEY NOT NULL,
	`agendamento_id` text NOT NULL,
	`cliente_id` text NOT NULL,
	`guia_id` text NOT NULL,
	`passeio_id` text NOT NULL,
	`nota` integer NOT NULL,
	`comentario` text,
	`aspectos` text,
	`recomenda` integer DEFAULT true,
	`criado_em` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`agendamento_id`) REFERENCES `agendamentos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`guia_id`) REFERENCES `guias`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`passeio_id`) REFERENCES `passeios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `clientes` (
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
	`criado_em` text DEFAULT CURRENT_TIMESTAMP,
	`atualizado_em` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clientes_email_unique` ON `clientes` (`email`);--> statement-breakpoint
CREATE TABLE `guias` (
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
	`data_registro` text DEFAULT CURRENT_TIMESTAMP,
	`criado_em` text DEFAULT CURRENT_TIMESTAMP,
	`atualizado_em` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guias_email_unique` ON `guias` (`email`);--> statement-breakpoint
CREATE TABLE `passeios` (
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
	`ativo` integer DEFAULT true,
	`criado_em` text DEFAULT CURRENT_TIMESTAMP,
	`atualizado_em` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `transacoes` (
	`id` text PRIMARY KEY NOT NULL,
	`agendamento_id` text NOT NULL,
	`tipo` text NOT NULL,
	`valor` real NOT NULL,
	`status` text DEFAULT 'pendente' NOT NULL,
	`metodo_pagamento` text,
	`data_vencimento` text,
	`data_pagamento` text,
	`observacoes` text,
	`criado_em` text DEFAULT CURRENT_TIMESTAMP,
	`atualizado_em` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`agendamento_id`) REFERENCES `agendamentos`(`id`) ON UPDATE no action ON DELETE no action
);
