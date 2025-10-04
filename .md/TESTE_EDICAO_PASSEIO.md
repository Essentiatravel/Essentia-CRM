# 🧪 TESTE: EDIÇÃO DE PASSEIO

## ✅ CORREÇÕES APLICADAS

1. **Adicionada prop `isEdit={true}`** no modal de edição
2. **Logs detalhados** para debug no console
3. **Parsing robusto** de campos JSON na API

## 🔍 COMO TESTAR AGORA

### Passo 1: Recarregar a Página
```
http://localhost:5000/admin/passeios
```

### Passo 2: Abrir Console do Navegador
- Pressione F12
- Vá para aba "Console"

### Passo 3: Clicar em "Editar" (⋮)

Você deverá ver logs no console:

```javascript
🔍 Buscando passeio: passeio_1234567
📡 Response status: 200
✅ Dados do passeio: {...}
📝 Tour formatado: {...}
🔄 AddTourModal useEffect: {isEdit: true, isOpen: true, initialData: {...}}
✅ Carregando dados para edição: {...}
🎨 Renderizando AddTourModal: {isEdit: true, isOpen: true, hasInitialData: true, formData: "Nome do Passeio (150)"}
```

### Passo 4: Verificar Modal

O modal deve abrir com:
- ✅ Título: "**Editar Passeio**" (não "Criar Novo Passeio")
- ✅ Nome do passeio preenchido
- ✅ Localização preenchida
- ✅ Descrição preenchida
- ✅ Preço preenchido
- ✅ Duração preenchida
- ✅ Idiomas listados
- ✅ Itens inclusos listados
- ✅ Imagens listadas

---

## ❌ PROBLEMAS POSSÍVEIS

### Problema 1: Modal Abre Vazio (Campos em Branco)

**Logs no Console:**
```javascript
🔄 AddTourModal useEffect: {isEdit: true, isOpen: true, initialData: {...}}
✅ Carregando dados para edição: {...}
🎨 Renderizando AddTourModal: {isEdit: true, isOpen: true, hasInitialData: true, formData: "VAZIO"}
```

**Causa**: O `useEffect` não está atualizando o `formData` corretamente

**Solução**: O `useEffect` precisa disparar quando `isOpen` muda. Verifique as dependências.

---

### Problema 2: Título "Criar Novo Passeio" em Vez de "Editar Passeio"

**Logs no Console:**
```javascript
🎨 Renderizando AddTourModal: {isEdit: false, isOpen: true, ...}
```

**Causa**: A prop `isEdit` não está sendo passada corretamente

**Diagnóstico**: Verificar se no `manage-tours-page.tsx` tem:
```typescript
<AddTourModal
  isEdit={true}  // ← Esta linha deve existir
  initialData={selectedTour}
  ...
/>
```

---

### Problema 3: Modal Não Abre (Nenhum Log)

**Causa**: Erro ao buscar dados da API (ver seção anterior)

**Solução**: 
1. Verificar se há passeios no banco
2. Executar seed de passeios
3. Verificar logs do servidor no terminal

---

## 🔧 CORREÇÃO ADICIONAL (SE AINDA NÃO FUNCIONAR)

Se o modal ainda abrir vazio, pode ser problema de timing do React. Vamos forçar uma nova instância do modal:

### Arquivo: `manage-tours-page.tsx`

**ANTES:**
```typescript
{selectedTour && (
  <AddTourModal
    isOpen={isEditTourModalOpen}
    onClose={() => {
      setIsEditTourModalOpen(false);
      setSelectedTour(null);
    }}
    onSubmit={handleUpdateTour}
    initialData={selectedTour}
    isEdit={true}
  />
)}
```

**DEPOIS:**
```typescript
<AddTourModal
  key={selectedTour?.id || 'edit'}  // ← Adiciona key única
  isOpen={isEditTourModalOpen && !!selectedTour}  // ← Garante que selectedTour existe
  onClose={() => {
    setIsEditTourModalOpen(false);
    setSelectedTour(null);
  }}
  onSubmit={handleUpdateTour}
  initialData={selectedTour || undefined}
  isEdit={!!selectedTour}  // ← Só true se selectedTour existe
/>
```

Esta mudança força o React a recriar o componente toda vez que um passeio diferente é selecionado.

---

## 🎯 TESTE COMPLETO

### Cenário 1: Editar Passeio Existente

1. Clicar em "Editar" (⋮) de qualquer passeio
2. ✅ Modal abre com título "**Editar Passeio**"
3. ✅ Todos os campos estão preenchidos
4. ✅ Alterar o nome para "Teste de Edição"
5. ✅ Clicar em "Salvar Passeio"
6. ✅ Modal fecha
7. ✅ Tabela recarrega automaticamente
8. ✅ Nome atualizado aparece na lista

### Cenário 2: Adicionar Nova Imagem em Edição

1. Clicar em "Editar" (⋮)
2. ✅ Modal abre com dados existentes
3. ✅ Fazer upload de nova imagem
4. ✅ Ver preview da imagem
5. ✅ Salvar
6. ✅ Verificar se imagem aparece no card da homepage

### Cenário 3: Remover Imagem em Edição

1. Clicar em "Editar" (⋮)
2. ✅ Modal abre com imagens existentes
3. ✅ Clicar no X de uma imagem
4. ✅ Imagem removida da lista
5. ✅ Salvar
6. ✅ Verificar que imagem não aparece mais

### Cenário 4: Adicionar Idioma/Item Incluso

1. Clicar em "Editar" (⋮)
2. ✅ Ver idiomas/itens já existentes
3. ✅ Adicionar novo idioma "Francês"
4. ✅ Adicionar item "Seguro viagem"
5. ✅ Salvar
6. ✅ Verificar mudanças

---

## 📊 RESULTADO ESPERADO NO CONSOLE

### Console ao Clicar em "Editar":

```javascript
// 1. Busca na API
🔍 Buscando passeio: passeio_1696789012345_1
📡 Response status: 200

// 2. Dados recebidos
✅ Dados do passeio: {
  id: "passeio_1696789012345_1",
  nome: "Tour pelo Centro Histórico",
  preco: 75,
  duracao: "3h",
  categoria: "Histórico",
  imagens: ["/uploads/passeios/abc123.jpg"],
  idiomas: ["Português", "Inglês"],
  ...
}

// 3. Dados formatados
📝 Tour formatado: {
  id: "passeio_1696789012345_1",
  name: "Tour pelo Centro Histórico",
  price: 75,
  duration: 3,
  type: "Histórico",
  images: ["/uploads/passeios/abc123.jpg"],
  languages: ["Português", "Inglês"],
  ...
}

// 4. Modal preparando
🔄 AddTourModal useEffect: {
  isEdit: true,
  isOpen: true,
  initialData: {...}
}

// 5. Modal carregando dados
✅ Carregando dados para edição: {
  name: "Tour pelo Centro Histórico",
  price: 75,
  ...
}

// 6. Modal renderizando
🎨 Renderizando AddTourModal: {
  isEdit: true,
  isOpen: true,
  hasInitialData: true,
  formData: "Tour pelo Centro Histórico (75)"
}
```

---

## 🚨 SE NADA FUNCIONAR

Execute este checklist:

1. **Limpar Cache do Navegador**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

2. **Reiniciar Servidor Next.js**
   ```bash
   # Terminal onde está rodando npm run dev
   Ctrl+C
   npm run dev
   ```

3. **Verificar Versões**
   ```bash
   node --version  # Deve ser v18+
   npm --version   # Deve ser v8+
   ```

4. **Limpar node_modules**
   ```bash
   cd apps/web
   rm -rf node_modules .next
   npm install
   cd ../..
   npm run dev
   ```

5. **Verificar Passeios no Banco**
   ```sql
   -- No Supabase SQL Editor
   SELECT id, nome, preco, duracao, categoria
   FROM passeios
   ORDER BY criado_em DESC
   LIMIT 5;
   ```

6. **Testar API Diretamente**
   ```bash
   # Substituir ID pelo ID real do banco
   curl http://localhost:5000/api/passeios/passeio_1234567
   ```

---

## 📞 RELATÓRIO DE ERRO

Se ainda não funcionar, envie estas informações:

1. **Logs completos do console** (copiar todo o output)
2. **Screenshot do modal aberto**
3. **Resultado da query SQL** (SELECT * FROM passeios LIMIT 1)
4. **Response da API** (curl /api/passeios/[id])
5. **Logs do terminal** onde roda npm run dev

