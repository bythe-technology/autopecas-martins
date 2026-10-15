# Relatório de melhorias — Auto Peças Martins

**15 de outubro de 2026 · BYTHE Technology**

Site: https://www.apmartins.com.br

## Objetivo

Melhorar a apresentação da loja e facilitar a descoberta das peças e das informações da empresa nos mecanismos de pesquisa, especialmente nas buscas por Auto Peças Martins, autopeças em Jacupiranga e peças no Vale do Ribeira.

## Melhorias realizadas

- Nova seção na página inicial com apresentação local, endereço, serviços e acesso direto ao estoque completo.
- Organização visual em cartões, com hierarquia clara, contraste, estados de foco e adaptação para celular.
- Perguntas frequentes sobre compra pelo WhatsApp, confirmação da aplicação e consulta de peças fora do catálogo.
- Novo índice de estoque em `/pecas`, dividido em páginas de 24 produtos com links numerados.
- Cada página do índice tem endereço próprio, título, descrição e URL canônica. Isso permite percorrer o estoque sem depender de clicar no botão “Carregar mais”.
- Links para o índice no rodapé e na página inicial, reforçando a navegação entre a loja, o catálogo e os produtos.
- Dados estruturados do tipo CollectionPage e ItemList nas páginas do índice, descrevendo os produtos realmente exibidos.
- Sitemap atualizado para incluir o novo índice e as páginas dos produtos.

## O que a auditoria encontrou

A página inicial estava acessível e permitia indexação. O catálogo principal carregava novos produtos por botão: essa experiência é útil para visitantes, mas os robôs de busca normalmente não clicam em botões para descobrir conteúdo. A nova navegação por links resolve essa limitação sem obrigar o cliente a carregar todo o estoque de uma vez.

Na consulta pública realizada nesta revisão, apareceram diretórios e referências à empresa, mas o domínio não apareceu entre os resultados retornados. Esse teste não é uma medição oficial do Google nem prova que o domínio esteja desindexado. A causa exata da baixa visibilidade exige os relatórios do Google Search Console.

## Verificações

- Compilação de produção aprovada, com verificação de tipos e lint do Next.js.
- Teste automatizado de páginas de estoque, links de navegação, URL canônica, sitemap, robots.txt e validade do JSON dos dados estruturados.
- Primeira e segunda páginas com 24 produtos cada e sem repetição entre elas.
- Sitemap gerado com 643 endereços: seis páginas principais e 637 produtos no momento da verificação.
- Interface conferida nos tamanhos de tela 375, 768 e 1440 pixels.

## Próximos passos para ganhar visibilidade

1. Verificar a propriedade do domínio no Google Search Console e enviar `https://www.apmartins.com.br/sitemap.xml`.
2. Usar a inspeção de URL para conferir a página inicial e produtos e identificar bloqueios, exclusões ou erros de indexação.
3. Atualizar o Perfil da Empresa no Google com o site oficial, nome, telefone, endereço, horários e fotos reais consistentes com a loja.
4. Pedir avaliações autênticas aos clientes e respondê-las, sem compra ou incentivo condicionado à nota.
5. Manter preços, disponibilidade, imagens e aplicações das peças revisados e atualizar referências externas que ainda não apontem para o site oficial.
6. Acompanhar impressões, cliques, consultas de marca e indexação de produtos no Search Console antes de comparar resultados.

Essas configurações de conta não foram realizadas nesta entrega: não houve acesso verificado ao Search Console nem ao Perfil da Empresa. Não foram inventadas métricas de tráfego, ranking ou prazo de resultado.

## Resultado esperado

O site oferece uma navegação mais clara e novos caminhos de descoberta para o estoque. As melhorias aumentam a capacidade de rastreamento e ajudam os buscadores a entender a relação da loja com Jacupiranga e o Vale do Ribeira. A primeira posição não pode ser garantida: o Google considera relevância, concorrência, localização, qualidade e outros sinais. O efeito deve ser acompanhado com dados reais após o novo rastreamento.

Referências: [Google: paginação de catálogos](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading), [links rastreáveis](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) e [dados de empresas locais](https://developers.google.com/search/docs/appearance/structured-data/local-business).
