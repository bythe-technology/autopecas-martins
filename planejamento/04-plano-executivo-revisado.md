# Plano executivo revisado — Autopeças Martins

Revisão de 09/09/2026. Documento principal para a próxima implementação; complementa e, nas decisões abaixo, substitui as propostas preliminares dos documentos 01–03. Apenas planejamento e inspeção de metadados: nenhuma alteração remota foi executada.

## 1. Resultado e prioridades

Atualização após os dois áudios enviados em 09/09: incluir divulgação da oficina na home, com troca de óleo, alinhamento (menção a equipamento 3D), balanceamento, suspensão e freios, além de CTA para orçamento e destaque de até 10x sem juros no cartão no contexto dos serviços. Ver [análise dos áudios e critérios de implementação](05-pedidos-jeany-audios-09-09.md). Confirmar condições antes da publicação; não estender automaticamente o parcelamento às liquidações. A seção de oficina é distinta do atendimento B2B em /oficinas-e-frotas.

Entregar uma vitrine de peças de baixo giro que a Jeany consiga atualizar pelo celular e que gere consultas identificáveis no WhatsApp. O sucesso inicial será medido pela facilidade de publicação, qualidade dos anúncios e consultas recebidas; vendas dependem do atendimento e do estoque da loja.

Obrigatório: catálogo, busca por nome/código/marca, categorias, ofertas, página individual, WhatsApp, institucional/contato/oficinas, painel com fotos e preços, aplicações manuais, SEO técnico, treinamento e até 20 produtos fornecidos pela cliente. Preservar os limites contratuais de revisão e suporte.

Opcional dentro do orçamento: API para sugerir veículos, somente após uma prova de até três horas. A aplicação conferida manualmente já atende o filtro básico. Integração não pode atrasar catálogo, segurança ou treinamento.

Adiar: ERP, checkout, carrinho, frete, cadastro do consumidor, importação em massa, compatibilidade automática universal, geração de artes, blog, campanhas pagas e dashboard analítica. Não transformar a primeira loja em um construtor universal de sites.

Requisitos não funcionais: HTML indexável; celular e acessibilidade como referência; formulários recuperáveis; autorização em banco; fotos leves; observabilidade simples; recuperação por cliente; custo compartilhado mensurável.

## 2. Inspeção real do Supabase e decisão de isolamento

Em 09/09 foram consultados projetos, tabelas, políticas, funções selecionadas, buckets e Security Advisor pelo conector Supabase. O projeto BYTHE está ativo em São Paulo, com Postgres 17. Foram encontradas 23 tabelas em public, todas com RLS ativada, incluindo clientes, pagamentos, despesas e documentos internos. Existe o bucket privado bythe-private. Não foram lidos registros comerciais, senhas ou tokens.

As políticas internas usam private.is_active_staff(), private.can_write() e private.is_admin(). A função handle_new_auth_user cria staff_profiles com active=false para novos usuários. Isso evita acesso interno imediato, mas exige uma regra de onboarding explícita: cliente de site nunca deve ser ativado como funcionário da BYTHE. A ausência de alerta de RLS no Advisor não prova isolamento entre empresas.

O Advisor indicou proteção contra senhas vazadas desativada. Programar sua ativação na configuração do Auth, conforme disponibilidade do plano, antes de liberar o painel. A tabela privada byte_rate_limits não tem RLS; isso isoladamente não comprova exposição, mas seus grants e RPC precisam entrar na auditoria anterior à implementação.

### Arquitetura escolhida

Um projeto Supabase contém um banco Postgres principal. Cada empresa terá um espaço lógico isolado, e não um banco independente com suas próprias chaves administrativas. Para catálogos pequenos semelhantes, adotar um schema catalog com tabelas compartilhadas e store_id obrigatório. Manter o sistema interno existente separado; não converter suas tabelas para multiempresa como parte deste contrato.

O schema organiza; a proteção vem de grants mínimos, RLS por associação ativa, FKs compostas, políticas de arquivos e credenciais sem privilégios globais. Expor catalog à Data API somente após políticas e testes locais. Não mudar permissões globais do schema public indiscriminadamente.

Cada site terá seu próprio deploy e variáveis. O runtime da Martins usa chave publicável e sessão da Jeany para operações autorizadas; não recebe service_role, secret key administrativa, senha postgres ou token de gestão. Convites e tarefas privilegiadas ficam em operação administrativa restrita da BYTHE. Dados públicos de catálogo podem ser lidos publicamente; rascunhos, associações e auditoria nunca.

store_memberships terá store_id, user_id, papel e ativo. Cliente não altera suas próprias associações nem cria acesso para outra empresa. Na V1, convites e permissões são administrados pela BYTHE, sem uma nova tela de gestão de usuários. Uma associação de catálogo não concede staff_profiles ativo. Consultar associação no banco permite revogar autorização sem depender de claims antigas. Não usar user_metadata para autorizar.

O Auth, SMTP, chaves administrativas, backups e capacidade continuam compartilhados. Cookies devem ser restritos ao host de cada aplicação; redirects de autenticação usam lista exata de destinos. Não usar a conta administrativa interna da BYTHE para navegar no painel público de clientes; separar identidades de operação reduz o impacto de roubo de sessão. Um token válido ainda precisa de associação para acessar outra loja.

Limite assumido: comprometimento do projeto Supabase, de uma credencial global ou da conta administrativa pode atingir todos os clientes. Nenhum schema/RLS elimina esse risco. Clientes com dados sensíveis, requisitos próprios ou consumo relevante devem ter projeto dedicado. O compartilhamento é uma escolha econômica com contenção, não uma garantia de isolamento físico.

### Antes de adicionar a Martins

1. Reproduzir localmente estrutura e políticas necessárias, com dados fictícios da BYTHE e de duas lojas.
2. Auditar grants, funções privilegiadas, triggers do Auth e uso de credenciais nos aplicativos existentes. A inspeção atual não cobriu toda essa superfície.
3. Provar que um novo usuário de loja não acessa clientes, pagamentos, documentos, RPCs internos ou bythe-private, e que não consegue se promover a funcionário.
4. Introduzir o schema e políticas por migration aditiva; testar regressão do sistema interno. Nunca fazer reset do projeto compartilhado.
5. Criar o acesso da Jeany apenas pelo fluxo de associação da loja e registrar a evidência dos testes.

## 3. Produto pensado para a rotina da loja

Começar com cinco peças reais representativas: uma promoção, uma peça sem aplicação confirmada, uma com várias aplicações, uma esgotada e uma peça com código de fabricante. Homologar o cadastro dessas cinco antes de preencher as vinte.

O painel abre em Meus produtos, com botão grande Adicionar peça. Cadastro: fotos → informações essenciais → prévia/publicação. Campos essenciais: nome, categoria, condição, preço ou consulta, disponibilidade e foto. Gerar um código interno legível quando não houver SKU; manter código do fabricante/OEM em campo separado. Duplicação gera novo código interno e rascunho. A Jeany não deve inventar um código técnico para conseguir publicar.

Salvar rascunho é explícito, com confirmação visível. Em erro de rede, preservar o formulário aberto e permitir tentar novamente. Bloquear duplo envio e usar chave de idempotência nas criações. Alterações concorrentes verificam version/updated_at e retornam conflito em vez de sobrescrever silenciosamente. Não implementar sincronização offline complexa na V1.

Lista com foto, preço, estado e ações Editar, Duplicar e Marcar esgotado. Promoção é configurada dentro do produto; banners têm modelo fixo para trocar foto, título, texto e link interno. Não exigir edição de layout. Arquivamento reversível substitui exclusão comum.

Aplicação tem três resultados de interface: cadastrada pela loja, precisa confirmar ou nenhuma aplicação cadastrada. Ausência de vínculo nunca vira Não serve. Marca/modelo/ano sozinhos não justificam um selo de compatibilidade; motor, versão e outras restrições devem aparecer quando relevantes.

Busca prioriza código exato, depois nome/marca. Preservar código original e manter versão normalizada para comparação. Se não houver resultado, mostrar termos buscados, limpar filtros e Consultar esta peça no WhatsApp. Não inventar equivalência de peças por aproximação textual.

## 4. Arquitetura e contratos de dados

Manter Next.js + TypeScript, Server Components para conteúdo público e módulos catalog, promotions, media, vehicles e store-access. Dentro dos módulos: tipos/validadores, casos de uso, repositórios e serviços apenas onde há responsabilidade real. Rotas REST do painel chamam casos de uso; repositórios encapsulam Supabase. Nenhum microserviço, ORM adicional ou estado global por padrão.

Preservar o modelo de entidades do documento 02, com estes ajustes:

- products: internal_code gerado, manufacturer_code opcional, price_mode fixed/on_request, regular_price_cents, version e estados separados de publicação/disponibilidade. Preço fixo deve ser positivo; consulta usa null, nunca zero como oferta.
- product_promotions: uma configuração atual por produto na V1, sem agendamento de múltiplas campanhas. Guardar início, fim e preço promocional válido. Histórico fica na auditoria. Intervalo semiaberto: início inclusivo, fim exclusivo; datas armazenadas em UTC e editadas no fuso de São Paulo.
- product_applications: campos técnicos conferidos e fonte; dados manuais pertencem à loja. Não compartilhar observações entre clientes. Identificador FIPE é opcional.
- product_images: estado pending/ready, caminho, dimensões, bytes e posição. Só permitir publicação após validação das imagens.
- store_memberships e audit_events: acesso privado por operação, nunca por SELECT público. Auditoria gerada no servidor/banco, não confiada ao formulário.

FKs (store_id, parent_id) garantem coerência entre produto, categoria, imagem e aplicação. store_id é imutável para operadores. Índices iniciais em associações por usuário/loja, SKU/slug por loja, loja/status/categoria e referências de relacionamento. Escolher índices de busca com EXPLAIN sobre massa sintética; não adicionar todos os índices possíveis antecipadamente.

Endpoints de criação, edição e publicação validam DTOs e retornam erros do documento 02. Acrescentar 409 EDIT_CONFLICT e suporte à repetição idempotente. Publicação de dados relacionais deve ser transacional. Banco e Storage não compartilham transação: uploads usam etapas e compensação, com limpeza de órfãos somente após janela de segurança e verificação de referências.

## 5. Fotos, preço e cache sem surpresa

Fotos entram em bucket privado de staging, com restrição por loja/produto. Limite inicial de cinco por peça; limite por arquivo definido após testar as fotos reais do celular. Validar bytes, assinatura e dimensões no servidor, remover EXIF e gerar variantes otimizadas. Compressão no browser é conveniência, nunca única validação. Arquivo grande não deve atravessar endpoint com limite de payload menor: upload direto restrito ao staging, seguido de processamento validado.

Na publicação, produzir arquivos sanitizados no bucket público de catálogo e só depois tornar o produto visível. Cada nome inclui identificador e versão para evitar cache de imagem antiga. Fotos publicadas são públicas e podem ter cópias em caches mesmo após arquivamento; não usar esse bucket para documentos ou originais privados. Staging, catálogo e bythe-private têm políticas distintas, sem chave global no site.

Adotar inicialmente HTML dinâmico sem cache persistente para páginas que exibem preço/oferta e para o destino do botão WhatsApp. Cachear imagens e conteúdo institucional. Isso evita depender de cron ou revalidação em segundo plano para retirar promoção vencida; avaliar custo antes de introduzir cache de preço. Se o volume justificar, evoluir com prazo de validade explícito e teste de expiração, não apenas um revalidate genérico.

Uma única função de domínio calcula preço efetivo com o horário atual; card, página, JSON-LD e mensagem usam essa regra. Promoção vencida volta ao preço regular válido ou a consulta. Página aberta antes do vencimento deve retirar a oferta na interface ao atingir o horário e atualizar ao retornar ao foco. O clique consulta novamente o estado no servidor antes de redirecionar ao WhatsApp; se indisponível, permitir contato sem incluir preço antigo. Esta verificação não confirma o estoque físico.

Painel nunca usa cache público. Qualquer cache futuro inclui loja e parâmetros normalizados. Paginação de 24 produtos; fotos abaixo da dobra com lazy loading; sem download do catálogo completo no navegador. Custo dominante esperado: transferência de fotos, seguida de leitura dinâmica sob bots/tráfego alto. Dimensionar com visitas por mês e concorrência observada, sem promessa de 100 mil acessos simultâneos.

## 6. SEO e conversão que cabem na implantação

Domínio ainda não aprovado nem registrado nesta tarefa. apmartins.com.br e autopecasmartinsjairo.com.br foram consultados anteriormente; repetir disponibilidade no registro. Nome exibido deve ser confirmado com Jeany — sua sugestão de domínio não prova mudança da marca para Autopeças Martins Jairo.

Priorizar páginas reais de produto com código, marca, condição, aplicação, preço e retirada em Jacupiranga. Compartilhar uma URL estável por peça; preservar slug ao editar o título. Se a URL precisar mudar, manter redirecionamento individual. Busca interna e combinações arbitrárias de filtros ficam noindex, permitindo rastreamento da diretiva; categorias úteis têm canonical próprio. Não criar páginas repetidas por cidade.

Produto esgotado pode permanecer 200 quando ainda informa e oferece alternativas; arquivado sai de listagens e sitemap e recebe 404/410 quando removido permanentemente. Produto inexistente nunca retorna uma página vazia 200. Ofertas e dados estruturados refletem o conteúdo realmente exibido; consulta de preço não vira Offer de valor zero.

Implantar metadados, sitemap, breadcrumbs, Open Graph e configuração inicial de Search Console quando houver acesso. Validar marca/endereço/WhatsApp e atendimento regional. Relatório inicial simples: páginas indexáveis, consultas de busca e cliques de saída quando medição estiver configurada. Clique não é venda; confirmar resultado no atendimento por código da peça. Acompanhamento recorrente de SEO continua fora da mensalidade básica.

## 7. Ordem de implementação e critérios de saída

| Etapa | Entrega verificável | Condição para avançar |
|---|---|---|
| 0 — Preparação | Cinco peças, domínio/WhatsApp confirmados, ambiente local | Materiais suficientes e modelo validado |
| 1 — Isolamento | Associações, RLS, arquivos e regressão BYTHE | Loja A não acessa privados de B nem dados internos |
| 2 — Jornada completa | Login → rascunho → foto → publicação → WhatsApp | Uma peça real operável no celular |
| 3 — Catálogo e promoção | Busca, categorias, expiração e esgotado | Preço consistente e falhas tratadas |
| 4 — Conteúdo e SEO | Até 20 itens, páginas, metadados e sitemap | Conteúdo real aprovado, HTML indexável |
| 5 — Homologação | Usabilidade, restauração e revisão consolidada | Jeany executa tarefas e recuperação funciona |
| 6 — Publicação | Domínio, HTTPS, pagamento final e entrega | Jornada no domínio final aprovada |

Manter até 20 dias corridos conforme condições contratuais, sem iniciar contagem por suposição. Meta comercial de 28–36 horas só é plausível com base reutilizável e isolamento já resolvido. Reservar a fundação multiempresa como investimento interno da BYTHE, medido separadamente. Se a descoberta exigir reconstrução do sistema compartilhado, replanejar internamente antes de assumir prazo; não diluir esse trabalho oculto nas três horas da API.

Após a jornada da etapa 2, comparar esforço consumido com estimativa restante. Cortes possíveis: refinamentos visuais e integração FIPE opcional. Catálogo contratado, acesso seguro, restauração e treinamento permanecem critérios de entrega.

## 8. Testes obrigatórios antes da publicação

Unitários: preço fixo/consulta, desconto, promoção no instante de início/fim, horário de São Paulo, código, WhatsApp com acentos e campos ausentes, aplicação desconhecida e conflitos de versão.

Integração local com usuários fictícios: visitante, Jeany/loja A, editor da loja B, associação revogada e funcionário interno. Executar SELECT/INSERT/UPDATE/DELETE por API com tokens reais de teste, sem usar service_role para demonstrar RLS. Testar também acesso direto à API, FKs cruzadas, troca de store_id, elevação de papel, RPCs internos e paths do Storage. Ler catálogo público de outra loja não é vazamento; ler seus rascunhos/documentos é.

Jornadas: upload interrompido, repetição de envio, arquivo falso, sessão expirada, salvar preço, promoção que vence com página aberta, esgotar, arquivar, recuperar senha e voltar ao formulário. Verificar tela pequena, teclado, foco, contraste e zoom. Homologar com Jeany sem instrução passo a passo após treinamento.

Operação: restaurar uma peça com suas imagens em ambiente isolado, conferir referências e provar que recuperar a loja A não altera B. Validar Search Console/HTML/JSON-LD, erros HTTP e preview privado/noindex. Não considerar resultados medidos até executar a aplicação; esta revisão validou documentação e metadados somente.

## 9. Operação e condições comerciais atualizadas

Implantação: R$ 1.297 em duas parcelas de R$ 648,50. Primeiro mês de mensalidade gratuito conforme instrução posterior do usuário; depois R$ 149 com vencimento dia 10. Antes da publicação, registrar por escrito início/fim da cortesia e primeiro vencimento, garantindo um mês completo gratuito sem cobrar poucos dias após o lançamento. Não alterar o contrato assinado ou criar cobrança automaticamente nesta revisão.

Domínio separado, titularidade da cliente; o valor anteriormente consultado de R$ 40/ano no Registro.br é registro de endereço, não hospedagem. Confirmar preço no ato. Não foi confirmado recebimento de pagamento ou aceite de domínio.

Preferência do usuário: Vercel Hobby inicialmente e Supabase Pro compartilhado. A documentação vigente da Vercel reserva Hobby a uso pessoal não comercial; fechar no WhatsApp não elimina o caráter comercial. Manter a preferência registrada e resolver o enquadramento de hospedagem antes da publicação — sem contratar plano nesta tarefa. Arquitetura permanece portável e não depende de cron pago para validade de ofertas.

Ratear infraestrutura e monitorar bytes de imagens, leituras e uso por loja. Os 5 GB do contrato são limite de arquivos, não tráfego ilimitado. Provisionar o custo do primeiro mês grátis. Não adicionar integração paga, assento, SMTP ou backup sem incluir no custo interno e respeitar as condições comerciais.

Banco e objetos têm backups distintos. Usar backup do plano conforme configuração real e cópia de objetos para destino independente, com retenção inicial proposta de sete dias. Conferir sucesso e último ponto recuperável; backup configurado não equivale a backup restaurável. Registrar responsável BYTHE, procedimento de recuperação e evidência de teste antes do lançamento. Em incidente, suspender acesso afetado, preservar logs, revogar sessões/credenciais relevantes e recuperar por cliente; restauração global exige avaliação do impacto nos demais.

## Fontes e limites da revisão

- Metadados do projeto BYTHE via Supabase MCP em 09/09/2026; sem auditoria completa de código, grants ou fatura.
- [RLS e grants](https://supabase.com/docs/guides/database/postgres/row-level-security): base para autorização em banco; testes negativos ainda pendentes.
- [Mudança de exposição da Data API](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically): novas tabelas exigem grants explícitos; incluí-los com políticas nas migrations.
- [Controle de acesso a arquivos](https://supabase.com/docs/guides/storage/security/access-control) e [backups](https://supabase.com/docs/guides/platform/backups).
- [Proteção de senhas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection): correção sugerida pelo Advisor.
- [Vercel Hobby](https://vercel.com/docs/plans/hobby): restrição comercial conferida na revisão.
- Pesquisa de empresa/API e condições contratuais: documentos locais anteriores; limites da FIPE e disponibilidade de domínio não foram novamente testados nesta revisão.
