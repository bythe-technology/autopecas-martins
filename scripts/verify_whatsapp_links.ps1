$ErrorActionPreference = 'Stop'

$cases = @(
  @{ Path = '/'; Expected = 'preciso de ajuda para encontrar uma peça' },
  @{ Path = '/'; Expected = 'gostaria de consultar horários e orçamento' },
  @{ Path = '/catalogo?marca=Ford&modelo=Ka&ano=2015'; Expected = 'Não encontrei uma peça para o meu veículo' },
  @{ Path = '/produto/farol-opala-caravan-80-87-ld'; Expected = 'FG51LD' },
  @{ Path = '/produto/farol-opala-caravan-80-87-ld'; Expected = '299,00' },
  @{ Path = '/oficinas-e-frotas'; Expected = 'Represento uma oficina ou frota' },
  @{ Path = '/contato'; Expected = 'gostaria de falar com a Auto Peças Martins' }
)

$cache = @{}
foreach ($case in $cases) {
  if (-not $cache.ContainsKey($case.Path)) {
    $cache[$case.Path] = (Invoke-WebRequest -UseBasicParsing ("http://127.0.0.1:3001" + $case.Path)).Content
  }
  $html = [System.Net.WebUtility]::HtmlDecode($cache[$case.Path])
  $decoded = [System.Uri]::UnescapeDataString($html)
  if (-not $decoded.Contains($case.Expected)) {
    throw "Mensagem ausente em $($case.Path): $($case.Expected)"
  }
}

$allHtml = ($cache.Values -join "`n")
if (-not $allHtml.Contains('https://wa.me/5513996002719?text=')) {
  throw 'Número ou formato do link do WhatsApp está incorreto.'
}

Write-Output "WhatsApp verificado: $($cases.Count) mensagens personalizadas, número e codificação corretos."


