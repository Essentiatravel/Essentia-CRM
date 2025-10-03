# 🌱 SEED DE PASSEIOS PARA TESTE

## Opção 1: Via API Seed (Recomendado)

```bash
# Acesse no navegador
http://localhost:5000/api/seeds/passeios
```

Ou via curl:
```bash
curl -X POST http://localhost:5000/api/seeds/passeios
```

## Opção 2: SQL Direto no Supabase

Execute no SQL Editor do Supabase:

```sql
-- Limpar tabela (CUIDADO: remove todos os dados!)
-- DELETE FROM passeios;

-- Inserir passeios de teste
INSERT INTO passeios (id, nome, descricao, preco, duracao, categoria, imagens, inclusoes, idiomas, capacidade_maxima, ativo)
VALUES 
(
  'passeio_' || extract(epoch from now())::bigint || '_1',
  'Tour pelo Centro Histórico',
  'Explore os pontos turísticos mais icônicos do centro histórico da cidade com um guia especializado.',
  75.00,
  '3h',
  'Histórico',
  '[]'::jsonb,
  '["Guia especializado", "Entrada nos monumentos", "Água mineral"]'::jsonb,
  '["Português", "Inglês", "Espanhol"]'::jsonb,
  15,
  1
),
(
  'passeio_' || extract(epoch from now())::bigint || '_2',
  'Aventura na Floresta',
  'Trilha emocionante pela floresta com observação de fauna e flora local.',
  120.00,
  '6h',
  'Natureza',
  '[]'::jsonb,
  '["Equipamentos de segurança", "Lanche", "Guia especializado", "Transporte"]'::jsonb,
  '["Português", "Inglês"]'::jsonb,
  8,
  1
),
(
  'passeio_' || extract(epoch from now())::bigint || '_3',
  'Tour Gastronômico',
  'Descubra os sabores locais visitando restaurantes e mercados tradicionais.',
  95.00,
  '4h',
  'Gastronômico',
  '[]'::jsonb,
  '["Degustação de pratos típicos", "Guia gastronômico", "Bebidas incluídas"]'::jsonb,
  '["Português", "Espanhol"]'::jsonb,
  12,
  1
),
(
  'passeio_' || extract(epoch from now())::bigint || '_4',
  'Passeio Cultural',
  'Visite museus, galerias de arte e centros culturais da região.',
  85.00,
  '5h',
  'Cultural',
  '[]'::jsonb,
  '["Entrada nos museus", "Guia cultural", "Material informativo"]'::jsonb,
  '["Português", "Inglês", "Francês"]'::jsonb,
  20,
  1
),
(
  'passeio_' || extract(epoch from now())::bigint || '_5',
  'Vida Noturna Premium',
  'Conheça os melhores bares, clubes e pontos de encontro noturnos.',
  150.00,
  '6h',
  'Romântico',
  '[]'::jsonb,
  '["Transporte privado", "Entrada nos clubes", "Welcome drink", "Guia local"]'::jsonb,
  '["Português", "Inglês"]'::jsonb,
  10,
  1
);

-- Verificar se foram criados
SELECT id, nome, categoria, preco FROM passeios ORDER BY criado_em DESC;
```

## Opção 3: Criar Manualmente via Interface

1. Acesse: http://localhost:5000/admin/passeios
2. Clique em "Novo Passeio"
3. Preencha o formulário:
   - Nome: "Teste de Passeio"
   - Localização: "Centro"
   - Descrição: "Passeio de teste"
   - Tipo: "Cultural"
   - Duração: 3 horas
   - Preço: 100
   - Máx. Pessoas: 10
4. (Opcional) Faça upload de uma imagem
5. Salvar

## Verificar Resultado

Execute no Supabase:

```sql
SELECT 
  id,
  nome,
  categoria,
  preco,
  duracao,
  pg_typeof(imagens) as tipo_imagens,
  imagens,
  ativo
FROM passeios
ORDER BY criado_em DESC;
```

**Resultado Esperado**:
```
id                  | nome                        | categoria    | preco  | tipo_imagens
--------------------|----------------------------|--------------|--------|-------------
passeio_1234567_1   | Tour pelo Centro Histórico | Histórico    | 75.00  | jsonb
passeio_1234567_2   | Aventura na Floresta       | Natureza     | 120.00 | jsonb
...
```

## Troubleshooting

### Problema: "duplicate key value violates unique constraint"

**Causa**: ID já existe

**Solução**: Mudar o ID ou deletar registros antigos:
```sql
DELETE FROM passeios WHERE id LIKE 'passeio_%';
```

### Problema: Imagens não aparecem

**Causa**: Campo `imagens` está como string em vez de JSONB

**Solução**:
```sql
UPDATE passeios
SET imagens = '[]'::jsonb
WHERE imagens IS NULL OR pg_typeof(imagens) = 'text'::regtype;
```

