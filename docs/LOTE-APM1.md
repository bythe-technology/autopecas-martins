# Lote APM1 - inventário de origem

Fonte: [LOTES APM1.pdf](fontes/LOTES-APM1.pdf), recebido em 10/09/2026. O arquivo possui oito páginas, exportado de uma planilha, e é a fonte de verdade para a próxima importação. Ele contém borrachas e vedações, calhas, faróis/lanternas/lentes, retrovisores, molduras/ponteiras/grades e para-barros.

O catálogo de lançamento usa 18 itens selecionados do lote, com nome, código, marca quando presente, aplicação e preço final mostrado na coluna de venda. Eles estão em `src/lib/catalog.ts` para validar navegação e conversão antes de importar a lista inteira.

## Regra de preço e confirmação

O PDF apresenta, em muitas linhas, valor base e valor final com aparente acréscimo de 30%. O site usa o valor final da linha como **preço de referência do lote**, porque é o valor que acompanha o total por item. Antes da carga definitiva, a loja deve confirmar se esse continua sendo o preço de venda, se há desconto promocional e se há item já esgotado. O importador não pode recalcular preços a partir de suposições.

## Próxima carga do catálogo

1. Extrair cada linha para uma planilha de revisão, preservando descrição literal, código, marca, quantidade e preço final.
2. A cliente confirma aplicação, lado, anos, estado e disponibilidade para cada item que será publicado.
3. Buscar e validar uma foto por código/aplicação; usar foto genérica somente como identificação visual temporária, nunca como prova de compatibilidade.
4. Subir para `catalog-staging`, validar arquivo e vincular ao produto.
5. Publicar apenas os itens aprovados. O produto permanece em rascunho até que foto, preço e descrição sejam conferidos.

Não há importação integral nem foto de produto no banco nesta etapa. Isso evita publicar uma peça errada, preço desatualizado ou imagem de aplicação incompatível.
