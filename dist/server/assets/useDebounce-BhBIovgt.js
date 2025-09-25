import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect } from "react";
import { I as Icons } from "../entry-server.js";
const UnifiedDealCard = ({
  deal,
  onRateClick,
  onTrackClick,
  isGuest = false,
  showRatingButton = true
}) => {
  var _a, _b, _c, _d;
  const [isClaimHovered, setIsClaimHovered] = useState(false);
  const [isRateHovered, setIsRateHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showRatingDetails, setShowRatingDetails] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const cardRef = useRef(null);
  const companyRating = ((_a = deal.company) == null ? void 0 : _a.overall_rating) || 0;
  const totalRatings = ((_b = deal.company) == null ? void 0 : _b.total_reviews) || 0;
  const hasUserRated = !!deal.userRating;
  const userRatingType = (_c = deal.userRating) == null ? void 0 : _c.rating_type;
  const handleTrackClick = useCallback(() => {
    onTrackClick(deal);
  }, [deal, onTrackClick]);
  const handleRateClick = useCallback(() => {
    if (onRateClick && !isGuest) {
      onRateClick(deal);
    }
  }, [deal, onRateClick, isGuest]);
  const handleTermsClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTerms((prev) => !prev);
  }, []);
  useEffect(() => {
    const handleMouseLeave = () => {
      if (showTerms && !isCardHovered) {
        const timer = setTimeout(() => {
          if (!isCardHovered) {
            setShowTerms(false);
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    };
    if (cardRef.current) {
      cardRef.current.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        var _a2;
        (_a2 = cardRef.current) == null ? void 0 : _a2.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [showTerms, isCardHovered]);
  const parseTermsContent = useCallback((terms) => {
    if (!terms) return [];
    const termsArray = Array.isArray(terms) ? terms : [terms];
    const filtered = termsArray.filter((line) => line && String(line).trim() !== "");
    return filtered.map((line) => {
      const trimmedLine = String(line).trim();
      if (trimmedLine.toLowerCase().includes("terms and conditions")) {
        return { type: "header", content: trimmedLine };
      }
      if (/^\d+\.\s+[A-Z\s&]+$/i.test(trimmedLine)) {
        return { type: "section", content: trimmedLine, level: 1 };
      }
      if (/^\d+\.\d+\s+/.test(trimmedLine)) {
        return { type: "section", content: trimmedLine, level: 2 };
      }
      if (/^[•▪▫-]\s+/.test(trimmedLine) || /^\s{2,}[•▪▫-]\s+/.test(trimmedLine)) {
        return { type: "bullet", content: trimmedLine.replace(/^[\s•▪▫-]+/, "") };
      }
      return { type: "paragraph", content: trimmedLine };
    });
  }, []);
  const parsedTerms = parseTermsContent(deal.terms);
  const formatRating = (rating) => {
    if (rating === 0) return "0.0";
    return rating.toFixed(1);
  };
  const formatCategory = (category) => {
    return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };
  const isEndingSoon = deal.end_date && new Date(deal.end_date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1e3;
  const isHighlyRated = companyRating >= 4.5 && totalRatings >= 10;
  const isNewCompany = totalRatings === 0;
  const hasLimitedRatings = totalRatings > 0 && totalRatings < 10;
  const getTrustLevel = () => {
    if (totalRatings === 0) return { level: "unrated", color: "text-foreground/50", label: "No ratings yet" };
    if (totalRatings < 10) return { level: "new", color: "text-success", label: "New platform" };
    if (totalRatings < 50) return { level: "emerging", color: "text-success", label: "Growing community" };
    if (totalRatings < 100) return { level: "established", color: "text-primary", label: "Established" };
    return { level: "trusted", color: "text-secondary", label: "Community trusted" };
  };
  const trustLevel = getTrustLevel();
  const renderStars = (rating, size = "w-4 h-4") => {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0.5", children: [1, 2, 3, 4, 5].map((starNumber) => {
      if (rating >= starNumber) {
        return /* @__PURE__ */ jsx(
          Icons.star,
          {
            className: `${size} fill-warning text-warning`
          },
          starNumber
        );
      } else if (rating > starNumber - 1) {
        const fillPercentage = (rating - (starNumber - 1)) * 100;
        return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Icons.star, { className: `${size} text-foreground/30` }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 overflow-hidden",
              style: { width: `${fillPercentage}%` },
              children: /* @__PURE__ */ jsx(Icons.star, { className: `${size} text-warning fill-warning` })
            }
          )
        ] }, starNumber);
      } else {
        return /* @__PURE__ */ jsx(
          Icons.star,
          {
            className: `${size} text-foreground/30`
          },
          starNumber
        );
      }
    }) });
  };
  const renderTermsContent = (term, index) => {
    switch (term.type) {
      case "header":
        return /* @__PURE__ */ jsxs("div", { className: "text-center py-md animate-fade-in-up", style: { animationDelay: `${index * 100}ms` }, children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-foreground mb-sm", children: term.content }),
          /* @__PURE__ */ jsx("div", { className: "w-12 h-0.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full animate-pulse" })
        ] }, index);
      case "section":
        const sectionLevel = term.level || 1;
        const headingSize = sectionLevel === 1 ? "text-sm" : "text-xs";
        const marginTop = sectionLevel === 1 ? "mt-md" : "mt-sm";
        return /* @__PURE__ */ jsxs("div", { className: `${marginTop} mb-sm animate-slide-in-left`, style: { animationDelay: `${index * 100}ms` }, children: [
          /* @__PURE__ */ jsxs("h4", { className: `${headingSize} font-semibold text-foreground flex items-center gap-sm hover:text-primary transition-all duration-300 group hover:scale-105`, children: [
            /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full flex-shrink-0 group-hover:scale-125 transition-transform duration-300" }),
            term.content
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full h-px bg-gradient-to-r from-divider/30 to-transparent mt-sm group-hover:from-primary/50 transition-colors duration-300" })
        ] }, index);
      case "bullet":
        return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-sm ml-md py-xs hover:bg-content2/30 rounded-md container-px-sm transition-all duration-300 group animate-slide-in-left", style: { animationDelay: `${index * 100}ms` }, children: [
          /* @__PURE__ */ jsx("div", { className: "w-1 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform duration-300" }),
          /* @__PURE__ */ jsx("p", { className: "text-foreground/80 leading-relaxed text-xs group-hover:text-foreground transition-colors duration-300", children: term.content })
        ] }, index);
      case "paragraph":
        return /* @__PURE__ */ jsx("p", { className: "text-foreground/80 leading-relaxed text-xs hover:bg-content2/20 rounded-md container-p-sm transition-all duration-300 animate-fade-in-up hover:scale-105", style: { animationDelay: `${index * 100}ms` }, children: term.content }, index);
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: cardRef,
      className: "group glass-enhanced rounded-2xl border border-divider/40 hover:border-primary/30 transition-all duration-500 hover:shadow-enhanced-lg hover:shadow-primary/10 card-hover-enhanced overflow-hidden flex flex-col h-full relative background-enhanced",
      onMouseEnter: () => setIsCardHovered(true),
      onMouseLeave: () => setIsCardHovered(false),
      children: [
        showTerms && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 glass-enhanced z-20 overflow-hidden animate-scale-in duration-500 flex flex-col", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 container-p-lg border-b border-divider/30 flex-shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-foreground", children: "Terms & Conditions" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-foreground/60", children: deal.company_name })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto container-p-lg scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent", children: parsedTerms.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-sm", children: parsedTerms.map(renderTermsContent) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-xl animate-scale-in duration-500", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-sm animate-pulse", children: /* @__PURE__ */ jsx(Icons.document, { className: "w-6 h-6 text-primary/60" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground mb-sm", children: "No Terms Available" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-foreground/60", children: [
              "Please visit ",
              deal.company_name,
              "'s website for complete terms and conditions."
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "bg-content2/95 backdrop-blur-sm border-t border-divider/30 container-p-lg flex-shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-sm", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShowTerms(false),
                className: "flex-1 container-px-md container-py-sm text-foreground/70 border border-divider/50 rounded-lg hover:bg-content2 hover:text-foreground transition-all duration-300 font-medium text-sm hover:scale-105 active:scale-95 focus-enhanced",
                children: "Close"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setShowTerms(false);
                  handleTrackClick();
                },
                className: "btn-enhanced flex-1 container-px-md container-py-sm bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-enhanced hover:scale-105 active:scale-95 transition-all duration-300 font-medium text-sm flex items-center justify-center gap-xs focus-enhanced",
                children: [
                  /* @__PURE__ */ jsx(Icons.gift, { className: "w-3 h-3" }),
                  "Claim Deal"
                ]
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `flex-1 flex flex-col transition-opacity duration-300 ${showTerms ? "opacity-0 pointer-events-none" : "opacity-100"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "container-p-lg pb-md", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between my-md gap-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0", children: [
                  ((_d = deal.company) == null ? void 0 : _d.logo_url) ? /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: deal.company.logo_url,
                        alt: `${deal.company_name} logo`,
                        className: `w-16 h-16 rounded-xl object-cover bg-content2 border-2 border-divider/50 group-hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md ${isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`,
                        onLoad: () => setIsImageLoaded(true),
                        onError: (e) => {
                          const target = e.target;
                          target.style.display = "none";
                          setIsImageLoaded(true);
                        }
                      }
                    ),
                    !isImageLoaded && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 w-16 h-16 bg-gradient-to-br from-content2 to-content3 animate-shimmer rounded-xl border-2 border-divider/50" })
                  ] }) : /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-divider/50 group-hover:border-primary/50 transition-all duration-300 shadow-sm", children: /* @__PURE__ */ jsx(Icons.arrowTrendingUp, { className: "w-8 h-8 text-primary" }) }),
                  isHighlyRated && /* @__PURE__ */ jsx("div", { className: "absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-warning to-warning/80 rounded-full flex items-center justify-center shadow-enhanced border-2 border-white animate-pulse-glow", children: /* @__PURE__ */ jsx(Icons.trophy, { className: "w-4 h-4 text-warning-foreground" }) }),
                  isNewCompany && /* @__PURE__ */ jsx("div", { className: "absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center shadow-enhanced border-2 border-white animate-float", children: /* @__PURE__ */ jsx(Icons.sparkles, { className: "w-4 h-4 text-success-foreground" }) }),
                  trustLevel.level === "trusted" && /* @__PURE__ */ jsx("div", { className: "absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-secondary to-secondary/80 rounded-full flex items-center justify-center shadow-enhanced border-2 border-white", children: /* @__PURE__ */ jsx(Icons.shield, { className: "w-4 h-4 text-secondary-foreground" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate", children: deal.company_name }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-1", children: [
                    totalRatings > 0 ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      renderStars(companyRating, "w-3 h-3"),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: formatRating(companyRating) }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-primary", children: [
                        /* @__PURE__ */ jsx(Icons.users, { className: "w-3 h-3" }),
                        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: totalRatings.toLocaleString() })
                      ] })
                    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-foreground/60 text-xs", children: [
                      /* @__PURE__ */ jsx(Icons.star, { className: "w-3 h-3" }),
                      /* @__PURE__ */ jsx("span", { children: "No ratings yet" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: `text-xs ${trustLevel.color} font-medium mt-1`, children: trustLevel.label })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 items-end flex-shrink-0", children: [
                /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full whitespace-nowrap border border-primary/20", children: formatCategory(deal.category || "") }),
                isEndingSoon && /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-danger/10 text-danger text-xs font-medium rounded-full border border-danger/20 animate-pulse", children: "Ending Soon" }),
                isHighlyRated && /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full border border-warning/20", children: "Top Rated" }),
                isNewCompany && /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full border border-success/20", children: "New Platform" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "my-md container-p-sm glass rounded-xl border border-divider/30", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setShowRatingDetails(!showRatingDetails),
                  className: "w-full flex items-center justify-between hover:text-primary transition-colors focus-enhanced",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                      /* @__PURE__ */ jsx(Icons.chart, { className: "w-4 h-4 text-primary flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Community Ratings" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 flex-shrink-0", children: totalRatings > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                        renderStars(companyRating, "w-3 h-3"),
                        /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground text-sm", children: formatRating(companyRating) })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-primary", children: [
                        /* @__PURE__ */ jsx(Icons.users, { className: "w-3 h-3 flex-shrink-0" }),
                        /* @__PURE__ */ jsx("span", { className: "font-semibold text-xs", children: totalRatings.toLocaleString() })
                      ] })
                    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(Icons.bolt, { className: "w-4 h-4 text-success flex-shrink-0 animate-pulse" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs text-success font-medium", children: "Be first!" })
                    ] }) })
                  ]
                }
              ),
              showRatingDetails && /* @__PURE__ */ jsx("div", { className: "mt-sm pt-sm border-t border-divider/30 animate-fade-in-up", children: totalRatings > 0 ? /* @__PURE__ */ jsxs("div", { className: "space-y-sm", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-foreground/70", children: "Community Trust" }),
                  /* @__PURE__ */ jsx("span", { className: `font-medium ${trustLevel.color}`, children: trustLevel.label })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-foreground/70", children: "Average Rating" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Icons.star, { className: "w-4 h-4 fill-warning text-warning" }),
                    /* @__PURE__ */ jsxs("span", { className: "font-medium text-foreground", children: [
                      formatRating(companyRating),
                      " / 5.0"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-foreground/70", children: "Total Reviews" }),
                  /* @__PURE__ */ jsxs("span", { className: "font-medium text-primary", children: [
                    totalRatings.toLocaleString(),
                    " trader",
                    totalRatings !== 1 ? "s" : ""
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-2", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-foreground/70 mb-2", children: [
                  "No ratings yet for ",
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-primary", children: deal.company_name })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-success", children: "Be the first to share your experience!" })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "my-md", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-foreground my-sm line-clamp-2 leading-snug break-words", children: deal.title }),
              deal.bonus_amount && /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-gradient-to-r from-secondary/20 to-primary/20 rounded-lg container-p-md my-sm h-16 flex items-center border border-primary/20", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-sm w-full", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-secondary to-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm", children: /* @__PURE__ */ jsx(Icons.gift, { className: "w-4 h-4 text-white" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-foreground/70 font-medium", children: "Bonus Offer" }),
                    /* @__PURE__ */ jsx("div", { className: "text-primary font-semibold text-sm truncate", children: deal.bonus_amount })
                  ] }),
                  /* @__PURE__ */ jsx(Icons.sparkles, { className: "w-4 h-4 text-primary/50 flex-shrink-0 animate-pulse" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground/70 my-md line-clamp-3 text-sm leading-relaxed", children: deal.description }),
            deal.features && deal.features.length > 0 && /* @__PURE__ */ jsx("div", { className: "my-md", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-sm", children: [
              deal.features.slice(0, 3).map((feature, index) => /* @__PURE__ */ jsx(
                "span",
                {
                  className: "text-xs bg-content2 border border-divider/50 text-foreground/70 container-px-sm container-py-xs rounded-full hover:border-primary/30 transition-colors animate-scale-in",
                  style: { animationDelay: `${index * 100}ms` },
                  children: feature
                },
                index
              )),
              deal.features.length > 3 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-primary font-medium container-px-sm container-py-xs bg-primary/10 rounded-full border border-primary/20", children: [
                "+",
                deal.features.length - 3,
                " more"
              ] })
            ] }) }),
            !isGuest && hasUserRated && /* @__PURE__ */ jsx("div", { className: "my-md container-p-sm bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-sm", children: [
                /* @__PURE__ */ jsx(Icons.success, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-primary font-medium", children: "You rated this company" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-primary bg-white container-px-xs container-py-xs rounded-full", children: [
                userRatingType === "overall" ? "Quick" : "Detailed",
                " rating"
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `container-p-lg pt-0 mt-auto transition-opacity duration-300 ${showTerms ? "opacity-0 pointer-events-none" : "opacity-100"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-md text-xs text-foreground/70 my-md bg-content2/50 rounded-lg container-p-sm border border-divider/30", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Icons.time, { className: "w-3 h-3" }),
              /* @__PURE__ */ jsx("span", { children: deal.end_date ? `Expires ${new Date(deal.end_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}` : "No expiration date" })
            ] }),
            deal.commission_rate && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Icons.arrowTrendingUp, { className: "w-3 h-3" }),
              /* @__PURE__ */ jsxs("span", { children: [
                deal.commission_rate,
                "% commission"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-sm", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleTrackClick,
                onMouseEnter: () => setIsClaimHovered(true),
                onMouseLeave: () => setIsClaimHovered(false),
                className: "btn-enhanced flex-1 relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm container-py-sm container-px-md rounded-lg transition-all duration-300 hover:shadow-enhanced hover:scale-105 group/button focus-enhanced",
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-xs relative z-10", children: [
                  /* @__PURE__ */ jsx(Icons.gift, { className: `w-4 h-4 transition-transform duration-300 ${isClaimHovered ? "scale-110 rotate-12" : ""}` }),
                  /* @__PURE__ */ jsx("span", { children: "Claim Deal" }),
                  /* @__PURE__ */ jsx(Icons.externalLink, { className: `w-3 h-3 transition-transform duration-300 ${isClaimHovered ? "scale-110 translate-x-1" : ""}` })
                ] })
              }
            ),
            !isGuest && showRatingButton && onRateClick && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleRateClick,
                onMouseEnter: () => setIsRateHovered(true),
                onMouseLeave: () => setIsRateHovered(false),
                className: "bg-content2 hover:bg-content3 border border-divider/50 hover:border-primary/50 text-foreground font-medium text-sm container-py-sm container-px-md rounded-lg transition-all duration-300 hover:shadow-md group/rate relative card-hover-enhanced focus-enhanced",
                title: hasUserRated ? "Update your rating" : "Rate this company",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-xs", children: [
                    /* @__PURE__ */ jsx(Icons.chat, { className: `w-4 h-4 transition-transform duration-300 ${isRateHovered ? "scale-110" : ""}` }),
                    /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: hasUserRated ? "Update" : "Rate" })
                  ] }),
                  isRateHovered && totalRatings > 0 && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-1 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium shadow-enhanced z-10 min-w-6 text-center animate-scale-in", children: totalRatings })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-md flex justify-center", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleTermsClick,
              className: "text-xs text-foreground/70 hover:text-primary transition-all duration-300 underline hover:no-underline container-px-md container-py-sm rounded-lg hover:bg-content2/50 focus-enhanced hover:scale-105 active:scale-95",
              children: "Terms & Conditions"
            }
          ) }),
          !isGuest && /* @__PURE__ */ jsx(Fragment, { children: isNewCompany ? /* @__PURE__ */ jsx("div", { className: "mt-sm text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-foreground/70", children: [
            "Be the first to rate ",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-primary", children: deal.company_name }),
            " ",
            "and help other traders!"
          ] }) }) : hasLimitedRatings ? /* @__PURE__ */ jsx("div", { className: "mt-sm text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-foreground/70", children: [
            "Help build trust - ",
            /* @__PURE__ */ jsx("span", { className: "font-medium text-primary", children: deal.company_name }),
            " ",
            "needs more community reviews"
          ] }) }) : /* @__PURE__ */ jsx("div", { className: "mt-sm text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-foreground/70", children: [
            "Trusted by ",
            /* @__PURE__ */ jsxs("span", { className: "font-medium text-primary", children: [
              totalRatings.toLocaleString(),
              " traders"
            ] }),
            " ",
            "in our community"
          ] }) }) }),
          isGuest && /* @__PURE__ */ jsx("div", { className: "mt-sm text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-foreground/70", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-primary", children: "Sign up" }),
            " to rate companies and help the community!"
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl ${showTerms ? "hidden" : ""}` })
      ]
    }
  );
};
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
export {
  UnifiedDealCard as U,
  useDebounce as u
};
