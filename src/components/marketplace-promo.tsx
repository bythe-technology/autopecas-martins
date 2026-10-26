import Image from "next/image";
import { ArrowRight } from "@/components/icons";
import { marketplaceStore } from "@/lib/marketplace";

type MarketplacePromoProps = {
  variant?: "featured" | "compact";
};

export function MarketplacePromo({ variant = "featured" }: MarketplacePromoProps) {
  const isCompact = variant === "compact";

  return (
    <aside className={`marketplace-promo marketplace-promo-${variant}`} aria-label="Loja JJ Martins Autopeças no Mercado Livre">
      <div className="marketplace-promo-copy">
        <div className="marketplace-promo-brand-row">
          <Image
            src="/images/jj-martins-autopecas-logo.png"
            alt="JJ Martins Autopeças"
            width={200}
            height={86}
            className="marketplace-promo-logo"
          />
          <span className="marketplace-promo-label">Agora também no Mercado Livre</span>
        </div>
        <h2>{isCompact ? "Prefere comprar pelo Mercado Livre?" : "A Auto Peças Martins também está no Mercado Livre."}</h2>
        <p>
          {isCompact
            ? `A mesma loja de Jacupiranga, agora como ${marketplaceStore.name}. Visite e siga a página para apoiar essa novidade. Aproveite os preços imperdíveis.`
            : `Agora você também pode encontrar a ${marketplaceStore.name} por lá. Visite a página, confira os anúncios com preços imperdíveis e siga a loja para fortalecer essa nova etapa.`}
        </p>
        <a className="marketplace-promo-link" href={marketplaceStore.url} target="_blank" rel="noopener noreferrer">
          Visitar e seguir a loja <ArrowRight size={18} />
        </a>
      </div>
      {!isCompact ? (
        <div className="marketplace-promo-art" aria-hidden="true">
          <Image
            src="/images/jj-martins-marketplace-sticker.webp"
            alt=""
            fill
            sizes="(max-width: 850px) 75vw, 34vw"
            quality={90}
          />
        </div>
      ) : (
        <div className="marketplace-promo-compact-art" aria-hidden="true">
          <Image
            src="/images/jj-martins-marketplace-sticker.webp"
            alt=""
            fill
            sizes="(max-width: 850px) 30vw, 120px"
            quality={85}
          />
        </div>
      )}
    </aside>
  );
}
