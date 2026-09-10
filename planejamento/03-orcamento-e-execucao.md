# Orçamento, etapas e insumos

Atualização de 09/09/2026: o [plano executivo revisado](04-plano-executivo-revisado.md) registra primeiro mês gratuito, vencimentos posteriores dia 10, domínio pendente e inspeção inicial do Supabase. A fundação multiempresa é investimento interno BYTHE, separado da estimativa do catálogo. As projeções financeiras abaixo são cenários preliminares, não fatura ou capacidade confirmada.

## Base contratual

Termo de 03/09/2026 fornecido pelo usuário: implantação R$ 1.297,00 em duas parcelas de R$ 648,50; mensalidade R$ 149,00 após publicação, dia 10. Prazo até 20 dias corridos condicionado ao aceite, primeiro pagamento e materiais completos. Não foi verificado pagamento nem calculada data de entrega a partir de suposição.

Até 20 produtos demonstrativos fornecidos pela cliente, uma rodada consolidada de ajustes simples e treinamento remoto de até 60 minutos. Correções/adequações por 30 dias após publicação conforme contrato. Manutenção contempla uma solicitação técnica simples/mês de até 30 minutos, não acumulável; rotina de produtos é da loja. Até 5 GB de arquivos do catálogo. Domínio à parte em nome/CNPJ da contratante.

Sem checkout, frete automático, ERP, marketplace, sincronização de estoque, fiscal, app, tráfego pago, produção recorrente de conteúdo ou SEO contínuo na V1. “Anúncios” aqui são ofertas/cards/banners no site. Campanhas pagas e sua gestão exigem orçamento separado.

Referências contratuais de adicionais: ajuste simples R$ 40; alteração intermediária a partir de R$ 120; página padrão a partir de R$ 180; funcionalidade/integração a partir de R$ 300. São mínimos, não estimativas prontas para integração de compatibilidade ou ERP.

## Esforço de implementação — estimativa interna

Complemento de 09/09: reservar estimativa incremental de 2–3h para seção institucional de oficina solicitada nos áudios, com conteúdo pronto. Proposta de absorção na reserva da implantação, priorizando-a sobre FIPE opcional; conferir saldo real antes de comprometer prazo. Não inclui agenda, cadastro de serviços no painel ou página adicional. Ver [detalhamento](05-pedidos-jeany-audios-09-09.md).

| Bloco | Horas propostas |
|---|---:|
| Materiais e alinhamento final | 2 |
| Estrutura visual responsiva reutilizável | 4 |
| Catálogo, produtos, promoções e WhatsApp | 5 |
| Painel, autenticação, dados e imagens | 7 |
| Prova e seletor simples de veículos | 3 |
| SEO/configuração inicial e publicação | 3 |
| Testes, ajustes consolidados e treinamento | 6 |
| Total alvo | 30 |

Faixa prudente: 28–36 horas, condicionada a reaproveitamento de componentes maduros e materiais limpos. R$ 1.297 / 30h = R$ 43,23/h brutos; em 36h = R$ 36,03/h. Não inclui impostos, despesas, manutenção futura ou pesquisa atual. O desconto por indicação é decisão comercial; retorno da indicação não deve ser contado como receita garantida.

Se o painel for todo criado do zero ou as aplicações vierem sem conferência, essa faixa pode ser insuficiente. Preservar segurança e testes; reduzir personalização visual e integração opcional, não controles de acesso. Evitar um sistema universal de compatibilidade, gerador de artes ou ERP paralelo dentro do desconto.

## Custos recorrentes verificados

- **Vercel Hobby:** somente uso pessoal não comercial. Planejar Pro; documentação consultada informa taxa de plataforma de US$ 20/mês, com um assento de deploy e US$ 20 de crédito de uso. Verificar excedentes e assentos adicionais. [Hobby](https://vercel.com/docs/plans/hobby), [Pro](https://vercel.com/docs/plans/pro-plan).
- **Supabase Pro:** a partir de US$ 25/mês, com créditos de compute; criar projetos adicionais aumenta compute. Não equivale a US$ 25 para projetos dedicados ilimitados. [Preços](https://supabase.com/pricing), [cobrança](https://supabase.com/docs/guides/platform/billing-on-supabase).
- **Storage:** Free 1 GB; Pro 100 GB incluídos por organização. Os 5 GB contratuais da Martins precisam de orçamento disponível, inclusive quando compartilhado. [Storage](https://supabase.com/docs/guides/platform/manage-your-usage/storage-size).
- **API FIPE:** candidata gratuita com limites; nenhuma assinatura foi criada.
- **Domínio, e-mail/SMTP, armazenamento adicional de backups e excedentes:** conferir custos reais antes da produção. Recuperação de senha depende de entrega de e-mail confiável.

Cenário isolado mínimo de Vercel Pro + Supabase Pro: **US$ 45/mês antes de adicionais/impostos**. Usando câmbio meramente ilustrativo de R$ 5,50/US$ (não é cotação consultada), isso equivale a R$ 247,50, acima da mensalidade antes do suporte.

## Modelo econômico recomendado

Usar infraestrutura comercial BYTHE já existente, **se houver capacidade e isolamento comprovado**. Não foi inspecionada a conta real, o plano atual, outros clientes ou a fatura. Ratear custo fixo e atribuir consumo variável por cliente. Um projeto Supabase compartilhado economiza compute, mas aumenta exigência de testes, backup por tenant e observabilidade.

Exemplo interno com o mesmo câmbio hipotético, mesmo plano, mesmo projeto Supabase e sem extras:

| Clientes dividindo US$ 45 | Fixo estimado por cliente | Saldo dos R$ 149 antes de trabalho/impostos |
|---|---:|---:|
| 1 | R$ 247,50 | -R$ 98,50 |
| 5 | R$ 49,50 | R$ 99,50 |
| 10 | R$ 24,75 | R$ 124,25 |

Esse exemplo não promete margens nem capacidade ilimitada. Fórmula de contribuição: 149 − fixo rateado − consumo atribuível − backup/serviços − impostos/taxas − horas de suporte × custo interno/hora. Com cinco clientes, provisão variável hipotética de R$ 15 e 0,5h a custo interno de R$ 60/h, restariam R$ 54,50 antes de impostos e incidentes.

Definir alertas de consumo e projeção por cliente, especialmente tráfego de imagens, transformações e crescimento de arquivos. Alertar antes de 80% da capacidade disponível/contratual e ajustar a capacidade antes de impedir uma operação já coberta. Nenhum custo adicional à cliente deve ser aplicado automaticamente: seguir comunicação/aprovação previstas no contrato.

## Fases dentro dos 20 dias

1. Dias 1–3: confirmar materiais, infraestrutura, domínio, produto piloto, modelo de dados e visual.
2. Dias 4–8: catálogo público, páginas e layout responsivo.
3. Dias 9–13: painel, uploads, promoções, aplicações básicas e até 20 produtos.
4. Dias 14–16: testes de segurança/funcionais, SEO, performance e restauração.
5. Dias 17–20: homologação, rodada consolidada, treinamento, pagamento final e publicação.

Distribuição proposta, não agenda já iniciada. Atrasos de material e respostas alteram o fluxo conforme contrato. Entregar uma amostra de cadastro cedo para descobrir dificuldade da operadora antes de cadastrar os 20 itens.

## Materiais a solicitar quando começarmos

- Logo original e confirmação do emblema encontrado; fotos atuais de fachada/equipe/estoque.
- Links diretos de Instagram/Facebook/Perfil Google, se existirem; domínio atual e acesso apropriado.
- Confirmação do WhatsApp que recebe vendas, horários e pessoa que responde.
- Lista de até 20 peças: código, nome, marca, categoria, condição, aplicação comprovada, preço atual/anterior, validade, quantidade ou disponibilidade e fotos.
- Cidades atendidas, retirada/entrega, prazo de reserva, formas de pagamento no atendimento e condições comerciais reais.
- Quem pode publicar e quem confere aplicação; equipamento usado no painel.
- Sistema atual de estoque e possibilidade de exportação simples, apenas para planejar continuidade.
- Confirmação de recebimento da primeira parcela para início da execução, sem presumir a partir da assinatura.

Não é necessário responder a tudo agora. Esses itens compõem o checklist de produção; a pesquisa e o planejamento já podem ser usados.

## Riscos e decisões de contenção

| Risco | Tratamento |
|---|---|
| Compatibilidade errada | Aplicação verificada com fonte; sem selo automático a partir da FIPE |
| Oferta desatualizada | Expiração na consulta, rotina da loja e ação fácil de esgotar |
| Uso difícil do painel | Fluxo curto, teste com Jeany e treinamento de operação real |
| Margem mensal insuficiente | Rateio comprovado, orçamento por cliente, sem infraestrutura gratuita comercial inadequada |
| Vazamento entre clientes | RLS, FKs compostas e testes negativos como bloqueio de publicação |
| Perda de fotos | Backup separado de arquivos e restauração testada |
| API gratuita indisponível | Cache permitido e cadastro manual |
| Expectativa de SEO ilimitado | Entrega técnica/local básica bem feita; estratégia contínua como fase adicional |

Próximo passo quando a produção for autorizada: validar os primeiros cinco produtos reais, conferir capacidade da BYTHE e montar uma única jornada completa de cadastro e consulta antes de expandir o catálogo.
