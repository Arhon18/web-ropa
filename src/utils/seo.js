/**
 * Utilidades de SEO On-Page y Rich Snippets Dinámicos (Schema.org JSON-LD)
 */

export function updateProductSEO(product) {
  if (!product) return;

  // Title
  document.title = `${product.name} | AURA Studio - Alta Moda`;

  // Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', `${product.subtitle}. ${product.description.slice(0, 140)}...`);
  }

  // Open Graph
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', `${product.name} | AURA Studio`);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', product.subtitle);

  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg && product.colors?.[0]?.images?.[0]) {
    ogImg.setAttribute('content', product.colors[0].images[0]);
  }

  // Schema.org Product JSON-LD Injection
  let schemaScript = document.getElementById('schema-org-product');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'schema-org-product';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }

  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.colors[0].images,
    "description": product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "AURA Studio"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating.toString(),
      "reviewCount": product.reviewCount.toString()
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "USD",
      "price": product.price.toString(),
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.sizes.some(s => s.stock > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "AURA Studio"
      }
    }
  };

  schemaScript.textContent = JSON.stringify(schemaData, null, 2);
}
