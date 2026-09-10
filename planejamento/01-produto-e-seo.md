# Produto, experiência e SEO

Revisado em 09/09/2026: consultar primeiro o [plano executivo](04-plano-executivo-revisado.md), que define código interno automático, cadastro piloto, busca sem resultado e tratamento de preço vencido também no cache e na página aberta.

## Objetivo e escopo

Transformar peças de baixo giro em oportunidades de atendimento pelo WhatsApp. A primeira versão é catálogo comercial; solicitação de reserva depende de confirmação da loja, pois não existe sincronização com estoque físico.

Requisitos funcionais: institucional, catálogo pesquisável, categorias/filtros básicos, página de produto, liquidações, atendimento de oficinas/frotas, contatos/mapa, painel autenticado com produtos/imagens/preços/promoções/banners, treinamento e até 20 itens demonstrativos. O seletor assistido de veículos é uma melhoria condicionada à prova técnica e ao esforço disponível.

Requisitos não funcionais: celular como prioridade, uso simples pela proprietária, acessibilidade, páginas legíveis por buscadores, carregamento leve, isolamento de dados, recuperação operacional, custos mensais controlados e código modular.

## Mapa do site

| Página | Conteúdo/ação |
|---|---|
| `/` | Marca, proposta local, busca, ofertas prioritárias, categorias, história breve e contato |
| `/pecas` | Busca por nome/código/marca; categoria, promoção e aplicação cadastrada |
| `/pecas/[slug]` | Fotos, título, código, marca, aplicação, estado, preço, disponibilidade e WhatsApp |
| `/liquidacoes` | Ofertas vigentes; descontos calculados; itens de estoque limitado |
| `/categorias/[slug]` | Produtos reais da categoria; indexar somente páginas úteis |
| `/oficinas-e-frotas` | Chamada comercial contratada; atendimento e orçamento no WhatsApp |
| `/contato` | Localização, horários confirmados, WhatsApp e orientação para retirada |
| `/privacidade` | Dados efetivamente tratados e contato responsável |
| `/admin` | Login e gestão restrita; fora do índice de busca |

A história pode ficar na inicial para economizar uma página. Não criar blog, cadastro de consumidor, carrinho ou conta de cliente na V1.

## Página inicial e promoção

Complemento dos áudios de 09/09: após os destaques do catálogo, incluir seção Serviços de oficina, com cinco cards, foto real, orçamento pelo WhatsApp e condição de até 10x sem juros vinculada à oficina, após confirmar seu alcance. Menu Serviços aponta para a seção. Preservar /oficinas-e-frotas como atendimento profissional. Detalhes, texto-base e aceite no [registro dos pedidos da Jeany](05-pedidos-jeany-audios-09-09.md).

Ordem recomendada: cabeçalho simples → busca/oferta principal → peças em liquidação → categorias → confiança/história → oficinas/frotas → localização. Usar uma oferta principal estática e cards de produtos. Banners são gerenciáveis, mas não precisam de carrossel automático.

Toda oferta deve ter preço atual, preço anterior real quando houver, validade opcional, condição da peça, disponibilidade e código. Percentual calculado automaticamente apenas quando preço anterior > promocional > 0. Não inventar desconto, contador regressivo ou “últimas unidades”. Se só houver preço atual, publicar sem preço riscado.

Promoção vencida deixa a vitrine promocional automaticamente pela regra de consulta, mesmo se um job falhar. A página continua com preço regular válido ou com consulta de preço. Produto esgotado perde chamada de disponibilidade, mas mantém informação útil e alternativas quando houver. Não redirecionar todos os esgotados para a home.

## Painel para Jeany

Tela inicial com três ações principais: **Adicionar peça**, **Meus produtos**, **Promoções e banners**. Contadores simples de publicados/rascunhos/esgotados; evitar gráficos sem decisão prática.

Cadastro em três etapas curtas:

1. **Fotos**: escolher do celular ou câmera; primeira vira capa; progresso, prévia, remover e reordenar. Meta inicial: até cinco fotos por peça, sujeita ao teste com a cliente.
2. **Informações**: nome, código, categoria, marca da peça, descrição simples, preço e disponibilidade. “Está em promoção?” revela preço anterior e validade. “Aplicação no veículo” é seção complementar.
3. **Revisar e publicar**: mostrar o card como aparecerá; ações “Salvar rascunho” e “Publicar”. Confirmação clara com link para ver o produto.

Lista com foto, nome, preço, situação e ações grandes “Editar”, “Duplicar”, “Marcar esgotado”. Duplicar retorna a rascunho e exige novo código; não repetir oferta publicada acidentalmente. Preferir arquivamento reversível à exclusão definitiva.

Fonte legível, controles de cerca de 44–48 px, labels persistentes, máscara monetária brasileira e erros junto do campo. Não exigir arrastar como única forma de interação. Navegação por teclado e zoom 200%. Preservar o preenchimento após erro; avisar antes de sair com alterações. Se sessão expirar, permitir autenticar sem perder o formulário quando tecnicamente seguro.

Teste de usabilidade: após treinamento, Jeany deve conseguir cadastrar uma peça, alterar preço, finalizar promoção e marcar esgotado sem orientação passo a passo. Meta interna: cadastro básico em até três minutos depois de preparar fotos/dados; medir, não prometer.

## Conversão para WhatsApp

CTA “Consultar esta peça no WhatsApp”. Na página de produto, botão visível no celular sem cobrir conteúdo. Link `wa.me` com texto codificado; a abertura não envia a mensagem automaticamente.

Modelo de mensagem:

> Olá! Vi no site a peça [nome], código [SKU], anunciada por [preço]. Meu veículo é [seleção informada]. Gostaria de confirmar aplicação e disponibilidade. Link: [URL do produto].

Preço na mensagem é referência do anúncio consultado. Sem seleção, não inventar veículo. Em esgotados, trocar por “Consultar alternativas”. Solicitação de reserva não debita estoque e não promete separação automática. Mapa inicialmente como link “Como chegar”, com incorporação sob demanda se necessária para performance.

## SEO local e de produtos

Prioridade técnica: HTML renderizado no servidor, URLs estáveis, título/descrição por peça, canonical, sitemap de publicados, robots, Open Graph, breadcrumbs, imagens otimizadas e status HTTP corretos. Título sugerido: “[Peça] [código/marca] em Jacupiranga | Autopeças Martins”. Não acumular cidades em todo título.

Intenções para validar após publicação, sem volumes estimados:

| Intenção | Página indicada |
|---|---|
| autopeças em Jacupiranga | Inicial e contato |
| peças em promoção Jacupiranga | Liquidações |
| [nome/código de peça] Jacupiranga | Produto específico |
| [peça] [modelo/motor/ano] | Produto com aplicação real cadastrada |
| fornecedor de peças para oficinas Vale do Ribeira | Oficinas/frotas |

Conteúdo de produto deve responder: o que é, código, marca, condição, unidade/par/kit, aplicação conferida, preço vigente, retirada/atendimento. Não gerar centenas de descrições genéricas nem vincular modelos sem evidência.

Adicionar dados estruturados adequados de negócio local, produto/oferta e breadcrumb com informações visíveis e verdadeiras. Não inserir avaliações inventadas. Como o fechamento ocorre no WhatsApp, não pressupor elegibilidade para experiências de Merchant Center/compra direta; validar requisitos antes de qualquer feed. Rich results não são garantidos. [Google: produto](https://developers.google.com/search/docs/appearance/structured-data/product-snippet), [negócio local](https://developers.google.com/search/docs/appearance/structured-data/local-business).

Normalizar nome/endereço/telefone entre site e Perfil da Empresa. Conferir categoria principal, horários, fotos e URL quando houver acesso. Relevância, distância e destaque influenciam resultados locais; o site sozinho não controla a distância de quem pesquisa. [Google: classificação local](https://support.google.com/business/answer/7091?hl=pt-BR).

Jacupiranga é o foco inicial. Mencionar atendimento às cidades vizinhas apenas com logística confirmada. Não criar páginas iguais trocando nome de cidade: isso pode caracterizar páginas de entrada e conteúdo sem utilidade. [Políticas de spam do Google](https://developers.google.com/search/docs/essentials/spam-policies).

Filtros combinatórios e buscas internas não devem produzir milhares de páginas indexáveis. Categorias relevantes recebem URLs próprias; demais parâmetros usam estratégia consistente de canonical/noindex, definida antes da implementação. Bloqueio no robots não substitui noindex quando o Google precisa ler a diretiva.

## Rotina de venda sugerida à loja

No lançamento: selecionar até 20 peças com aplicação conhecida e preço aprovado. Toda semana: conferir ofertas ativas, substituir destaques e retirar anúncios esgotados. Compartilhar links das peças nos canais próprios; não contratar mídia ou automatizar mensagens nesta fase. A loja alimenta o catálogo; produção recorrente de artes e SEO contínuo são trabalho adicional.

Indicadores: impressões/cliques orgânicos no Search Console, visualizações de produto quando houver medição implantada, cliques no WhatsApp e vendas confirmadas pela loja. Clique não é mensagem enviada nem venda. Registrar SKU e origem no atendimento permite aprender quais ofertas geram pedidos, sem exigir CRM na primeira versão.

Definir uma linha de base após lançamento; revisar em 30/60/90 dias se contratado ou dentro de tarefa pontual. Não prometer resultado em 20 dias nem ranqueamento regional imediato.
