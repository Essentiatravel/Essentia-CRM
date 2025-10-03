CREATE TABLE IF NOT EXISTS "agendamentos" (
  "id" varchar PRIMARY KEY NOT NULL,
  "passeio_id" varchar NOT NULL,
  "cliente_id" varchar NOT NULL,
  "guia_id" varchar,
  "data_passeio" varchar NOT NULL,
  "horario_inicio" varchar,
  "horario_fim" varchar,
  "numero_pessoas" integer DEFAULT 1 NOT NULL,
  "valor_total" real NOT NULL,
  "valor_comissao" real DEFAULT 0,
  "percentual_comissao" real DEFAULT 30,
  "status" varchar DEFAULT 'em_progresso' NOT NULL,
  "observacoes" text,
  "motivo_cancelamento" text,
  "avaliacao_cliente" integer,
  "comentario_cliente" text,
  "criado_em" timestamp DEFAULT now(),
  "atualizado_em" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "avaliacoes" (
  "id" varchar PRIMARY KEY NOT NULL,
  "agendamento_id" varchar NOT NULL,
  "cliente_id" varchar NOT NULL,
  "guia_id" varchar NOT NULL,
  "passeio_id" varchar NOT NULL,
  "nota" integer NOT NULL,
  "comentario" text,
  "aspectos" jsonb,
  "recomenda" integer DEFAULT 1,
  "criado_em" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "clientes" (
  "id" varchar PRIMARY KEY NOT NULL,
  "nome" varchar NOT NULL,
  "email" varchar NOT NULL,
  "telefone" varchar,
  "cpf" varchar,
  "data_nascimento" varchar,
  "endereco" jsonb,
  "preferencias" jsonb,
  "observacoes" text,
  "status" varchar DEFAULT 'ativo',
  "criado_em" timestamp DEFAULT now(),
  "atualizado_em" timestamp DEFAULT now(),
  CONSTRAINT "clientes_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "guias" (
  "id" varchar PRIMARY KEY NOT NULL,
  "nome" varchar NOT NULL,
  "email" varchar NOT NULL,
  "telefone" varchar,
  "cpf" varchar,
  "especialidades" jsonb,
  "idiomas" jsonb,
  "avaliacao_media" real DEFAULT 0,
  "total_avaliacoes" integer DEFAULT 0,
  "passeios_realizados" integer DEFAULT 0,
  "comissao_total" real DEFAULT 0,
  "percentual_comissao" real DEFAULT 30,
  "biografia" text,
  "foto" varchar,
  "status" varchar DEFAULT 'ativo',
  "data_registro" timestamp DEFAULT now(),
  "criado_em" timestamp DEFAULT now(),
  "atualizado_em" timestamp DEFAULT now(),
  CONSTRAINT "guias_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "passeios" (
  "id" varchar PRIMARY KEY NOT NULL,
  "nome" varchar NOT NULL,
  "descricao" text NOT NULL,
  "preco" real NOT NULL,
  "duracao" varchar NOT NULL,
  "categoria" varchar NOT NULL,
  "imagens" jsonb,
  "inclusoes" jsonb,
  "idiomas" jsonb,
  "capacidade_maxima" integer DEFAULT 20,
  "ativo" integer DEFAULT 1,
  "criado_em" timestamp DEFAULT now(),
  "atualizado_em" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "reservas" (
  "id" varchar PRIMARY KEY NOT NULL,
  "passeio_id" varchar NOT NULL,
  "passeio_nome" varchar NOT NULL,
  "data" timestamp NOT NULL,
  "pessoas" integer NOT NULL,
  "tipo_reserva" varchar NOT NULL,
  "valor_total" real NOT NULL,
  "status" varchar DEFAULT 'confirmada',
  "cliente_nome" varchar NOT NULL,
  "cliente_email" varchar NOT NULL,
  "cliente_telefone" varchar,
  "cliente_observacoes" text,
  "metodo_pagamento" varchar NOT NULL,
  "criado_em" timestamp DEFAULT now(),
  "atualizado_em" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "sid" varchar PRIMARY KEY NOT NULL,
  "sess" jsonb NOT NULL,
  "expire" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "transacoes" (
  "id" varchar PRIMARY KEY NOT NULL,
  "agendamento_id" varchar NOT NULL,
  "tipo" varchar NOT NULL,
  "valor" real NOT NULL,
  "status" varchar DEFAULT 'pendente' NOT NULL,
  "metodo_pagamento" varchar,
  "data_vencimento" varchar,
  "data_pagamento" varchar,
  "observacoes" text,
  "criado_em" timestamp DEFAULT now(),
  "atualizado_em" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar,
  "first_name" varchar,
  "last_name" varchar,
  "nome" varchar,
  "profile_image_url" varchar,
  "user_type" varchar DEFAULT 'admin',
  "telefone" varchar,
  "endereco" varchar,
  "cpf" varchar,
  "data_nascimento" varchar,
  "senha" varchar,
  "password_hash" varchar,
  "status" varchar DEFAULT 'ativo',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" USING btree ("expire");

ALTER TABLE "agendamentos"
  ADD CONSTRAINT IF NOT EXISTS "agendamentos_passeio_id_passeios_id_fk"
    FOREIGN KEY ("passeio_id") REFERENCES "passeios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "agendamentos"
  ADD CONSTRAINT IF NOT EXISTS "agendamentos_cliente_id_clientes_id_fk"
    FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "agendamentos"
  ADD CONSTRAINT IF NOT EXISTS "agendamentos_guia_id_guias_id_fk"
    FOREIGN KEY ("guia_id") REFERENCES "guias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "avaliacoes"
  ADD CONSTRAINT IF NOT EXISTS "avaliacoes_agendamento_id_agendamentos_id_fk"
    FOREIGN KEY ("agendamento_id") REFERENCES "agendamentos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "avaliacoes"
  ADD CONSTRAINT IF NOT EXISTS "avaliacoes_cliente_id_clientes_id_fk"
    FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "avaliacoes"
  ADD CONSTRAINT IF NOT EXISTS "avaliacoes_guia_id_guias_id_fk"
    FOREIGN KEY ("guia_id") REFERENCES "guias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "avaliacoes"
  ADD CONSTRAINT IF NOT EXISTS "avaliacoes_passeio_id_passeios_id_fk"
    FOREIGN KEY ("passeio_id") REFERENCES "passeios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "transacoes"
  ADD CONSTRAINT IF NOT EXISTS "transacoes_agendamento_id_agendamentos_id_fk"
    FOREIGN KEY ("agendamento_id") REFERENCES "agendamentos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
