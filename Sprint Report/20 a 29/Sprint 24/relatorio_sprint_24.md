# Relatório Unificado - Sprint 24 (Portal de Transparência Público)

## 1. Resumo Executivo
Nesta Sprint, entregamos a primeira versão pública do Portal de Transparência do ecossistema Conecta. A nova página web foi projetada para que os cidadãos possam acompanhar os indicadores de zeladoria urbana da sua prefeitura (chamados resolvidos, em andamento, pendentes e índice de satisfação) sem a necessidade de criação de conta ou login. Além das métricas, o portal inclui um mapa de visualização focado exclusivamente nos chamados concluídos, trazendo prestação de contas clara para a população, com total conformidade com a LGPD (Lei Geral de Proteção de Dados).

## 2. Blueprint (Arquitetura)
### Banco de Dados (Supabase)
- **Desafio de RLS:** A tabela `occurrences` possui restrições RLS, impedindo a leitura irrestrita por usuários anônimos.
- **Solução:** Foi criada a RPC `get_public_transparency_metrics(p_prefeitura_id UUID)` com a diretiva `SECURITY DEFINER`, permitindo o acesso apenas aos totais agrupados de status e média de avaliação (CSAT).
- **Anonimização de Dados (LGPD):** A query de pontos do mapa recupera estritamente o `id`, `latitude`, `longitude` e `categoria`. Descrições dos problemas, fotos e dados do criador (`user_id`) são bloqueados diretamente no SQL.
- A tabela `prefeituras` teve sua política de RLS atualizada para permitir `SELECT` por usuários anônimos (`anon`), de forma que o frontend possa consultar dinamicamente a logo, nome e paleta de cores públicas.

### Frontend Web (`gestao_conecta` - Next.js)
- **Ajustes de Middleware:** Atualização no `src/middleware.ts` para liberar a rota `/transparencia/*` e contornar os redirecionamentos para a página de `/login`.
- **Server Actions:** Implementada a ação `getTransparencyMetrics` para consumir a RPC do Supabase de forma assíncrona usando o `createClient` adaptado ao Next.js 15+ (com validação em promises para cookies e params de rota).
- **Componentização UI:** Substituição do componente externo de `Card` do *shadcn* para `div` puras implementadas em Tailwind CSS de forma a prevenir falhas na árvore de dependências, garantindo as métricas visuais Premium.

## 3. Walkthrough (Log de Validação)
### Etapas Executadas:
1. **Configuração de Banco de Dados:** Escrito e injetado o arquivo `02_rpc_transparencia.sql` com as regras de extração e RLS. Adicionados GRANTS para `anon`.
2. **Construção das Rotas:** Rota `/transparencia/[id]` adicionada e integrada com os dados da tabela `prefeituras`.
3. **Mapeamento de Coordenadas (PublicMap):** 
   - Foi utilizado o `react-leaflet` para renderização visual do mapa.
   - **Camada de Ofuscação de Endereços:** Para evitar o risco de dedução do endereço exato da residência de um cidadão, o sistema aplica um "jitter" (desvio aleatório) no momento da renderização, além de usar um marcador translúcido.
   - **Valores Utilizados na Sprint:** 
     - Os marcadores em formato de 'Pinos' foram substituídos por um `Circle` com 250 metros de raio (500m de diâmetro).
     - **Opacidade:** Definida em `15%` (`fillOpacity: 0.15`) para maior sutileza no design.
     - **Variação/Jitter Aleatório:** Configurado em `20%` do diâmetro (ou seja, até **100 metros** de desvio por coordenada usando a variação `~0.0009` em graus geográficos). Isso faz com que cada acesso exiba o chamado dentro da área real, mas nunca no exato "ponto zero".
4. **Resolução de Erros de Build:** Dependências de ícones (`lucide-react`) configuradas, correção no destructuring de params como Promise (atualização técnica do Next.js 15) e imagens públicas do bucket autorizadas no `next.config.ts`.
5. **Testes de Integração:** O portal carrega dados usando um ID de "Prefeitura de Teste" retornando HTTP 200 via `localhost:3000`.

**Status Final:** Homologado e enviado para branch.
