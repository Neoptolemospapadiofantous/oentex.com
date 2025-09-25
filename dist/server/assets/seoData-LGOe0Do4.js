import { jsxs, jsx } from "react/jsx-runtime";
import { a as Helmet } from "./react-B6hsMDRz.js";
const SEO = ({
  title = "Oentex - Your Gateway to Financial Freedom",
  description = "Discover exclusive bonuses and deals from top crypto exchanges, stock brokers, banks, and investment platforms. Compare offers and maximize your financial potential with Oentex.",
  keywords = "cryptocurrency, trading, investment, stocks, forex, banking, financial deals, trading bonuses, crypto exchanges, stock brokers",
  image = "https://oentex.com/og-image.jpg",
  url = "https://oentex.com",
  type = "website",
  structuredData,
  canonical,
  noindex = false,
  nofollow = false
}) => {
  const fullTitle = title.includes("Oentex") ? title : `${title} | Oentex`;
  const fullUrl = url.startsWith("http") ? url : `https://oentex.com${url}`;
  const fullImage = image.startsWith("http") ? image : `https://oentex.com${image}`;
  const robotsContent = [];
  if (noindex) robotsContent.push("noindex");
  if (nofollow) robotsContent.push("nofollow");
  if (!noindex && !nofollow) robotsContent.push("index", "follow");
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("title", { children: fullTitle }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "keywords", content: keywords }),
    /* @__PURE__ */ jsx("meta", { name: "robots", content: robotsContent.join(", ") }),
    canonical && /* @__PURE__ */ jsx("link", { rel: "canonical", href: canonical }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: type }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: fullUrl }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: fullTitle }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: fullImage }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "Oentex" }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "en_US" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:url", content: fullUrl }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: fullTitle }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: fullImage }),
    /* @__PURE__ */ jsx("meta", { name: "author", content: "Oentex" }),
    /* @__PURE__ */ jsx("meta", { name: "theme-color", content: "#000000" }),
    /* @__PURE__ */ jsx("meta", { name: "msapplication-TileColor", content: "#000000" }),
    structuredData && /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(structuredData) })
  ] });
};
const seoData = {
  home: {
    title: "Oentex - Your Gateway to Financial Freedom",
    description: "Discover exclusive bonuses and deals from top crypto exchanges, stock brokers, banks, and investment platforms. Compare offers and maximize your financial potential with Oentex.",
    keywords: "cryptocurrency, trading, investment, stocks, forex, banking, financial deals, trading bonuses, crypto exchanges, stock brokers",
    url: "https://oentex.com",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Oentex",
      url: "https://oentex.com",
      description: "Your Gateway to Financial Freedom",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://oentex.com/deals?search={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      publisher: {
        "@type": "Organization",
        name: "Oentex",
        logo: {
          "@type": "ImageObject",
          url: "https://oentex.com/logo.png"
        }
      }
    }
  },
  about: {
    title: "About Oentex - Trusted Reviews & Exclusive Deals",
    description: "Learn about Oentex's mission to provide honest reviews, ratings, and the best deals across tech gadgets, software tools, online courses, and financial services.",
    keywords: "about oentex, company mission, reviews platform, deal discovery, trusted recommendations",
    url: "https://oentex.com/about",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About Oentex",
      description: "Learn about Oentex's mission to provide honest reviews and exclusive deals",
      url: "https://oentex.com/about",
      mainEntity: {
        "@type": "Organization",
        name: "Oentex",
        description: "A trusted platform providing honest reviews, ratings, and exclusive deals across multiple categories",
        url: "https://oentex.com",
        logo: "https://oentex.com/logo.png",
        sameAs: []
      }
    }
  },
  deals: {
    title: "Trading Deals & Exclusive Bonuses - Oentex",
    description: "Browse curated trading deals, exclusive bonuses, and special offers from top crypto exchanges, stock brokers, and investment platforms. Real ratings and reviews.",
    keywords: "trading deals, crypto bonuses, stock broker offers, investment platforms, exclusive deals, trading bonuses",
    url: "https://oentex.com/deals",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Trading Deals & Exclusive Bonuses",
      description: "Curated collection of trading deals and exclusive bonuses from verified platforms",
      url: "https://oentex.com/deals",
      numberOfItems: 50,
      itemListElement: []
    }
  },
  faq: {
    title: "Frequently Asked Questions - Oentex",
    description: "Find answers to common questions about Oentex, our review process, how to claim deals, and more. Get help with your trading and investment journey.",
    keywords: "FAQ, help, support, questions, answers, oentex help, trading help",
    url: "https://oentex.com/faq"
  },
  contact: {
    title: "Contact Oentex - Get in Touch",
    description: "Contact Oentex for support, partnerships, or feedback. We're here to help with your trading and investment needs.",
    keywords: "contact oentex, support, help, feedback, partnerships, customer service",
    url: "https://oentex.com/contact",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact Oentex",
      description: "Get in touch with Oentex for support and partnerships",
      url: "https://oentex.com/contact"
    }
  },
  terms: {
    title: "Terms and Conditions - Oentex",
    description: "Read Oentex's terms and conditions, user agreement, and legal information.",
    keywords: "terms and conditions, user agreement, legal, oentex terms",
    url: "https://oentex.com/terms",
    noindex: true
  },
  privacy: {
    title: "Privacy Policy - Oentex",
    description: "Learn how Oentex protects your privacy and handles your personal information.",
    keywords: "privacy policy, data protection, personal information, oentex privacy",
    url: "https://oentex.com/privacy",
    noindex: true
  },
  authentication: {
    title: "Sign In / Register - Oentex",
    description: "Sign in to your Oentex account or create a new one to access exclusive deals and personalized recommendations.",
    keywords: "sign in, register, login, account, oentex account",
    url: "https://oentex.com/authentication",
    noindex: true
  }
};
const generateDealsStructuredData = (deals) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Trading Deals & Exclusive Bonuses",
    description: "Curated collection of trading deals and exclusive bonuses from verified platforms",
    url: "https://oentex.com/deals",
    numberOfItems: deals.length,
    itemListElement: deals.slice(0, 10).map((deal, index) => {
      var _a, _b, _c, _d;
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Offer",
          name: deal.title || `${(_a = deal.company) == null ? void 0 : _a.name} Deal`,
          description: deal.description,
          url: deal.affiliate_link,
          price: deal.bonus_amount || deal.discount_percentage,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: (_b = deal.company) == null ? void 0 : _b.name,
            url: (_c = deal.company) == null ? void 0 : _c.website
          },
          aggregateRating: ((_d = deal.company) == null ? void 0 : _d.overall_rating) ? {
            "@type": "AggregateRating",
            ratingValue: deal.company.overall_rating,
            reviewCount: deal.company.total_reviews
          } : void 0
        }
      };
    })
  };
};
export {
  SEO as S,
  generateDealsStructuredData as g,
  seoData as s
};
