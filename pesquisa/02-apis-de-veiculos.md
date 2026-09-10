# APIs de veículos e compatibilidade

## Recomendação

Usar **Parallelum/FipeAPI como auxílio opcional de cadastro**, com cache e alternativa manual. Guardar no Supabase a aplicação conferida pela loja. O catálogo público filtra esses vínculos locais, sem depender de uma chamada externa para cada visitante.

Marca/modelo/ano identifica um veículo de forma parcial. Compatibilidade de peça pode exigir motor, combustível, versão, transmissão, lado, eixo, faixa de chassi e código OEM/fabricante. A API FIPE é voltada a identificação/preço de veículos e não oferece o relacionamento peça → veículo. Não podemos transformar um resultado FIPE em “serve no seu carro”.

## Comparação

| Opção | O que entrega | Custo/limite apurado em 04/09/2026 | Decisão |
|---|---|---|---|
| Parallelum/FipeAPI | Marcas, modelos/versões e anos/combustível; preços FIPE | Documentação anuncia 500 consultas/dia sem token ou 1.000/dia com token gratuito | Melhor candidata para seletor administrativo |
| BrasilAPI | Endpoints FIPE; marcas e consultas relacionadas a valores | Serviço público; não foi confirmada uma hierarquia completa adequada a este fluxo | Não adotar como substituta equivalente sem verificar contrato de resposta |
| TecDoc Web Service | Veículos, artigos e relacionamentos de aplicação | Nenhum plano gratuito de produção confirmado; requer consulta comercial/licenciamento e validação de cobertura brasileira | Fase futura se volume justificar |
| API Mercado Livre | Compatibilidades dentro do ecossistema de anúncios/catálogo | Há documentação específica; acesso e direito de reutilização fora do marketplace não foram validados | Referência de UX, não base gratuita presumida |
| Cadastro curado no Supabase | Apenas veículos/aplicações relevantes ao estoque da loja | Sem assinatura de API adicional; existe custo humano de conferência | Fonte de verdade da V1 e alternativa em falhas |

Fontes: [Parallelum](https://fipe.api.br/docs/comece-aqui), [BrasilAPI](https://brasilapi.com.br/docs), [discussão oficial de modelos BrasilAPI](https://github.com/BrasilAPI/BrasilAPI/issues/623), [TecDoc](https://www.tecalliance.net/products/cards/tecdoc-web-service), [Mercado Livre](https://developers.mercadolivre.com.br/pt_br/publicacao-de-produtos/compatibilidades-itens-e-produtos-de-autopecas).

Não foi encontrada uma solução gratuita, validada para uso em produção, que forneça automaticamente toda a compatibilidade do estoque brasileiro. Não é uma afirmação de inexistência de qualquer serviço desse tipo.

## Verificação prática efetuada

Consultas GET sem autenticação, somente leitura, feitas em 04/09/2026:

| Endpoint | Resultado observado | Arquivo salvo |
|---|---|---|
| `https://fipe.parallelum.com.br/api/v2/cars/brands` | HTTP 200; 107 marcas | `fontes/fipe-marcas-amostra.json` |
| `https://fipe.parallelum.com.br/api/v2/cars/brands/59/models` | HTTP 200; 549 modelos | `fontes/fipe-modelos-vw-amostra.json` |
| `https://fipe.parallelum.com.br/api/v2/cars/brands/59/models/5585/years` | HTTP 200; 3 anos | `fontes/fipe-anos-amostra.json` |

Exemplo real de ano: `{"code":"2013-3","name":"2013 Diesel"}`. O sufixo representa combustível. A documentação define `32000` como veículo zero-quilômetro; não mostrar isso como ano real nem usar para vincular uma peça. Estes testes confirmam resposta dos endpoints, não disponibilidade contínua, licença irrestrita ou completude do catálogo.

## Fluxo de cadastro proposto

1. Jeany cadastra foto, nome, código, preço e disponibilidade.
2. Em “Em quais carros esta peça é usada?”, escolhe marca, modelo/versão e intervalo de anos efetivamente conferido.
3. Registra motor/combustível/observações quando necessários e fonte da aplicação: embalagem, catálogo do fabricante ou conferência técnica da loja.
4. Pode adicionar outra aplicação ou salvar “Aplicação a confirmar”. A publicação não deve exigir conhecer toda a base FIPE.
5. O site informa “Aplicação cadastrada pela loja” quando há vínculo verificado. Caso faltem detalhes: “Confirme a aplicação pelo WhatsApp”. Ausência de vínculo significa “não confirmada”, nunca prova automática de incompatibilidade.

Não agrupar variantes pelo texto “Gol”/“Corsa” e herdar todas as aplicações. Um código de peça pode servir em vários veículos, e um mesmo modelo pode exigir peças diferentes. Campo vazio não significa “todos os motores”. “Universal” deve exigir confirmação específica.

## Integração proporcional ao orçamento

Fazer uma prova técnica limitada a **2–4 horas**, incluída na estimativa geral, antes de comprometer a produção com a API. Validar uso comercial, condições de cache/armazenamento e limites do provedor. Gratuidade não equivale a licença irrestrita da base. Persistir somente seleções/aplicações necessárias e metadados permitidos; não baixar a base inteira.

Adapter de provedor atrás de `VehicleCatalogProvider`. Chamadas server-side com timeout, cache por tipo/marca/modelo/referência, deduplicação de consultas simultâneas e limite global por provedor. Definir TTL conforme termos, inicialmente sugerido em 30 dias se permitido. Em 429 ou indisponibilidade: usar cache válido/stale permitido e oferecer entrada manual; não bloquear publicação. Token somente no servidor. Medir consumo total de todos os projetos BYTHE que dividirem credenciais/IP.

Se a integração ultrapassar o teto de esforço ou os termos não forem adequados, entregar o filtro básico com dados locais, mantendo a integração como melhoria posterior. Isso preserva o catálogo e evita prometer uma réplica do Mercado Livre pelo valor contratado.
