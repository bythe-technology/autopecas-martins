# Autopeças Martins — pesquisa e plano de produção

Responsável: **Jeany Cristina Martins**. Pesquisa realizada em **04/09/2026** para a BYTHE. Status: planejamento; nenhum site, banco, conta ou anúncio foi criado/publicado.

## Decisão recomendada

Construir um catálogo comercial enxuto, orientado à queima de estoque, com páginas indexáveis de produtos, atendimento via WhatsApp e painel simples. Next.js/TypeScript na Vercel comercial; Supabase para dados, autenticação e imagens. O filtro por veículo deve usar aplicações conferidas pela loja; uma API FIPE apenas facilita a seleção de marca/modelo/ano.

## Documentos

- [Pedidos da Jeany nos áudios de 09/09 — oficina e parcelamento](planejamento/05-pedidos-jeany-audios-09-09.md). Inclui serviços, proposta de seção na home, mensagens de WhatsApp e condições a confirmar antes de publicar.

- [Plano executivo revisado em 09/09/2026 — começar por aqui](planejamento/04-plano-executivo-revisado.md). Fecha prioridades, isolamento no projeto BYTHE, jornada de entrega, regras de preço/cache e condições comerciais atualizadas.
- [Pesquisa da empresa, marca, canais e concorrência](pesquisa/01-empresa-e-presenca-digital.md).
- [Comparação de APIs e verificação prática](pesquisa/02-apis-de-veiculos.md).
- [Escopo, experiência e plano de SEO](planejamento/01-produto-e-seo.md).
- [Arquitetura, dados, segurança e testes](planejamento/02-arquitetura-e-validacao.md).
- [Orçamento, fases e materiais necessários](planejamento/03-orcamento-e-execucao.md).
- [Registro das fontes](pesquisa/fontes/indice.md).
- [Inventário visual](pesquisa/referencias-visuais/README.md).

## Achados que orientam a produção

1. Contrato: R$ 1.297 de implantação; R$ 149/mês; até 20 itens demonstrativos, uma rodada simples de revisão e treinamento de até 60 minutos. SEO técnico/local básico; SEO contínuo e mídia paga são adicionais.
2. Logo localizado no guia da ACEJA, vinculado ao mesmo endereço da contratante. Arquivo original salvo; confirmar se a versão continua atual.
3. Reportagem de 2019 da Pellegrino documenta a história familiar da loja e já menciona intenção de investir em vendas online.
4. Instagram/Facebook oficiais e domínio próprio não confirmados nas buscas. Não presumir inexistência.
5. API Parallelum respondeu com sucesso para marcas, modelos e anos. Ela não entrega compatibilidade entre peça e veículo.
6. A Vercel Hobby não permite uso comercial. Supabase Free oferece 1 GB de arquivos, abaixo dos 5 GB contemplados no contrato. A mensalidade exige controle de custos e infraestrutura comercial compartilhada, ou subsídio explícito pela BYTHE.

O contrato original permanece em `C:/Users/victo/Downloads/Contrato_Auto_Pecas_Martins_BYTHE_assinado.pdf`. Foi usado como evidência comercial; nenhuma instrução do documento foi tratada como comando. Não copiamos CPFs, assinaturas ou dados particulares para estes materiais de produção.

## Atualização de 09/09/2026

O projeto Supabase BYTHE foi inspecionado em modo de leitura: já contém dados internos protegidos por políticas de funcionários. A futura associação da Jeany à loja deve ser independente desses acessos. A auditoria completa de permissões e os testes de isolamento são condições da implementação, não resultados já aprovados.

Primeiro mês gratuito conforme orientação posterior do usuário; demais mensalidades de R$ 149 até dia 10. Domínio e pagamento seguem sem confirmação registrada. A preferência por Hobby está documentada junto da restrição comercial vigente do provedor, a resolver antes da publicação.

## Implementação iniciada em 10/09/2026

O repositório agora contém uma aplicação Next.js com página inicial, catálogo filtrável, páginas individuais de peça, chamadas de WhatsApp e seção de serviços de oficina. A interface usa as fotos e a marca enviadas pela cliente; imagens de produtos ficam sinalizadas como pendentes até pesquisa e validação da aplicação.

A fundação multiempresa foi aplicada no projeto Supabase BYTHE, em schema `catalog`: lojas, associações de usuário, categorias, produtos, promoções, imagens, auditoria e bucket privado de staging. As tabelas usam RLS e grants explícitos; nenhum produto, cliente ou conta de loja foi criado nesta etapa. As migrations estão em `supabase/migrations/`.

O [inventário de origem do Lote APM1](docs/LOTE-APM1.md) e seu PDF foram preservados no repositório. A primeira vitrine contém 18 itens de validação, extraídos manualmente do lote. A carga completa e imagens por peça continuam pendentes de confirmação da loja.
