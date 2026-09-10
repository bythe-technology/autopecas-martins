export type ProductCategory =
  | "Borracha e vedação"
  | "Calhas"
  | "Iluminação"
  | "Retrovisores"
  | "Molduras e grades"
  | "Para-barros";

export type CatalogProduct = {
  slug: string;
  name: string;
  code: string;
  brand: string | null;
  category: ProductCategory;
  priceCents: number;
  availability: "Disponível" | "Últimas unidades";
  application: string;
  description: string;
  imageSrc?: string;
  imageNote?: string;
  fitment?: { make: string; models: string[]; yearFrom?: number; yearTo?: number };
};

const catalogProductData: CatalogProduct[] = [
  { slug: "farol-santana-87-90-auxiliar-le", name: "Farol Santana 87/90 com auxiliar - LE", code: "160047", brand: "Rufato", category: "Iluminação", priceCents: 39000, availability: "Disponível", application: "Volkswagen Santana 1987 a 1990", description: "Farol com auxiliar para o lado esquerdo. Confirme a aplicação antes da compra." },
  { slug: "farol-opala-caravan-80-87-ld", name: "Farol Opala/Caravan 80/87 - LD", code: "FG51LD", brand: "Orgus", category: "Iluminação", priceCents: 29900, availability: "Disponível", application: "Chevrolet Opala e Caravan 1980 a 1987", description: "Farol para o lado direito. Peça de lote, sujeita a confirmação de disponibilidade." },
  { slug: "farol-fox-04-10-crossfox-cromada-ld", name: "Farol Fox 04/10 CrossFox cromada - LD", code: "CHG041260-7", brand: "Orgus", category: "Iluminação", priceCents: 41600, availability: "Últimas unidades", application: "Volkswagen Fox e CrossFox 2004 a 2010", description: "Farol com acabamento cromado para lado direito." },
  { slug: "farol-palio-siena-strada-com-soquete-ld", name: "Farol Palio/Siena/Strada com soquete - LD", code: "FF48LD", brand: "Orgus", category: "Iluminação", priceCents: 26390, availability: "Disponível", application: "Fiat Palio, Siena e Strada", description: "Farol lado direito com soquete. Consulte a compatibilidade do seu veículo." },
  { slug: "lanterna-agile-2009-le", name: "Lanterna traseira Agile 2009 - LE", code: "416147", brand: "New/Bibas", category: "Iluminação", priceCents: 19500, availability: "Disponível", application: "Chevrolet Agile a partir de 2009", description: "Lanterna traseira lado esquerdo." },
  { slug: "calha-s10-12-26-cabine-dupla", name: "Calha S-10 12/26 cabine dupla 4P", code: "23023", brand: "TG Poli", category: "Calhas", priceCents: 14300, availability: "Disponível", application: "Chevrolet S-10 cabine dupla", description: "Jogo de calhas para quatro portas." },
  { slug: "calha-virtus-18-26-4p", name: "Calha Virtus 18/26 4P", code: "22020", brand: "TG Poli", category: "Calhas", priceCents: 14300, availability: "Disponível", application: "Volkswagen Virtus 2018 a 2026", description: "Calha para quatro portas." },
  { slug: "calha-onix-plus-19-26-4p", name: "Calha Onix Plus 19/26 4P", code: "23035", brand: "TG Poli", category: "Calhas", priceCents: 14300, availability: "Disponível", application: "Chevrolet Onix Plus 2019 a 2026", description: "Calha para quatro portas." },
  { slug: "retrovisor-agile-montana-controle-ld", name: "Retrovisor Agile/Montana com controle - LD", code: "21244", brand: "Rufato", category: "Retrovisores", priceCents: 16900, availability: "Disponível", application: "Chevrolet Agile 2009 a 2014 e Montana", description: "Retrovisor lado direito com controle." },
  { slug: "retrovisor-onix-prisma-novo-controle-ld", name: "Retrovisor Onix/Prisma novo com controle - LD", code: "RX2276", brand: "Retrovex", category: "Retrovisores", priceCents: 24050, availability: "Disponível", application: "Chevrolet Onix e Prisma, versão nova", description: "Retrovisor lado direito com controle." },
  { slug: "retrovisor-palio-strada-sem-controle-ld", name: "Retrovisor Palio/Strada sem controle - LD", code: "RX4528", brand: "Retrovex", category: "Retrovisores", priceCents: 10920, availability: "Disponível", application: "Fiat Palio e Strada 2011 em diante", description: "Retrovisor lado direito sem controle." },
  { slug: "grade-corsa-classic-moldura-cromada", name: "Grade Corsa Classic com moldura cromada", code: "12089", brand: "FipParts", category: "Molduras e grades", priceCents: 3900, availability: "Disponível", application: "Chevrolet Corsa Classic 2010 em diante", description: "Grade frontal com moldura cromada." },
  { slug: "moldura-lama-strada-12-14-traseiro-ld", name: "Moldura para-lama Strada 12/14 traseiro - LD", code: "111194-0", brand: "CHG", category: "Molduras e grades", priceCents: 16250, availability: "Disponível", application: "Fiat Strada 2012 a 2014", description: "Moldura traseira lado direito." },
  { slug: "para-barro-onix-prisma-13-16-le", name: "Para-barro Onix/Prisma 13/16 - LE", code: "1581", brand: null, category: "Para-barros", priceCents: 9750, availability: "Disponível", application: "Chevrolet Onix e Prisma 2013 a 2016", description: "Protetor de para-lama dianteiro lado esquerdo." },
  { slug: "para-barro-corsa-classic-10-14-ld", name: "Para-barro Corsa Classic 10/14 - LD", code: "25566", brand: "Rufato", category: "Para-barros", priceCents: 9750, availability: "Disponível", application: "Chevrolet Corsa Classic 2010 a 2014", description: "Protetor dianteiro lado direito." },
  { slug: "borracha-porta-ducato-dianteira", name: "Borracha porta Ducato dianteira", code: "38936", brand: "Uniflex", category: "Borracha e vedação", priceCents: 13000, availability: "Disponível", application: "Fiat Ducato, todos os anos informados no lote", description: "Borracha de porta dianteira. Consulte medidas e aplicação." },
  { slug: "guarnicao-brisa-bandeirantes", name: "Guarnição para-brisa Bandeirantes sem friso", code: "39570", brand: "Uniflex", category: "Borracha e vedação", priceCents: 13000, availability: "Disponível", application: "Toyota Bandeirante 1993 em diante", description: "Guarnição para para-brisa sem friso." },
  { slug: "calha-corolla-sedan-08-14", name: "Calha Corolla Sedan 08/14 4P", code: "27004", brand: "TG Poli", category: "Calhas", priceCents: 14300, availability: "Disponível", application: "Toyota Corolla Sedan 2008 a 2014", description: "Calha para quatro portas." }
];

const researchedProductImages: Record<string, string> = {
  "farol-santana-87-90-auxiliar-le": "/images/products/farol-santana-87-90-auxiliar-le.jpg",
  "farol-opala-caravan-80-87-ld": "/images/products/farol-opala-caravan-80-87-ld.jpg",
  "farol-fox-04-10-crossfox-cromada-ld": "/images/products/farol-fox-04-10-crossfox-cromada-ld.jpg",
  "farol-palio-siena-strada-com-soquete-ld": "/images/products/farol-palio-siena-strada-com-soquete-ld.jpg",
  "lanterna-agile-2009-le": "/images/products/lanterna-agile-2009-le.jpg",
  "calha-s10-12-26-cabine-dupla": "/images/products/calha-s10-12-26-cabine-dupla.jpg",
  "calha-virtus-18-26-4p": "/images/products/calha-virtus-18-26-4p.jpg",
  "calha-onix-plus-19-26-4p": "/images/products/calha-onix-plus-19-26-4p.jpg",
  "retrovisor-agile-montana-controle-ld": "/images/products/retrovisor-agile-montana-controle-ld.jpg",
  "retrovisor-onix-prisma-novo-controle-ld": "/images/products/retrovisor-onix-prisma-novo-controle-ld.jpg",
  "retrovisor-palio-strada-sem-controle-ld": "/images/products/retrovisor-palio-strada-sem-controle-ld.jpg",
  "grade-corsa-classic-moldura-cromada": "/images/products/grade-corsa-classic-moldura-cromada-ilustrativa.png",
  "moldura-lama-strada-12-14-traseiro-ld": "/images/products/moldura-lama-strada-12-14-traseiro-ld.jpg",
  "para-barro-onix-prisma-13-16-le": "/images/products/para-barro-onix-prisma-13-16-le.jpg",
  "para-barro-corsa-classic-10-14-ld": "/images/products/para-barro-corsa-classic-10-14-ld.jpg",
  "borracha-porta-ducato-dianteira": "/images/products/borracha-porta-ducato-dianteira.jpg",
  "guarnicao-brisa-bandeirantes": "/images/products/guarnicao-brisa-bandeirantes-ilustrativa.png",
  "calha-corolla-sedan-08-14": "/images/products/calha-corolla-sedan-08-14.jpg",
};

const researchedFitments: Record<string, NonNullable<CatalogProduct["fitment"]>> = {
  "farol-santana-87-90-auxiliar-le": { make: "Volkswagen", models: ["Santana"], yearFrom: 1987, yearTo: 1990 },
  "farol-opala-caravan-80-87-ld": { make: "Chevrolet", models: ["Opala", "Caravan"], yearFrom: 1980, yearTo: 1987 },
  "farol-fox-04-10-crossfox-cromada-ld": { make: "Volkswagen", models: ["Fox", "CrossFox", "SpaceFox"], yearFrom: 2004, yearTo: 2010 },
  "farol-palio-siena-strada-com-soquete-ld": { make: "Fiat", models: ["Palio", "Siena", "Strada"], yearFrom: 2008, yearTo: 2016 },
  "lanterna-agile-2009-le": { make: "Chevrolet", models: ["Agile"], yearFrom: 2009, yearTo: 2014 },
  "calha-s10-12-26-cabine-dupla": { make: "Chevrolet", models: ["S10"], yearFrom: 2012, yearTo: 2026 },
  "calha-virtus-18-26-4p": { make: "Volkswagen", models: ["Virtus"], yearFrom: 2018, yearTo: 2026 },
  "calha-onix-plus-19-26-4p": { make: "Chevrolet", models: ["Onix Plus"], yearFrom: 2019, yearTo: 2026 },
  "retrovisor-agile-montana-controle-ld": { make: "Chevrolet", models: ["Agile", "Montana"], yearFrom: 2009, yearTo: 2022 },
  "retrovisor-onix-prisma-novo-controle-ld": { make: "Chevrolet", models: ["Onix", "Prisma"], yearFrom: 2013, yearTo: 2019 },
  "retrovisor-palio-strada-sem-controle-ld": { make: "Fiat", models: ["Palio", "Strada"], yearFrom: 2012, yearTo: 2021 },
  "grade-corsa-classic-moldura-cromada": { make: "Chevrolet", models: ["Corsa Classic", "Classic"], yearFrom: 2010, yearTo: 2015 },
  "moldura-lama-strada-12-14-traseiro-ld": { make: "Fiat", models: ["Strada"], yearFrom: 2012, yearTo: 2014 },
  "para-barro-onix-prisma-13-16-le": { make: "Chevrolet", models: ["Onix", "Prisma"], yearFrom: 2013, yearTo: 2016 },
  "para-barro-corsa-classic-10-14-ld": { make: "Chevrolet", models: ["Corsa Classic", "Classic"], yearFrom: 2010, yearTo: 2014 },
  "borracha-porta-ducato-dianteira": { make: "Fiat", models: ["Ducato"] },
  "guarnicao-brisa-bandeirantes": { make: "Toyota", models: ["Bandeirante"], yearFrom: 1993 },
  "calha-corolla-sedan-08-14": { make: "Toyota", models: ["Corolla"], yearFrom: 2008, yearTo: 2014 },
};

export const catalogProducts: CatalogProduct[] = catalogProductData.map((product) => ({
  ...product,
  imageSrc: researchedProductImages[product.slug],
  imageNote: ["grade-corsa-classic-moldura-cromada", "moldura-lama-strada-12-14-traseiro-ld", "guarnicao-brisa-bandeirantes"].includes(product.slug) ? "Imagem ilustrativa" : undefined,
  fitment: researchedFitments[product.slug],
}));

export const categories = [...new Set(catalogProducts.map((product) => product.category))];

export function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(priceCents / 100);
}

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return catalogProducts.find((product) => product.slug === slug);
}
