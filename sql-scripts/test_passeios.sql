-- Script para verificar passeios no banco
SELECT 
  id,
  nome,
  categoria,
  preco,
  duracao,
  pg_typeof(imagens) as tipo_imagens,
  imagens,
  criado_em
FROM passeios
ORDER BY criado_em DESC
LIMIT 10;
