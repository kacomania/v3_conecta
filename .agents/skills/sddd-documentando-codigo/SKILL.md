---
name: sddd-documentando-codigo
description: Documenta de forma autônoma arquivos de código-fonte em Dart (Flutter) e TypeScript (Next.js), aplicando padrões Dartdoc e JSDoc com foco em regras de negócio. Disparado quando o usuário pede para documentar classes, repositórios ou Server Actions.
---
# SDDD DocGen (Documentando Código)

Documenta de forma autônoma arquivos de código-fonte em Dart (Flutter) e TypeScript (Next.js), aplicando padrões Dartdoc e JSDoc com foco em regras de negócio.

## Diretrizes de Conteúdo

**Regra de Ouro:** Não documentar o óbvio (ex: "esta função soma A e B"). Documentar as regras de negócio e o "Por Quê" das decisões.

### Flutter (Dart)
Exigir o uso de `///` (Dartdoc). Focar na Clean Architecture (explicar o que os Repositories e Notifiers fazem).

```dart
/// Manipula a lógica de negócio principal para [Entidade].
/// 
/// O motivo pelo qual usamos essa abordagem é [Por Quê].
/// Não responsável por requisições HTTP, para isso consulte [OutraClasse].
class ExemploRepository {
  /// Executa [Ação] garantindo que [Regra de Negócio] seja respeitada.
  void realizarAcao() {}
}
```

### Next.js (TS)
Exigir o uso de `/** ... */` (JSDoc). Focar nas Server Actions, detalhando parâmetros, retornos e interações com o Supabase SSR.

```typescript
/**
 * Executa [Ação] no lado do servidor interagindo com Supabase.
 * Esta Server Action roda no servidor para proteger o RLS e garantir [Regra de Segurança].
 * 
 * @param {Tipo} parametro - Descrição relevante para a regra de negócio.
 * @returns {Promise<TipoRetorno>} O resultado contendo [Informação].
 */
export async function serverActionExemplo(parametro: Tipo) {
  // Implementação...
}
```

## Checklist de Workflow

Copie o checklist abaixo para acompanhar o processo de documentação:

- [ ] Identificar a linguagem e o framework do arquivo (Dart/Flutter ou TS/Next.js).
- [ ] Analisar o código para separar lógica óbvia de regras de negócio estritas.
- [ ] Injetar Dartdoc (`///`) ou JSDoc (`/** */`) nos métodos e classes principais.
- [ ] Explicar o contexto arquitetural (ex: "Esta Server Action roda no servidor para proteger o RLS").
- [ ] Validar se o código documentado não quebrou a sintaxe original.
- [ ] Retornar o código documentado ou aplicar as modificações diretamente.
