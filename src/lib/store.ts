export const store = {
  name: "Auto Peças Martins",
  shortName: "APM",
  phoneDisplay: "(13) 99600-2719",
  landlineDisplay: "(13) 3864-1821",
  whatsappE164: "5513996002719",
  cnpj: "50.536.044/0001-09",
  city: "Jacupiranga",
  state: "SP",
  address: "Av. Hilda Mohring de Macedo, 1309 · Vila Elias",
  region: "Vale do Ribeira",
  hours: ["Segunda a sexta · 8h às 18h", "Sábado · 8h às 12h"],
} as const;

export const services = [
  { name: "Troca de óleo", description: "Óleo, filtros e revisão dos itens essenciais para o motor." },
  { name: "Alinhamento 3D", description: "Direção mais estável e pneus trabalhando de forma uniforme." },
  { name: "Balanceamento", description: "Mais conforto ao dirigir e menos vibração nas rodas." },
  { name: "Suspensão", description: "Avaliação de amortecedores, buchas e componentes da suspensão." },
  { name: "Freios", description: "Verificação de pastilhas, discos e componentes do sistema." },
] as const;
