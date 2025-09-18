# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o **TourGuide CRM**! Este documento fornece diretrizes e informações sobre como contribuir efetivamente para o projeto.

## 📋 Índice

- [Código de Conduta](#-código-de-conduta)
- [Como Posso Contribuir?](#-como-posso-contribuir)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Processo de Desenvolvimento](#-processo-de-desenvolvimento)
- [Padrões de Código](#-padrões-de-código)
- [Padrões de Commit](#-padrões-de-commit)
- [Processo de Pull Request](#-processo-de-pull-request)
- [Reportando Bugs](#-reportando-bugs)
- [Sugerindo Melhorias](#-sugerindo-melhorias)
- [Dúvidas](#-dúvidas)

## 🤗 Código de Conduta

Este projeto segue um código de conduta para garantir um ambiente acolhedor para todos. Ao participar, você concorda em manter um comportamento respeitoso e profissional.

### Nossos Compromissos

- **Ser respeitoso** com diferentes opiniões e experiências
- **Aceitar críticas construtivas** graciosamente
- **Focar no que é melhor** para a comunidade
- **Mostrar empatia** com outros membros da comunidade

## 🚀 Como Posso Contribuir?

Existem várias maneiras de contribuir:

### 🐛 Reportando Bugs
- Use o template de issue para bugs
- Forneça informações detalhadas
- Inclua steps para reproduzir
- Adicione screenshots se relevante

### ✨ Sugerindo Funcionalidades
- Use o template de feature request
- Explique o problema que resolve
- Descreva a solução proposta
- Considere alternativas

### 💻 Contribuindo com Código
- Correções de bugs
- Novas funcionalidades
- Melhorias de performance
- Refatoração de código
- Testes automatizados

### 📚 Melhorando Documentação
- Corrigir erros de digitação
- Adicionar exemplos
- Melhorar explicações
- Traduzir conteúdo

### 🎨 Design e UX
- Melhorias na interface
- Sugestões de usabilidade
- Criação de mockups
- Testes de usabilidade

## 🛠 Configuração do Ambiente

### Pré-requisitos
- Node.js 18+
- npm 8+
- Git
- Editor de código (recomendado: VSCode)

### Configuração Inicial

1. **Fork o repositório**
```bash
# Clique em "Fork" no GitHub
```

2. **Clone seu fork**
```bash
git clone https://github.com/SEU-USERNAME/turguide.git
cd turguide
```

3. **Adicione o repositório original como upstream**
```bash
git remote add upstream https://github.com/Elisson78/turguide.git
```

4. **Instale dependências**
```bash
npm install
```

5. **Configure o banco de dados**
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

6. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

### Extensões Recomendadas (VSCode)

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 🔄 Processo de Desenvolvimento

### 1. Sincronizar com Upstream
```bash
git checkout main
git pull upstream main
git push origin main
```

### 2. Criar Branch para Feature/Fix
```bash
# Para nova funcionalidade
git checkout -b feature/nome-da-feature

# Para correção de bug
git checkout -b fix/descricao-do-bug

# Para documentação
git checkout -b docs/atualizacao-docs
```

### 3. Fazer Alterações
- Mantenha commits pequenos e focados
- Teste suas alterações
- Siga os padrões de código
- Adicione testes quando necessário

### 4. Testar Localmente
```bash
# Verificar tipos
npm run check-types

# Executar testes (quando implementados)
npm run test

# Build de produção
npm run build
```

### 5. Commit e Push
```bash
git add .
git commit -m "feat: adiciona funcionalidade X"
git push origin feature/nome-da-feature
```

### 6. Criar Pull Request
- Use o template de PR
- Descreva as alterações claramente
- Referencie issues relacionadas
- Adicione screenshots se relevante

## 📝 Padrões de Código

### TypeScript
- Use tipagem explícita quando necessário
- Evite `any`, prefira tipos específicos
- Use interfaces para objetos complexos
- Documente funções públicas com JSDoc

```typescript
// ✅ Bom
interface User {
  id: string;
  name: string;
  email: string;
}

const createUser = (userData: Omit<User, 'id'>): User => {
  return {
    id: crypto.randomUUID(),
    ...userData
  };
};

// ❌ Evitar
const createUser = (userData: any) => {
  // ...
};
```

### React Components
- Use componentes funcionais
- Prefira hooks ao invés de classes
- Mantenha componentes pequenos e focados
- Use TypeScript para props

```typescript
// ✅ Bom
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ❌ Evitar
export function Button(props: any) {
  return <button {...props} />;
}
```

### CSS/Tailwind
- Use classes utilitárias do Tailwind
- Mantenha consistência com o design system
- Use componentes shadcn/ui quando possível
- Prefira mobile-first

```typescript
// ✅ Bom
<div className="flex flex-col gap-4 p-6 md:flex-row md:gap-6">
  <Card className="flex-1">
    <CardHeader>
      <CardTitle>Título</CardTitle>
    </CardHeader>
  </Card>
</div>

// ❌ Evitar
<div style={{ display: 'flex', padding: '24px' }}>
  <div style={{ flex: 1 }}>
    Conteúdo
  </div>
</div>
```

### tRPC/API
- Use validação Zod em todos os inputs
- Mantenha routers organizados por domínio
- Documente procedures complexos
- Trate erros adequadamente

```typescript
// ✅ Bom
export const clientesRouter = router({
  create: publicProcedure
    .input(z.object({
      nome: z.string().min(1, "Nome é obrigatório"),
      email: z.string().email("Email inválido"),
      telefone: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const cliente = await db.insert(clientes).values({
          id: crypto.randomUUID(),
          ...input,
        });
        return cliente;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao criar cliente',
        });
      }
    }),
});

// ❌ Evitar
export const clientesRouter = router({
  create: publicProcedure
    .input(z.any())
    .mutation(async ({ input }) => {
      const cliente = await db.insert(clientes).values(input);
      return cliente;
    }),
});
```

## 📤 Padrões de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para manter um histórico claro:

### Formato
```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Apenas documentação
- `style`: Mudanças que não afetam o significado do código
- `refactor`: Refatoração sem mudança de funcionalidade
- `perf`: Melhoria de performance
- `test`: Adicionar ou corrigir testes
- `chore`: Mudanças no processo de build ou ferramentas auxiliares

### Exemplos
```bash
# Funcionalidade
git commit -m "feat(agendamentos): adiciona filtro por status"

# Correção
git commit -m "fix(auth): corrige validação de email"

# Documentação
git commit -m "docs: atualiza guia de instalação"

# Refatoração
git commit -m "refactor(components): extrai lógica do dashboard"

# Breaking change
git commit -m "feat(api): remove endpoint legado

BREAKING CHANGE: endpoint /api/old foi removido, use /api/new"
```

## 🔍 Processo de Pull Request

### Template de PR

Ao criar um PR, use este template:

```markdown
## 📝 Descrição
Breve descrição das mudanças realizadas.

## 🎯 Tipo de Mudança
- [ ] 🐛 Correção de bug
- [ ] ✨ Nova funcionalidade
- [ ] 💥 Breaking change
- [ ] 📚 Documentação
- [ ] 🎨 Melhorias de estilo/UI
- [ ] ♻️ Refatoração
- [ ] ⚡ Melhoria de performance
- [ ] ✅ Testes

## 🧪 Como Testar
1. Faça checkout da branch
2. Execute `npm install`
3. Execute `npm run dev`
4. Navegue para [página específica]
5. Teste [funcionalidade específica]

## 📸 Screenshots
(Se aplicável, adicione screenshots)

## ✅ Checklist
- [ ] Meu código segue os padrões do projeto
- [ ] Realizei uma auto-revisão do meu código
- [ ] Comentei meu código em partes complexas
- [ ] Minhas mudanças não geram novos warnings
- [ ] Adicionei testes que provam que minha correção é efetiva
- [ ] Testes novos e existentes passam localmente

## 🔗 Issues Relacionadas
Closes #[número da issue]
```

### Processo de Revisão

1. **Revisão Automática**
   - Verificação de tipos TypeScript
   - Testes automatizados (quando implementados)
   - Verificação de build

2. **Revisão Manual**
   - Qualidade do código
   - Aderência aos padrões
   - Funcionalidade
   - Documentação

3. **Aprovação e Merge**
   - Pelo menos 1 aprovação necessária
   - Todos os checks devem passar
   - Squash and merge preferido

## 🐛 Reportando Bugs

### Template de Bug Report

```markdown
**Descrição do Bug**
Uma descrição clara e concisa do que é o bug.

**Para Reproduzir**
Passos para reproduzir o comportamento:
1. Vá para '...'
2. Clique em '....'
3. Role para baixo até '....'
4. Veja o erro

**Comportamento Esperado**
Uma descrição clara do que você esperava que acontecesse.

**Screenshots**
Se aplicável, adicione screenshots para ajudar a explicar seu problema.

**Informações do Ambiente:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser: [e.g. Chrome, Safari, Firefox]
 - Versão: [e.g. 22]
 - Node.js: [e.g. 18.17.0]

**Contexto Adicional**
Adicione qualquer outro contexto sobre o problema aqui.
```

## 💡 Sugerindo Melhorias

### Template de Feature Request

```markdown
**A sua solicitação de funcionalidade está relacionada a um problema?**
Uma descrição clara do que o problema é. Ex. Eu fico sempre frustrado quando [...]

**Descreva a solução que você gostaria**
Uma descrição clara do que você quer que aconteça.

**Descreva alternativas que você considerou**
Uma descrição clara de quaisquer soluções ou funcionalidades alternativas que você considerou.

**Contexto Adicional**
Adicione qualquer outro contexto ou screenshots sobre a solicitação de funcionalidade aqui.
```

## ❓ Dúvidas

### Canais de Comunicação

- **GitHub Issues**: Para bugs e feature requests
- **GitHub Discussions**: Para discussões gerais
- **Email**: uzualelisson@gmail.com para questões específicas

### FAQ

**Q: Como posso configurar meu editor para seguir os padrões do projeto?**
A: Instale as extensões recomendadas no VSCode e configure o Prettier/ESLint.

**Q: Posso contribuir se sou iniciante?**
A: Absolutamente! Procure por issues marcadas como `good first issue` ou `help wanted`.

**Q: Como posso testar minhas alterações?**
A: Execute `npm run dev` e teste manualmente. Testes automatizados serão implementados em breve.

**Q: Quanto tempo leva para um PR ser revisado?**
A: Tentamos revisar PRs dentro de 2-3 dias úteis.

---

## 🙏 Agradecimentos

Obrigado por contribuir para o TourGuide CRM! Sua colaboração ajuda a tornar este projeto melhor para todos.

---

<div align="center">

**[⬆ Voltar ao topo](#-guia-de-contribuição)**

Feito com ❤️ pela comunidade TourGuide

</div>
