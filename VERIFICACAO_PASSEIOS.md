# 🔍 GUIA DE VERIFICAÇÃO: SISTEMA DE PASSEIOS E UPLOAD DE IMAGENS

## ✅ CHECKLIST DE VERIFICAÇÃO

### 1️⃣ **Verificar se o Upload Funciona**

#### Teste Manual:
1. Acesse: http://localhost:5000/admin/passeios
2. Clique em "Novo Passeio"
3. Faça upload de uma imagem
4. Verifique no console do navegador se há erros
5. Confirme se a URL da imagem aparece na lista

#### Verificar Arquivos Salvos:
```bash
# Listar uploads
ls -la apps/web/public/uploads/passeios/

# Deve mostrar arquivos .jpg/.png com nomes UUID
✅ 9620c4e9-6132-4e05-8f74-82603bbb5a6d.jpg
```

---

### 2️⃣ **Verificar Dados no Banco**

```sql
-- Conectar ao Supabase e executar:
SELECT 
  id,
  nome,
  imagens,
  pg_typeof(imagens) as tipo_imagens
FROM passeios
ORDER BY criado_em DESC
LIMIT 5;
```

**Resultado Esperado**:
```
id          | nome                  | imagens                              | tipo_imagens
------------|----------------------|--------------------------------------|-------------
passeio_123 | Tour Histórico       | ["/uploads/passeios/uuid.jpg"]      | jsonb
```

**❌ Se aparecer assim (STRING em vez de JSONB)**:
```
imagens: "[\"/uploads/passeios/uuid.jpg\"]"  // STRING
```

**Solução - Corrigir Storage**:
```sql
-- Converter strings para JSONB
UPDATE passeios
SET imagens = imagens::jsonb
WHERE pg_typeof(imagens) = 'text'::regtype;
```

---

### 3️⃣ **Verificar API de Passeios**

#### Teste via Browser/Postman:
```bash
# GET - Listar passeios
curl http://localhost:5000/api/passeios

# Verificar estrutura das imagens
# Deve retornar:
{
  "id": "passeio_123",
  "nome": "Tour Histórico",
  "imagens": ["/uploads/passeios/uuid.jpg"],  // ✅ Array
  ...
}

# ❌ Se retornar string:
{
  "imagens": "[\"url\"]"  // ❌ String JSON
}
```

---

### 4️⃣ **Verificar Renderização nos Cards**

#### Abrir Console do Navegador:
```javascript
// Na página inicial ou admin/passeios
console.log('Passeios carregados:', passeios);

// Verificar estrutura das imagens
passeios.forEach(p => {
  console.log(p.nome, '→ Imagens:', p.imagens, typeof p.imagens);
});
```

**Resultado Esperado**:
```
Tour Histórico → Imagens: ["/uploads/passeios/uuid.jpg"] object
```

**❌ Se aparecer**:
```
Tour Histórico → Imagens: "[\"url\"]" string  // ❌ Problema!
```

---

## 🔧 **CORREÇÕES NECESSÁRIAS**

### **Correção 1: Garantir JSONB no Banco**

Edite: `apps/web/src/app/api/passeios/route.ts`

```typescript
// ❌ ANTES (linha 50)
imagens: JSON.stringify(passeioData.images || []),

// ✅ DEPOIS - Força JSONB nativo PostgreSQL
imagens: passeioData.images || [],  // Drizzle converte automaticamente
```

### **Correção 2: Parser Robusto no GET**

Edite: `apps/web/src/app/api/passeios/route.ts`

```typescript
export async function GET() {
  try {
    const todosPasseios = await db.select().from(passeios);
    
    // ✅ Garantir que imagens sempre seja array
    const passeiosFormatados = todosPasseios.map(p => ({
      ...p,
      imagens: Array.isArray(p.imagens) ? p.imagens : 
               (typeof p.imagens === 'string' ? JSON.parse(p.imagens) : []),
      inclusoes: Array.isArray(p.inclusoes) ? p.inclusoes :
                 (typeof p.inclusoes === 'string' ? JSON.parse(p.inclusoes) : []),
      idiomas: Array.isArray(p.idiomas) ? p.idiomas :
               (typeof p.idiomas === 'string' ? JSON.parse(p.idiomas) : []),
    }));
    
    return NextResponse.json(passeiosFormatados);
  } catch (error) {
    console.error('Erro ao buscar passeios:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
```

### **Correção 3: Schema Drizzle Correto**

Arquivo: `apps/server/src/db/schema.ts` e `apps/web/src/lib/db/schema.ts`

```typescript
// ✅ Garantir que o tipo seja JSONB
export const passeios = pgTable("passeios", {
  id: varchar("id").primaryKey(),
  nome: varchar("nome").notNull(),
  descricao: text("descricao").notNull(),
  preco: real("preco").notNull(),
  duracao: varchar("duracao").notNull(),
  categoria: varchar("categoria").notNull(),
  imagens: jsonb("imagens").$type<string[]>(),  // ✅ Array de strings
  inclusoes: jsonb("inclusoes").$type<string[]>(),
  idiomas: jsonb("idiomas").$type<string[]>(),
  capacidadeMaxima: integer("capacidade_maxima").default(20),
  ativo: integer("ativo").default(1),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});
```

---

## 🚀 **TESTE COMPLETO**

### **Cenário 1: Criar Novo Passeio com Imagem**

1. Ir para: http://localhost:5000/admin/passeios
2. Clicar "Novo Passeio"
3. Preencher formulário:
   - Nome: "Teste de Upload"
   - Preço: 100
   - Duração: 3 horas
   - Categoria: "Cultural"
4. **Fazer upload de uma imagem**
5. Salvar
6. **Verificar**:
   - ✅ Passeio aparece na tabela
   - ✅ Ir para página inicial: http://localhost:5000
   - ✅ Card deve mostrar a imagem carregada
   - ✅ Se não aparecer: verificar console do navegador

### **Cenário 2: Editar Passeio e Adicionar Imagem**

1. Na tabela de passeios, clicar no menu ⋮ de um passeio
2. Clicar "Editar"
3. Fazer upload de nova imagem
4. Salvar
5. **Verificar**: Imagem deve aparecer nos cards

### **Cenário 3: Excluir Imagem**

1. Editar passeio
2. Clicar no X de uma imagem na lista
3. Salvar
4. **Verificar**: Imagem removida do card (mostra emoji fallback)

---

## 🐛 **PROBLEMAS COMUNS E SOLUÇÕES**

### **Problema**: "Erro 401 - Acesso negado" ao fazer upload

**Causa**: Usuário não está autenticado ou não é admin

**Solução**:
```typescript
// Verificar no console do navegador
const { user } = useAuth();
console.log('User:', user);
console.log('UserType:', user?.userType);

// Deve mostrar:
// User: { id: "...", email: "admin@turguide.com", userType: "admin" }
```

Se não mostrar `admin`, fazer login novamente:
1. Logout
2. Login com: admin@turguide.com / admin123

---

### **Problema**: Imagem carrega mas não aparece no card

**Causa**: URL da imagem incorreta

**Solução**:
```javascript
// No console do navegador, na página inicial
const img = document.querySelector('img[src*="uploads"]');
console.log('Imagem URL:', img?.src);

// Deve ser algo como:
// http://localhost:5000/uploads/passeios/uuid.jpg

// ❌ Se aparecer:
// http://localhost:5000//uploads/passeios/uuid.jpg (// duplo)
// ou
// http://localhost:5000/api/uploads/passeios/uuid.jpg (caminho errado)
```

**Correção**: Garantir que API retorna URL correta:
```typescript
// apps/web/src/app/api/upload/route.ts (linha 102)
const publicUrl = `/uploads/passeios/${fileName}`;  // ✅ Correto
```

---

### **Problema**: "Failed to load resource: 404" para imagem

**Causa**: Arquivo não existe em `/public/uploads/passeios/`

**Solução**:
```bash
# Verificar se pasta existe
ls -la apps/web/public/uploads/passeios/

# Se não existir, criar:
mkdir -p apps/web/public/uploads/passeios/

# Reiniciar servidor Next.js
npm run dev:web
```

---

### **Problema**: Imagens antigas não aparecem após migração

**Causa**: Dados no banco estão como STRING em vez de JSONB

**Solução - SQL no Supabase**:
```sql
-- 1. Verificar tipos atuais
SELECT 
  id, 
  nome,
  imagens,
  pg_typeof(imagens) as tipo
FROM passeios
LIMIT 5;

-- 2. Se tipo = 'text', converter para JSONB
UPDATE passeios
SET imagens = imagens::jsonb
WHERE pg_typeof(imagens) = 'text'::regtype;

-- 3. Fazer o mesmo para outros campos JSON
UPDATE passeios
SET 
  inclusoes = CASE 
    WHEN pg_typeof(inclusoes) = 'text'::regtype THEN inclusoes::jsonb
    ELSE inclusoes
  END,
  idiomas = CASE
    WHEN pg_typeof(idiomas) = 'text'::regtype THEN idiomas::jsonb
    ELSE idiomas
  END;

-- 4. Verificar resultado
SELECT id, nome, imagens, pg_typeof(imagens) FROM passeios LIMIT 5;
```

---

## 📝 **LOGS ÚTEIS PARA DEBUG**

### **Adicionar logs temporários**:

**1. No Modal de Edição** (`add-tour-modal.tsx`):
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log('📤 Enviando dados:', formData);  // ✅ Adicionar
  console.log('📸 Imagens:', formData.images);   // ✅ Adicionar
  onSubmit(formData);
  onClose();
};
```

**2. Na API PUT** (`apps/web/src/app/api/passeios/[id]/route.ts`):
```typescript
export async function PUT(request, { params }) {
  const { id } = await params;
  const passeioData = await request.json();
  
  console.log('🔄 PUT Request:', {  // ✅ Adicionar
    id,
    images: passeioData.images,
    imagesType: typeof passeioData.images
  });
  
  // ... resto do código
}
```

**3. No Card** (`passeios-cards.tsx`):
```typescript
{passeios.map((passeio, index) => {
  console.log(`🎴 Card ${passeio.nome}:`, {  // ✅ Adicionar
    imagens: passeio.imagens,
    tipo: typeof passeio.imagens,
    isArray: Array.isArray(passeio.imagens)
  });
  
  // ... resto do código
})}
```

---

## ✅ **CHECKLIST FINAL**

Antes de considerar o sistema funcionando, verificar:

- [ ] Upload de imagem retorna URL válida
- [ ] URL começa com `/uploads/passeios/`
- [ ] Arquivo físico existe em `apps/web/public/uploads/passeios/`
- [ ] Banco de dados armazena imagens como JSONB array
- [ ] API GET retorna `imagens` como array de strings
- [ ] Cards na homepage mostram imagens
- [ ] Cards no admin mostram imagens
- [ ] Edição carrega imagens existentes
- [ ] Pode adicionar múltiplas imagens
- [ ] Pode remover imagens
- [ ] Fallback (emoji) funciona quando sem imagem

---

## 🎯 **PRÓXIMOS PASSOS RECOMENDADOS**

1. **Migrar para Supabase Storage** (em vez de `/public`)
   - Vantagens: CDN, backups automáticos, controle de acesso
   - Implementação: substituir `writeFile` por `supabase.storage.upload()`

2. **Adicionar otimização de imagens**
   - Resize automático (ex: max 1200px width)
   - Conversão para WebP (menor tamanho)
   - Geração de thumbnails

3. **Limpeza de imagens órfãs**
   - Script para deletar arquivos não referenciados no banco
   - Executar periodicamente via cron job

4. **Múltiplos uploads simultâneos**
   - Drag & drop de múltiplas imagens
   - Progress bar individual

5. **Ordenação de imagens**
   - Drag & drop para reordenar
   - Definir imagem principal (destaque)

---

## 📞 **SUPORTE**

Se após todas essas verificações o problema persistir:

1. **Exportar logs completos**:
   ```bash
   # Terminal onde o Next.js está rodando
   # Capturar output completo
   npm run dev:web 2>&1 | tee debug.log
   ```

2. **Exportar dados do banco**:
   ```sql
   -- No Supabase SQL Editor
   SELECT * FROM passeios 
   WHERE imagens IS NOT NULL 
   ORDER BY criado_em DESC 
   LIMIT 10;
   ```

3. **Screenshots**:
   - Console do navegador (F12)
   - Network tab (requisições)
   - Página com erro

Com essas informações, é possível diagnosticar exatamente onde está o problema.

