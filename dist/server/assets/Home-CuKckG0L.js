import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default, { useState, useRef, useEffect, useMemo } from "react";
import { I as Icons, u as useAuth, s as supabase, a as showErrorToast, b as showSuccessToast } from "../entry-server.js";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { u as useCategoriesQuery } from "./useCategoriesQuery-BP0yqNTQ.js";
import { A as AdUnit } from "./AdUnit-Div7rPfI.js";
import { S as SEO, s as seoData } from "./seoData-LGOe0Do4.js";
import "react-dom/server";
import "react-router-dom/server.mjs";
import "@heroui/react";
import "./react-B6hsMDRz.js";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "@tanstack/react-query-devtools";
import "@supabase/supabase-js";
import "@heroicons/react/24/outline";
import "react-hot-toast";
const Hero = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const frame = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    var _a;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);
    onChange();
    (_a = mq.addEventListener) == null ? void 0 : _a.call(mq, "change", onChange);
    return () => {
      var _a2;
      return (_a2 = mq.removeEventListener) == null ? void 0 : _a2.call(mq, "change", onChange);
    };
  }, []);
  useEffect(() => {
    const handleMouseMove = (e) => {
      lastPos.current = { x: e.clientX, y: e.clientY };
      if (!frame.current) {
        frame.current = requestAnimationFrame(() => {
          setMousePosition(lastPos.current);
          frame.current = null;
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  const handleGetStarted = () => navigate("/deals");
  const handleLearnMore = () => navigate("/about");
  const features = [
    { icon: Icons.shield, text: "Regulated Partners" },
    { icon: Icons.chart, text: "Market Analysis" },
    { icon: Icons.bolt, text: "Exclusive Bonuses" }
  ];
  const cryptoSymbols = [
    { symbol: "BTC", color: "from-orange-400/20 to-orange-600/20", border: "border-orange-400/30", text: "text-orange-500" },
    { symbol: "ETH", color: "from-blue-400/20 to-blue-600/20", border: "border-blue-400/30", text: "text-blue-500" },
    { symbol: "STOCKS", color: "from-green-400/20 to-green-600/20", border: "border-green-400/30", text: "text-green-500" },
    { symbol: "BONDS", color: "from-purple-400/20 to-purple-600/20", border: "border-purple-400/30", text: "text-purple-500" },
    { symbol: "FOREX", color: "from-cyan-400/20 to-cyan-600/20", border: "border-cyan-400/30", text: "text-cyan-500" },
    { symbol: "BANK", color: "from-indigo-400/20 to-indigo-600/20", border: "border-indigo-400/30", text: "text-indigo-500" },
    { symbol: "GOLD", color: "from-yellow-400/20 to-yellow-600/20", border: "border-yellow-400/30", text: "text-yellow-600" },
    { symbol: "USD", color: "from-gray-400/20 to-gray-600/20", border: "border-gray-400/30", text: "text-gray-500" }
  ];
  const bubblePositions = [
    { left: "5%", top: "14%", size: "w-10 h-10 sm:w-14 sm:h-14", delay: "0s", duration: "4.8s" },
    { right: "6%", top: "12%", size: "w-10 h-10 sm:w-14 sm:h-14", delay: "0.4s", duration: "5.2s" },
    { left: "3%", top: "42%", size: "w-12 h-12 sm:w-16 sm:h-16", delay: "0.8s", duration: "6s" },
    { right: "4%", top: "46%", size: "w-10 h-10 sm:w-14 sm:h-14", delay: "1.2s", duration: "5s" },
    { left: "8%", bottom: "22%", size: "w-12 h-12 sm:w-16 sm:h-16", delay: "1.6s", duration: "5.6s" },
    { right: "9%", bottom: "26%", size: "w-10 h-10 sm:w-14 sm:h-14", delay: "2s", duration: "4.6s" },
    { left: "12%", top: "30%", size: "w-8 h-8 sm:w-12 sm:h-12", delay: "2.4s", duration: "6.2s" },
    { right: "12%", bottom: "38%", size: "w-10 h-10 sm:w-14 sm:h-14", delay: "2.8s", duration: "5.4s" }
  ];
  const particles = useMemo(
    () => Array.from({ length: 12 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${8 + Math.random() * 4}s`
    })),
    []
  );
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-labelledby": "hero-title",
      className: "page-hero relative min-h-screen flex-center section-transition component-fade-in",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 hidden md:block pointer-events-none", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full max-w-7xl mx-auto container-px-sm sm:container-px-md lg:container-px-lg", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute w-80 h-80 sm:w-[28rem] sm:h-[28rem] rounded-full blur-3xl bg-gradient-to-br from-primary/15 via-secondary/12 to-accent/10 ${reduceMotion ? "" : "animate-float-enhanced"}`,
                style: {
                  left: `${-40 + mousePosition.x * 8e-3}px`,
                  top: `${-8 + mousePosition.y * 8e-3}%`
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl bg-gradient-to-tl from-accent/12 via-primary/10 to-secondary/8 ${reduceMotion ? "" : "animate-float-enhanced"}`,
                style: {
                  right: `${-32 + mousePosition.x * 6e-3}px`,
                  bottom: `${-8 + mousePosition.y * 6e-3}%`,
                  animationDelay: "2s"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl bg-gradient-to-r from-secondary/10 via-accent/8 to-primary/6 ${reduceMotion ? "" : "animate-float"}`,
                style: {
                  left: `${45 + mousePosition.x * 4e-3}%`,
                  top: `${25 + mousePosition.y * 4e-3}%`,
                  animationDelay: "4s"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full blur-2xl bg-gradient-to-br from-primary/8 to-accent/6 ${reduceMotion ? "" : "animate-float-light"}`,
                style: {
                  left: `${60 + mousePosition.x * 3e-3}%`,
                  top: `${60 + mousePosition.y * 3e-3}%`,
                  animationDelay: "1.5s"
                }
              }
            )
          ] }),
          cryptoSymbols.map((c, i) => {
            const p = bubblePositions[i];
            if (!p) return null;
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: `${reduceMotion ? "" : "animate-float-enhanced"} absolute group cursor-pointer`,
                style: {
                  left: p.left,
                  right: p.right,
                  top: p.top,
                  bottom: p.bottom,
                  animationDelay: p.delay,
                  animationDuration: p.duration
                },
                children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 ${c.color.replace("from-", "from-").replace("to-", "to-").replace("/20", "/40").replace("/30", "/60")} blur-sm scale-150`
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `${p.size} bg-gradient-to-br ${c.color} rounded-full border-2 ${c.border} flex items-center justify-center backdrop-blur-sm shadow-lg transition-all duration-500 hover:scale-125 hover:shadow-2xl hover:shadow-primary/30 group-hover:rotate-12 group-hover:brightness-110 relative overflow-hidden`,
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
                        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin", style: { animationDuration: "3s" } }),
                        /* @__PURE__ */ jsx("span", { className: `${c.text} font-bold text-[10px] sm:text-xs select-none transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-sm relative z-10`, children: c.symbol })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `absolute w-1 h-1 ${c.text.replace("text-", "bg-")} rounded-full opacity-0 group-hover:opacity-60 transition-all duration-1000 animate-float-light`,
                        style: {
                          left: "20%",
                          top: "10%",
                          animationDelay: "0.2s",
                          animationDuration: "2s"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `absolute w-0.5 h-0.5 ${c.text.replace("text-", "bg-")} rounded-full opacity-0 group-hover:opacity-40 transition-all duration-1200 animate-float-light`,
                        style: {
                          right: "15%",
                          bottom: "20%",
                          animationDelay: "0.8s",
                          animationDuration: "2.5s"
                        }
                      }
                    )
                  ] })
                ] })
              },
              c.symbol
            );
          }),
          particles.map((pt, i) => /* @__PURE__ */ jsx(
            "div",
            {
              className: `absolute w-1 h-1 bg-primary/40 rounded-full ${reduceMotion ? "" : "animate-float-light"} transition-all duration-300 hover:scale-200 hover:bg-primary/80 hover:shadow-lg hover:shadow-primary/50 cursor-pointer group`,
              style: { left: pt.left, top: pt.top, animationDelay: pt.delay, animationDuration: pt.duration },
              children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100" })
            },
            i
          )),
          /* @__PURE__ */ jsxs("svg", { className: "absolute inset-0 w-full h-full opacity-15 animate-pulse-glow", role: "presentation", children: [
            /* @__PURE__ */ jsxs("defs", { children: [
              /* @__PURE__ */ jsxs("linearGradient", { id: "heroConnectionGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
                /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "hsl(var(--heroui-primary))", stopOpacity: "0.4" }),
                /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "hsl(var(--heroui-secondary))", stopOpacity: "0.3" }),
                /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "hsl(var(--heroui-primary))", stopOpacity: "0.4" })
              ] }),
              /* @__PURE__ */ jsxs("filter", { id: "glow", children: [
                /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }),
                /* @__PURE__ */ jsxs("feMerge", { children: [
                  /* @__PURE__ */ jsx("feMergeNode", { in: "coloredBlur" }),
                  /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("line", { x1: "5%", y1: "88%", x2: "95%", y2: "98%", stroke: "url(#heroConnectionGradient)", strokeWidth: "1", opacity: "0.5", filter: "url(#glow)" }),
            /* @__PURE__ */ jsx("line", { x1: "10%", y1: "85%", x2: "90%", y2: "95%", stroke: "url(#heroConnectionGradient)", strokeWidth: "0.8", opacity: "0.4" }),
            /* @__PURE__ */ jsx("line", { x1: "15%", y1: "82%", x2: "85%", y2: "92%", stroke: "url(#heroConnectionGradient)", strokeWidth: "0.6", opacity: "0.3" }),
            /* @__PURE__ */ jsx("line", { x1: "20%", y1: "80%", x2: "80%", y2: "90%", stroke: "url(#heroConnectionGradient)", strokeWidth: "0.8", opacity: "0.4" }),
            /* @__PURE__ */ jsx("line", { x1: "25%", y1: "78%", x2: "75%", y2: "88%", stroke: "url(#heroConnectionGradient)", strokeWidth: "0.6", opacity: "0.3" }),
            /* @__PURE__ */ jsx("line", { x1: "50%", y1: "75%", x2: "50%", y2: "100%", stroke: "url(#heroConnectionGradient)", strokeWidth: "0.6", opacity: "0.2" }),
            /* @__PURE__ */ jsx("line", { x1: "30%", y1: "80%", x2: "30%", y2: "100%", stroke: "url(#heroConnectionGradient)", strokeWidth: "0.4", opacity: "0.15" }),
            /* @__PURE__ */ jsx("line", { x1: "70%", y1: "80%", x2: "70%", y2: "100%", stroke: "url(#heroConnectionGradient)", strokeWidth: "0.4", opacity: "0.15" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "container-page relative z-10", children: /* @__PURE__ */ jsx("div", { className: "content-full", children: /* @__PURE__ */ jsxs("div", { className: "flex-col-center text-center", children: [
          /* @__PURE__ */ jsxs("h1", { id: "hero-title", className: "text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-text animate-fade-in-up", style: { animationDelay: "0.2s" }, children: "Your Gateway to" }),
            /* @__PURE__ */ jsx("span", { className: "block gradient-text animate-gradient-shift animate-fade-in-up", style: { animationDelay: "0.4s" }, children: "Financial Freedom" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "content-wide", children: /* @__PURE__ */ jsx("p", { className: "text-base sm:text-lg md:text-xl lg:text-2xl text-textSecondary max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed container-px-xs animate-fade-in-up", style: { animationDelay: "0.6s" }, children: "Discover exclusive bonuses and deals from top crypto exchanges, stock brokers, banks, and investment platforms. Compare offers and maximize your financial potential." }) }),
          /* @__PURE__ */ jsx("div", { className: "flex-col-center gap-4 sm:gap-6 mb-10 sm:mb-14 container-px-md animate-fade-in-up", style: { animationDelay: "0.8s" }, children: /* @__PURE__ */ jsxs("div", { className: "flex-col-center sm:flex-row gap-3 sm:gap-4", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: handleGetStarted,
                "aria-label": "Explore investment deals",
                className: "btn-primary w-full sm:w-auto container-px-lg container-py-md text-base sm:text-lg group relative overflow-hidden transform hover:scale-105 transition-all duration-300",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/0 via-white/20 to-white/0 group-hover:translate-x-[100%] transition-transform duration-700" }),
                  /* @__PURE__ */ jsxs("span", { className: "relative z-10 inline-flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { children: "Explore Deals" }),
                    /* @__PURE__ */ jsx(Icons.arrowRight, { className: "w-4 h-4 sm:w-5 sm:h-5 translate-y-[0.5px] group-hover:translate-x-1 transition-transform duration-300", "aria-hidden": true })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleLearnMore,
                className: "btn-secondary w-full sm:w-auto container-px-lg container-py-md text-base sm:text-lg transform hover:scale-105 transition-all duration-300",
                children: "Learn More"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("ul", { className: "mx-auto max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 container-px-md animate-fade-in-up", style: { animationDelay: "1s" }, children: features.map((f, i) => /* @__PURE__ */ jsxs(
            "li",
            {
              className: "flex items-center justify-center gap-3 sm:gap-4 text-textSecondary hover:text-primary transition-all duration-300 group animate-fade-in-up",
              style: { animationDelay: `${1.2 + i * 0.1}s` },
              children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-primary/15 bg-gradient-to-r from-primary/10 to-secondary/10 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300", children: /* @__PURE__ */ jsx(f.icon, { className: "w-4.5 h-4.5 sm:w-5 sm:h-5 text-primary group-hover:rotate-12 transition-transform duration-300", "aria-hidden": true }) }),
                /* @__PURE__ */ jsx("span", { className: "text-sm sm:text-base font-medium leading-none group-hover:scale-105 transition-transform duration-300", children: f.text })
              ]
            },
            i
          )) })
        ] }) }) })
      ]
    }
  );
};
const FEATURED_DEALS_QUERY_KEY = ["featured-deals"];
const useFeaturedDealsQuery$1 = (limit = 6) => {
  const { isFullyReady } = useAuth();
  return useQuery({
    queryKey: [...FEATURED_DEALS_QUERY_KEY, limit],
    queryFn: async () => {
      try {
        const { data: allDealsData, error: dealsError } = await supabase.from("company_deals").select(`
            id,
            company_id,
            title,
            description,
            deal_type,
            value,
            affiliate_link,
            is_active,
            created_at,
            updated_at,
            company:trading_companies!company_deals_company_id_fkey (
              id,
              name,
              slug,
              description,
              logo_url,
              website_url,
              category,
              affiliate_link,
              overall_rating,
              total_reviews,
              status
            )
          `).eq("is_active", true).not("company", "is", null).order("created_at", { ascending: false });
        if (dealsError) {
          throw new Error(`Failed to fetch deals: ${dealsError.message}`);
        }
        const { data: allCompaniesData, error: companiesError } = await supabase.from("trading_companies").select(`
            id,
            name,
            slug,
            description,
            logo_url,
            website_url,
            category,
            affiliate_link,
            overall_rating,
            total_reviews,
            status
          `).eq("status", "active");
        if (companiesError) {
          throw new Error(`Failed to fetch companies: ${companiesError.message}`);
        }
        if (!allDealsData || !allCompaniesData) {
          return {
            deals: [],
            companies: [],
            featuredDeals: [],
            totalCount: 0,
            totalCompaniesCount: 0,
            totalDealsCount: 0
          };
        }
        const allDeals = allDealsData.filter((deal) => deal.company && deal.company.status === "active").map((deal) => ({
          id: deal.id,
          company_id: deal.company_id,
          title: deal.title,
          description: deal.description,
          deal_type: deal.deal_type,
          value: deal.value,
          affiliate_link: deal.affiliate_link,
          is_active: deal.is_active,
          created_at: deal.created_at,
          updated_at: deal.updated_at,
          company: deal.company
        }));
        const allCompanies = allCompaniesData.map((company) => ({
          id: company.id,
          name: company.name,
          slug: company.slug,
          description: company.description,
          logo_url: company.logo_url,
          website_url: company.website_url,
          category: company.category,
          affiliate_link: company.affiliate_link,
          overall_rating: company.overall_rating,
          total_reviews: company.total_reviews,
          status: company.status
        }));
        const featuredDeals = allDeals.sort((a, b) => {
          const ratingDiff = (b.company.overall_rating || 0) - (a.company.overall_rating || 0);
          if (ratingDiff !== 0) return ratingDiff;
          return (b.company.total_reviews || 0) - (a.company.total_reviews || 0);
        }).slice(0, limit);
        return {
          deals: allDeals,
          // ALL deals for statistics
          companies: allCompanies,
          // ALL companies for statistics
          featuredDeals,
          // Limited subset for display
          totalCount: featuredDeals.length,
          totalCompaniesCount: allCompanies.length,
          totalDealsCount: allDeals.length
        };
      } catch (error) {
        throw error;
      }
    },
    enabled: isFullyReady,
    staleTime: 5 * 60 * 1e3,
    gcTime: 10 * 60 * 1e3,
    retry: (failureCount, error) => {
      var _a, _b;
      if (((_a = error.message) == null ? void 0 : _a.includes("permission")) || ((_b = error.message) == null ? void 0 : _b.includes("policy"))) {
        return false;
      }
      return failureCount < 2;
    }
  });
};
const CATEGORY_ICONS = {
  "crypto_exchange": "🪙",
  "stock_broker": "📈",
  "forex_broker": "💱",
  "multi_asset": "🏦",
  "prop_firm": "💼",
  "trading_tool": "🔧"
};
const DEAL_TYPE_STYLES = {
  bonus: "from-green-400/20 to-green-600/20 border-green-400/30 text-green-600",
  discount: "from-blue-400/20 to-blue-600/20 border-blue-400/30 text-blue-600",
  free_trial: "from-purple-400/20 to-purple-600/20 border-purple-400/30 text-purple-600",
  cashback: "from-amber-400/20 to-amber-600/20 border-amber-400/30 text-amber-600",
  promotion: "from-pink-400/20 to-pink-600/20 border-pink-400/30 text-pink-600"
};
const Features = () => {
  var _a, _b, _c;
  const featuredDealsQuery = useFeaturedDealsQuery$1(6);
  const categoriesQuery = useCategoriesQuery();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const filteredDeals = useMemo(() => {
    var _a2;
    if (!((_a2 = featuredDealsQuery.data) == null ? void 0 : _a2.featuredDeals)) return [];
    if (selectedCategory === "all") {
      return featuredDealsQuery.data.featuredDeals;
    }
    return featuredDealsQuery.data.featuredDeals.filter(
      (deal) => deal.company.category === selectedCategory
    );
  }, [(_a = featuredDealsQuery.data) == null ? void 0 : _a.featuredDeals, selectedCategory]);
  const stats = useMemo(() => {
    const data = featuredDealsQuery.data;
    if (!data) return { companies: 0, deals: 0, categories: 0, totalReviews: 0, avgRating: 0 };
    const allCompanies = data.companies || [];
    const allDeals = data.deals || [];
    const activeCompanies = allCompanies.filter((company) => company.status === "active");
    const activeDeals = allDeals.filter((deal) => deal.is_active === true);
    const totalCategories = categoriesQuery.data ? categoriesQuery.data.length : 0;
    const totalReviews = activeCompanies.reduce((sum, company) => sum + (company.total_reviews || 0), 0);
    const companiesWithRatings = activeCompanies.filter(
      (company) => company.overall_rating > 0 && company.total_reviews > 0
    );
    const avgRating = companiesWithRatings.length > 0 ? companiesWithRatings.reduce((sum, company) => sum + (company.overall_rating || 0), 0) / companiesWithRatings.length : 0;
    return {
      companies: activeCompanies.length,
      deals: activeDeals.length,
      categories: totalCategories,
      totalReviews,
      avgRating: Math.round(avgRating * 10) / 10
    };
  }, [featuredDealsQuery.data, categoriesQuery.data]);
  const features = [
    {
      icon: Icons.search,
      title: "Compare Platforms",
      description: "Find the perfect trading platform for your needs with our comprehensive comparison tools.",
      image: "https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Icons.gift,
      title: "Exclusive Bonuses",
      description: "Access member-only deals and bonuses not available anywhere else.",
      image: "https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Icons.arrowTrendingUp,
      title: "Market Analysis",
      description: "Expert reviews and analysis to help you make informed trading decisions.",
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Icons.shield,
      title: "Verified Partners",
      description: "All platforms are regulated and verified for security and reliability.",
      image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Icons.users,
      title: "Community Reviews",
      description: "Real user reviews and ratings help you choose the right platform.",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Icons.chart,
      title: "Performance Tracking",
      description: "Track the average rating for each company & deal.",
      image: "https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];
  if (categoriesQuery.error) {
    return /* @__PURE__ */ jsx("section", { className: "page-section", children: /* @__PURE__ */ jsx("div", { className: "container-page", children: /* @__PURE__ */ jsxs("div", { className: "flex-col-center min-h-96", children: [
      /* @__PURE__ */ jsx(Icons.database, { className: "w-12 h-12 text-red-600 mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-text mb-2", children: "Categories Not Available" }),
      /* @__PURE__ */ jsx("p", { className: "text-textSecondary", children: "Unable to load trading categories. Please try again later." })
    ] }) }) });
  }
  if (featuredDealsQuery.error) {
    return /* @__PURE__ */ jsx("section", { className: "page-section", children: /* @__PURE__ */ jsx("div", { className: "container-page", children: /* @__PURE__ */ jsxs("div", { className: "flex-col-center min-h-96", children: [
      /* @__PURE__ */ jsx(Icons.warning, { className: "w-12 h-12 text-red-600 mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-text mb-2", children: "Unable to Load Featured Deals" }),
      /* @__PURE__ */ jsx("p", { className: "text-textSecondary mb-6", children: featuredDealsQuery.error instanceof Error ? featuredDealsQuery.error.message : "Failed to load featured deals" })
    ] }) }) });
  }
  const isLoading = featuredDealsQuery.isLoading || categoriesQuery.isLoading;
  if (isLoading) {
    return /* @__PURE__ */ jsx("section", { className: "page-section", children: /* @__PURE__ */ jsxs("div", { className: "container-page", children: [
      /* @__PURE__ */ jsx("div", { className: "text-center mb-16", children: /* @__PURE__ */ jsxs("h2", { className: "text-4xl lg:text-5xl font-bold text-text mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "gradient-text", children: "Loading Featured" }),
        /* @__PURE__ */ jsx("br", {}),
        "Trading Deals"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-col-center min-h-96", children: [
        /* @__PURE__ */ jsx(Icons.refresh, { className: "w-8 h-8 animate-spin text-primary mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-textSecondary", children: "Loading exclusive deals and top platforms..." })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("section", { id: "features", className: "page-section relative section-transition component-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsxs("svg", { className: "absolute inset-0 w-full h-full opacity-10", role: "presentation", children: [
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs("linearGradient", { id: "featuresConnectionGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "hsl(var(--heroui-primary))", stopOpacity: "0.3" }),
            /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "hsl(var(--heroui-secondary))", stopOpacity: "0.2" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "hsl(var(--heroui-primary))", stopOpacity: "0.3" })
          ] }),
          /* @__PURE__ */ jsxs("filter", { id: "featuresGlow", children: [
            /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }),
            /* @__PURE__ */ jsxs("feMerge", { children: [
              /* @__PURE__ */ jsx("feMergeNode", { in: "coloredBlur" }),
              /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("line", { x1: "5%", y1: "0%", x2: "95%", y2: "8%", stroke: "url(#featuresConnectionGradient)", strokeWidth: "1", opacity: "0.4", filter: "url(#featuresGlow)" }),
        /* @__PURE__ */ jsx("line", { x1: "10%", y1: "0%", x2: "90%", y2: "12%", stroke: "url(#featuresConnectionGradient)", strokeWidth: "0.8", opacity: "0.3" }),
        /* @__PURE__ */ jsx("line", { x1: "15%", y1: "0%", x2: "85%", y2: "16%", stroke: "url(#featuresConnectionGradient)", strokeWidth: "0.6", opacity: "0.2" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1", children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full animate-pulse opacity-30" }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-2 left-1/4 transform -translate-y-0.5", children: /* @__PURE__ */ jsx("div", { className: "w-1 h-1 bg-primary/20 rounded-full animate-pulse opacity-20", style: { animationDelay: "0.5s" } }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-1/4 transform -translate-y-0.5", children: /* @__PURE__ */ jsx("div", { className: "w-1 h-1 bg-secondary/20 rounded-full animate-pulse opacity-20", style: { animationDelay: "1s" } }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "container-page relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16 animate-fade-in-up section-px-lg section-py-xl", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-4xl lg:text-5xl font-bold text-text mb-8", children: [
          /* @__PURE__ */ jsx("span", { className: "gradient-text", children: "Your Gateway to" }),
          /* @__PURE__ */ jsx("br", {}),
          "Financial Success"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "content-wide", children: /* @__PURE__ */ jsx("p", { className: "text-xl text-textSecondary leading-relaxed", children: "Discover exclusive deals, compare platforms, and maximize your trading potential with our comprehensive affiliate network and expert insights." }) })
      ] }),
      ((_b = featuredDealsQuery.data) == null ? void 0 : _b.featuredDeals) && featuredDealsQuery.data.featuredDeals.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-12 animate-scale-in section-px-lg section-py-lg", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-between mb-10", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold text-text mb-2", children: "Featured Trading Platforms" }),
            /* @__PURE__ */ jsx("p", { className: "text-textSecondary", children: "Handpicked platforms with exclusive deals and bonuses" })
          ] }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "/deals",
              className: "flex-center text-primary hover:text-primaryHover transition-colors group",
              children: [
                "View All Deals",
                /* @__PURE__ */ jsx(Icons.arrowRight, { className: "w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" })
              ]
            }
          )
        ] }),
        categoriesQuery.data && categoriesQuery.data.length > 1 && /* @__PURE__ */ jsxs("div", { className: "mb-8 container-px-sm container-py-md", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-text", children: "Filter by Category" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-lg", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSelectedCategory("all"),
                className: `container-px-xl container-py-md rounded-xl text-base font-medium transition-all duration-200 ${selectedCategory === "all" ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25" : "glass text-textSecondary hover:text-text hover:bg-content1/50 border border-divider/50"}`,
                children: "All Categories"
              }
            ),
            categoriesQuery.data.filter((cat) => cat.value !== "all").slice(0, 5).map((category) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSelectedCategory(category.value),
                className: `container-px-xl container-py-md rounded-xl text-base font-medium transition-all duration-200 ${selectedCategory === category.value ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25" : "glass text-textSecondary hover:text-text hover:bg-content1/50 border border-divider/50"}`,
                children: category.label
              },
              category.value
            ))
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full max-w-7xl mx-auto container-px-md container-py-lg", children: /* @__PURE__ */ jsx("div", { className: "grid-deals", children: filteredDeals.slice(0, 6).map((deal) => {
          var _a2, _b2;
          return /* @__PURE__ */ jsxs("div", { className: "card-deal group", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-between my-lg", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-start gap-md", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  deal.company.logo_url ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: deal.company.logo_url,
                      alt: deal.company.name,
                      className: "w-12 h-12 rounded-xl object-cover border border-divider/50",
                      onError: (e) => {
                        var _a3;
                        const target = e.target;
                        target.style.display = "none";
                        (_a3 = target.nextElementSibling) == null ? void 0 : _a3.setAttribute("style", "display: flex");
                      }
                    }
                  ) : null,
                  /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl ${deal.company.logo_url ? "hidden" : ""}`, children: CATEGORY_ICONS[deal.company.category] || "🏢" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold text-text my-xs", children: deal.company.name }),
                  /* @__PURE__ */ jsx("span", { className: "inline-flex items-center container-px-sm container-py-xs bg-primary/10 text-primary text-xs font-medium rounded-full", children: ((_b2 = (_a2 = categoriesQuery.data) == null ? void 0 : _a2.find((cat) => cat.value === deal.company.category)) == null ? void 0 : _b2.label) || deal.company.category })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end my-xs", children: [
                  /* @__PURE__ */ jsx(Icons.star, { className: "w-4 h-4 text-warning fill-current mr-xs" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-text", children: (deal.company.overall_rating || 0).toFixed(1) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs text-textSecondary", children: [
                  deal.company.total_reviews || 0,
                  " reviews"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "my-lg", children: [
              /* @__PURE__ */ jsx("p", { className: "text-textSecondary text-sm leading-relaxed line-clamp-3 my-md", children: deal.description }),
              /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center container-px-md container-py-sm bg-gradient-to-r border rounded-xl text-sm font-semibold ${DEAL_TYPE_STYLES[deal.deal_type] || DEAL_TYPE_STYLES.bonus}`, children: [
                /* @__PURE__ */ jsx(Icons.gift, { className: "w-4 h-4 mr-xs" }),
                deal.value || deal.title
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: deal.affiliate_link,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "btn-primary w-full group",
                children: [
                  "Get Deal Now",
                  /* @__PURE__ */ jsx(Icons.externalLink, { className: "ml-sm w-4 h-4 group-hover:translate-x-1 transition-transform" })
                ]
              }
            )
          ] }, deal.id);
        }) }) }),
        filteredDeals.length === 0 && ((_c = featuredDealsQuery.data) == null ? void 0 : _c.featuredDeals) && featuredDealsQuery.data.featuredDeals.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex-col-center py-8", children: [
          /* @__PURE__ */ jsx(Icons.gift, { className: "w-12 h-12 mb-4 text-textSecondary" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-text mb-2", children: "No deals in this category" }),
          /* @__PURE__ */ jsx("p", { className: "text-textSecondary mb-4", children: "Try selecting a different category or view all deals." }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSelectedCategory("all"),
              className: "text-primary hover:text-primaryHover transition-colors",
              children: "Show All Deals"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8 section-px-lg section-py-xl", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold text-text mb-4", children: "Why Choose Our Platform" }),
        /* @__PURE__ */ jsx("p", { className: "text-textSecondary text-lg max-w-2xl mx-auto", children: "Discover the features that make us the trusted choice for traders worldwide" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid-cards section-px-lg section-py-lg", children: features.map((feature, index) => /* @__PURE__ */ jsxs("div", { className: "card-feature group animate-slide-in-left", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-xl mb-8", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: feature.image,
              alt: feature.title,
              className: "w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-text mb-4", children: feature.title }),
          /* @__PURE__ */ jsx("p", { className: "text-textSecondary leading-relaxed text-sm", children: feature.description })
        ] })
      ] }, index)) }),
      /* @__PURE__ */ jsx("div", { className: "text-center my-3xl section-px-lg section-py-xl", children: /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-2xl border-primary/20", children: [
        /* @__PURE__ */ jsxs("div", { className: "my-xl", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-3xl lg:text-4xl font-bold text-text my-lg", children: "Start Trading with Exclusive Bonuses Today" }),
          /* @__PURE__ */ jsx("div", { className: "content-wide", children: /* @__PURE__ */ jsx("p", { className: "text-lg text-textSecondary my-xl leading-relaxed", children: "Access handpicked trading platforms with member-exclusive deals across crypto, prop trading, and multi-asset markets." }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid-stats-4 my-2xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "glass rounded-xl p-lg hover:bg-content1/50 transition-colors", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-center my-sm mb-2", children: /* @__PURE__ */ jsx(Icons.shield, { className: "w-6 h-6 text-primary" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold text-text block", children: stats.companies })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-textSecondary font-medium text-center", children: "Trading Platforms" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "glass rounded-xl p-lg hover:bg-content1/50 transition-colors", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-center my-sm mb-2", children: /* @__PURE__ */ jsx(Icons.gift, { className: "w-6 h-6 text-secondary" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold text-text block", children: stats.deals })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-textSecondary font-medium text-center", children: "Exclusive Deals" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "glass rounded-xl p-lg hover:bg-content1/50 transition-colors", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-center my-sm mb-2", children: /* @__PURE__ */ jsx(Icons.chart, { className: "w-6 h-6 text-primary" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold text-text block", children: stats.categories })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-textSecondary font-medium text-center", children: "Market Categories" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "glass rounded-xl p-lg hover:bg-content1/50 transition-colors", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-center my-sm mb-2", children: /* @__PURE__ */ jsx(Icons.users, { className: "w-6 h-6 text-secondary" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold text-text block", children: stats.totalReviews })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-textSecondary font-medium text-center", children: "User Reviews" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "my-xl", children: /* @__PURE__ */ jsxs("a", { href: "/deals", className: "btn-primary group text-lg container-px-xl container-py-md", children: [
          "Browse All ",
          stats.deals,
          " Deals",
          /* @__PURE__ */ jsx(Icons.arrowRight, { className: "ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "py-xl border-t border-divider/30", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-md text-sm text-foreground/70", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center container-px-sm container-py-xs", children: [
            /* @__PURE__ */ jsx(Icons.shield, { className: "w-4 h-4 text-primary mr-sm" }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              stats.companies,
              " verified platforms"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center container-px-sm container-py-xs", children: [
            /* @__PURE__ */ jsx(Icons.gift, { className: "w-4 h-4 text-secondary mr-sm" }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              stats.deals,
              " active offers"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center container-px-sm container-py-xs", children: [
            /* @__PURE__ */ jsx(Icons.refresh, { className: "w-4 h-4 text-primary mr-sm" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Updated daily" })
          ] }),
          stats.avgRating > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center container-px-sm container-py-xs", children: [
            /* @__PURE__ */ jsx(Icons.star, { className: "w-4 h-4 text-warning fill-current mr-sm" }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              stats.avgRating.toFixed(1),
              " platform rating"
            ] })
          ] })
        ] }) })
      ] }) })
    ] })
  ] });
};
const CATEGORY_KEYS = [
  "platform_usability",
  "customer_support",
  "fees_commissions",
  "security_trust",
  "educational_resources",
  "mobile_app"
];
const isValidScore = (v) => typeof v === "number" && Number.isFinite(v) && v > 0 && v <= 5;
const toNonNegativeInt = (v) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
};
const average = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const nf = new Intl.NumberFormat("en-US");
const Stats = () => {
  const [stats, setStats] = React__default.useState([]);
  const [isLoading, setIsLoading] = React__default.useState(true);
  const [error, setError] = React__default.useState(null);
  React__default.useEffect(() => {
    let isMounted = true;
    const fetchStatsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [companiesRes, ratingsRes] = await Promise.all([
          supabase.from("trading_companies").select("id, name, overall_rating, total_reviews, category, status").eq("status", "active"),
          supabase.from("ratings").select(
            "id, overall_rating, platform_usability, customer_support, fees_commissions, security_trust, educational_resources, mobile_app"
          )
        ]);
        if (companiesRes.error) throw companiesRes.error;
        if (ratingsRes.error) throw ratingsRes.error;
        const companies = Array.isArray(companiesRes.data) ? companiesRes.data : [];
        const ratings = Array.isArray(ratingsRes.data) ? ratingsRes.data : [];
        const totalCompanies = companies.length;
        const totalReviews = companies.reduce((sum, c) => {
          return sum + toNonNegativeInt(c.total_reviews);
        }, 0);
        let totalWeighted = 0;
        let totalWeight = 0;
        for (const c of companies) {
          const r = c.overall_rating;
          const w = toNonNegativeInt(c.total_reviews);
          if (isValidScore(r) && w > 0) {
            totalWeighted += r * w;
            totalWeight += w;
          }
        }
        const avgRating = totalWeight > 0 ? totalWeighted / totalWeight : 0;
        const categoryAverages = CATEGORY_KEYS.map((key) => {
          const vals = ratings.map((r) => r[key]).filter(isValidScore);
          return average(vals);
        }).filter((n) => n > 0);
        const base = categoryAverages.length ? average(categoryAverages) : avgRating;
        const overallSatisfaction = clamp(base / 5 * 100, 0, 100);
        const categoryCount = new Set(
          companies.map((c) => (c.category ?? "").trim()).filter(Boolean)
        ).size;
        const dynamicStats = [
          {
            icon: Icons.arrowTrendingUp,
            value: totalCompanies > 0 ? String(totalCompanies) : "0",
            label: "Products Reviewed",
            description: `Across ${categoryCount} ${categoryCount === 1 ? "category" : "categories"}`
          },
          {
            icon: Icons.users,
            value: totalReviews > 0 ? nf.format(totalReviews) : "0",
            label: "Verified Reviews",
            description: avgRating > 0 ? `${avgRating.toFixed(1)}/5 average rating` : "No ratings yet"
          },
          {
            icon: Icons.shield,
            value: overallSatisfaction > 0 ? `${Math.round(overallSatisfaction)}%` : "0%",
            label: "User Satisfaction",
            description: overallSatisfaction > 0 ? "Users trust our recommendations" : "Building trust with users"
          }
        ];
        if (!isMounted) return;
        setStats(dynamicStats);
      } catch (err) {
        console.error("Failed to load statistics:", err);
        if (!isMounted) return;
        setError(
          err && typeof err === "object" && "message" in err ? String(err.message) : "Unknown error"
        );
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };
    fetchStatsData();
    return () => {
      isMounted = false;
    };
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsx("section", { className: "page-section", children: /* @__PURE__ */ jsx("div", { className: "container-page", children: /* @__PURE__ */ jsx("div", { className: "grid-stats", children: [1, 2, 3].map((index) => /* @__PURE__ */ jsxs("div", { className: "text-center animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-default-200 rounded-2xl mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "h-10 bg-default-200 rounded mb-2 w-24 mx-auto" }),
      /* @__PURE__ */ jsx("div", { className: "h-6 bg-default-200 rounded mb-1 w-32 mx-auto" }),
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-default-200 rounded w-40 mx-auto" })
    ] }, index)) }) }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("section", { className: "page-section", children: /* @__PURE__ */ jsx("div", { className: "container-page", children: /* @__PURE__ */ jsxs("div", { className: "flex-col-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-danger-100 rounded-2xl flex-center mb-4", children: /* @__PURE__ */ jsx(Icons.shield, { className: "w-8 h-8 text-danger-600" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-text mb-2", children: "Unable to Load Statistics" }),
      /* @__PURE__ */ jsx("p", { className: "text-textSecondary", children: "We're having trouble connecting to our database." })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx("section", { className: "page-section relative section-transition component-fade-in", children: /* @__PURE__ */ jsx("div", { className: "container-page relative z-10", children: /* @__PURE__ */ jsx("div", { className: "grid-stats max-w-5xl mx-auto", children: stats.map((stat, index) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: "text-center group hover:transform hover:scale-105 transition-all duration-300 animate-fade-in-up",
      style: { animationDelay: `${index * 0.1}s` },
      children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl my-lg group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300", children: /* @__PURE__ */ jsx(stat.icon, { className: "w-8 h-8 text-white" }) }),
        /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold text-text my-sm animate-scale-in", children: stat.value }),
        /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-text my-xs", children: stat.label }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-textSecondary", children: stat.description })
      ]
    },
    index
  )) }) }) });
};
let useFeaturedDealsQuery = null;
try {
  const hookModule = require("../hooks/queries/useFeaturedDealsQuery");
  useFeaturedDealsQuery = hookModule.useFeaturedDealsQuery;
} catch (importError) {
}
const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let featuredDealsQuery = null;
  if (useFeaturedDealsQuery) {
    try {
      featuredDealsQuery = useFeaturedDealsQuery(1);
    } catch (hookError) {
    }
  }
  const stats = useMemo(() => {
    const defaultStats = {
      subscribers: "50K+",
      deals: "Weekly",
      exclusive: "Exclusive"
    };
    if (featuredDealsQuery == null ? void 0 : featuredDealsQuery.data) {
      try {
        const data = featuredDealsQuery.data;
        const totalCompaniesCount = typeof data.totalCompaniesCount === "number" ? data.totalCompaniesCount : 50;
        const totalDealsCount = typeof data.totalDealsCount === "number" ? data.totalDealsCount : 25;
        return {
          subscribers: `${Math.floor(totalCompaniesCount * 1e3 + totalDealsCount * 500)}+`,
          deals: "Weekly",
          exclusive: `${totalDealsCount}+ Active`
        };
      } catch (calculationError) {
        return defaultStats;
      }
    }
    return defaultStats;
  }, [featuredDealsQuery == null ? void 0 : featuredDealsQuery.data]);
  const handleSubmit = async (e) => {
    var _a, _b, _c, _d, _e, _f;
    e.preventDefault();
    if (!email) {
      showErrorToast("Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorToast("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: {
          email,
          source: "website_newsletter",
          preferences: {
            weekly_newsletter: true,
            deal_alerts: true,
            platform_updates: true
          }
        }
      });
      if (error) {
        if (((_a = error.message) == null ? void 0 : _a.includes("409")) || ((_b = error.message) == null ? void 0 : _b.includes("Conflict")) || ((_c = error.message) == null ? void 0 : _c.includes("already subscribed")) || ((_d = error.message) == null ? void 0 : _d.includes("Email already subscribed"))) {
          showErrorToast("This email is already subscribed to our newsletter");
        } else if ((_e = error.message) == null ? void 0 : _e.includes("400")) {
          showErrorToast("Invalid email address format");
        } else if ((_f = error.message) == null ? void 0 : _f.includes("500")) {
          showErrorToast("Server error - please try again later");
        } else {
          showErrorToast("Failed to subscribe. Please try again later.");
        }
        return;
      }
      if (data == null ? void 0 : data.success) {
        showSuccessToast(data.message || "Successfully subscribed!");
        setEmail("");
      } else {
        showErrorToast("Failed to subscribe. Please try again later.");
      }
    } catch (error) {
      showErrorToast("Failed to subscribe. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "page-section relative section-py-2xl section-transition component-fade-in", children: /* @__PURE__ */ jsx("div", { className: "container-page relative z-10", children: /* @__PURE__ */ jsx("div", { className: "content-wide", children: /* @__PURE__ */ jsxs("div", { className: "card-feature border-border animate-scale-in", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-center my-xl", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex-center", children: /* @__PURE__ */ jsx(Icons.mail, { className: "w-8 h-8 text-white" }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "text-center my-xl", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl lg:text-4xl font-bold text-text my-lg", children: "Stay Ahead of the Trading Game" }),
      /* @__PURE__ */ jsx("div", { className: "content-narrow", children: /* @__PURE__ */ jsx("p", { className: "text-xl text-textSecondary", children: "Get exclusive trading insights, market analysis, and the latest bonus deals delivered directly to your inbox. Join thousands of smart traders who never miss an opportunity." }) })
    ] }),
    /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, className: "content-narrow my-xl", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          placeholder: "Enter your email address",
          className: "flex-1 container-px-lg container-py-md bg-background border border-border rounded-full text-text placeholder-textSecondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300",
          disabled: isLoading,
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: isLoading,
          className: "btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          children: isLoading ? /* @__PURE__ */ jsxs("span", { className: "flex-center", children: [
            /* @__PURE__ */ jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", fill: "none", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
              /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
            ] }),
            "Subscribing..."
          ] }) : "Subscribe Now"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-center my-xl text-sm text-textSecondary", children: [
      /* @__PURE__ */ jsx(Icons.success, { className: "w-4 h-4 mr-2 text-green-600" }),
      /* @__PURE__ */ jsx("span", { children: "No spam • Exclusive deals • Unsubscribe anytime" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid-stats my-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-center my-sm", children: [
          /* @__PURE__ */ jsx(Icons.users, { className: "w-5 h-5 text-primary mr-2" }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-text", children: stats.subscribers })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-textSecondary text-sm", children: "Active Subscribers" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-center my-sm", children: [
          /* @__PURE__ */ jsx(Icons.arrowTrendingUp, { className: "w-5 h-5 text-secondary mr-2" }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-text", children: stats.deals })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-textSecondary text-sm", children: "Market Updates" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-center my-sm", children: [
          /* @__PURE__ */ jsx(Icons.gift, { className: "w-5 h-5 text-primary mr-2" }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-text", children: stats.exclusive })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-textSecondary text-sm", children: "Exclusive Deals" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-lg border-primary/20", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-text my-md text-center", children: "What You'll Receive:" }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-md text-left", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-start gap-sm", children: [
          /* @__PURE__ */ jsx(Icons.success, { className: "w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-text", children: "Weekly Market Insights" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-textSecondary", children: "Expert analysis and trading opportunities" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-start gap-sm", children: [
          /* @__PURE__ */ jsx(Icons.success, { className: "w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-text", children: "Exclusive Bonus Alerts" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-textSecondary", children: "First access to new platform deals" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-start gap-sm", children: [
          /* @__PURE__ */ jsx(Icons.success, { className: "w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-text", children: "Platform Reviews" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-textSecondary", children: "Detailed analysis of new trading platforms" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-start gap-sm", children: [
          /* @__PURE__ */ jsx(Icons.success, { className: "w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-text", children: "Educational Content" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-textSecondary", children: "Trading tips and strategy guides" })
          ] })
        ] })
      ] })
    ] })
  ] }) }) }) });
};
const CTA = () => {
  const navigate = useNavigate();
  const [binanceData, setBinanceData] = React__default.useState(null);
  const [isLoading, setIsLoading] = React__default.useState(true);
  React__default.useEffect(() => {
    const fetchBinanceData = async () => {
      try {
        const { data: binanceCompany, error } = await supabase.from("trading_companies").select("name, overall_rating, total_reviews, status").ilike("name", "%binance%").eq("status", "active").single();
        if (error) {
          console.log("No Binance data found, using default");
        }
        setBinanceData(binanceCompany);
      } catch (err) {
        console.log("Error fetching Binance data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBinanceData();
  }, []);
  const binanceDeal = {
    title: "Welcome Bonus: 20% Trading Fee Discount",
    description: "Get 20% off all trading fees for your first 30 days. Valid for new users only. Must complete verification within 7 days.",
    deal_type: "discount",
    value: "20% Fee Discount",
    rating: (binanceData == null ? void 0 : binanceData.overall_rating) || 4.6,
    reviews: (binanceData == null ? void 0 : binanceData.total_reviews) || 1250,
    affiliate_link: "https://www.binance.com/en/register?ref=welcome20"
  };
  const handleMainAction = () => {
    window.open(binanceDeal.affiliate_link, "_blank");
  };
  return /* @__PURE__ */ jsx("section", { className: "page-section relative overflow-hidden section-py-2xl section-transition component-fade-in", children: /* @__PURE__ */ jsx("div", { className: "container-page relative z-10", children: /* @__PURE__ */ jsx("div", { className: "content-full", children: /* @__PURE__ */ jsxs("div", { className: "glass rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-700 hover:scale-[1.02] hover:shadow-3xl border-border animate-scale-in", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 p-8 lg:p-12", children: /* @__PURE__ */ jsxs("div", { className: "flex-col-center text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-3 bg-primary/10 border border-primary/20 text-primary container-px-lg container-py-sm rounded-full text-sm font-semibold mb-8 glass transform transition-all duration-500 hover:scale-105 hover:bg-primary/15 hover:border-primary/30 animate-fade-in-up", children: [
        /* @__PURE__ */ jsx(Icons.gift, { className: "w-5 h-5 animate-bounce", style: { animationDuration: "2s" } }),
        isLoading ? /* @__PURE__ */ jsx("div", { className: "h-5 w-32 bg-primary/20 rounded animate-pulse" }) : "Exclusive Binance Deal"
      ] }),
      /* @__PURE__ */ jsxs("h2", { className: "text-5xl sm:text-6xl lg:text-7xl font-bold text-text mb-8 leading-tight", children: [
        /* @__PURE__ */ jsx("span", { className: "block transform transition-all duration-700 hover:scale-105", children: "Save on Trading Fees" }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "gradient-text animate-gradient-x transform transition-all duration-700 hover:scale-110 inline-block", children: "20% Discount" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "content-wide", children: /* @__PURE__ */ jsx("div", { className: "text-xl text-textSecondary mb-12 leading-relaxed", children: isLoading ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-6 w-full bg-default-200 rounded animate-pulse" }),
        /* @__PURE__ */ jsx("div", { className: "h-6 w-3/4 mx-auto bg-default-200 rounded animate-pulse" })
      ] }) : /* @__PURE__ */ jsxs("p", { children: [
        "Join ",
        binanceDeal.reviews.toLocaleString(),
        " traders who rated Binance ",
        binanceDeal.rating,
        "/5 stars. Get exclusive 20% off trading fees for new users."
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "mb-12 content-wide", children: /* @__PURE__ */ jsxs("div", { className: "card-feature hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] transform group relative overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-between mb-6 gap-4 flex-col sm:flex-row", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "bg-primary/10 border border-primary/20 text-primary container-px-md container-py-sm rounded-full text-sm font-semibold capitalize", children: binanceDeal.deal_type }),
            /* @__PURE__ */ jsxs("div", { className: "flex-center gap-2", children: [
              /* @__PURE__ */ jsx(Icons.star, { className: "w-5 h-5 text-warning fill-current" }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-textSecondary font-medium", children: [
                binanceDeal.rating,
                " (",
                binanceDeal.reviews.toLocaleString(),
                " reviews)"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold gradient-text", children: binanceDeal.value })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-text mb-4", children: binanceDeal.title }),
        /* @__PURE__ */ jsx("p", { className: "text-textSecondary mb-6 leading-relaxed", children: binanceDeal.description }),
        /* @__PURE__ */ jsxs("div", { className: "flex-center gap-2 text-sm text-textSecondary", children: [
          /* @__PURE__ */ jsx(Icons.users, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Trusted by ",
            binanceDeal.reviews.toLocaleString(),
            "+ users worldwide"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "my-2xl", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleMainAction,
          className: "btn-primary text-xl group relative overflow-hidden transform hover:scale-105 hover:rotate-1",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-center gap-4 relative z-10", children: [
              /* @__PURE__ */ jsx(Icons.externalLink, { className: "w-6 h-6 group-hover:rotate-12 transition-transform duration-300" }),
              /* @__PURE__ */ jsx("span", { children: "Get Binance Deal Now" }),
              /* @__PURE__ */ jsx(Icons.arrowRight, { className: "w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 border-2 border-white/30 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 animate-pulse-glow" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-col-center space-y-4 mt-xl", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-textSecondary glass border border-border rounded-full container-px-lg container-py-sm", children: "* 20% fee discount valid for 30 days. New verified users only." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/deals"),
            className: "text-primary hover:text-primary/80 underline text-sm font-medium transition-colors hover:bg-primary/5 container-px-md container-py-sm rounded-lg",
            children: "Browse all deals instead"
          }
        )
      ] })
    ] }) })
  ] }) }) }) });
};
const Home = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SEO, { ...seoData.home }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
      /* @__PURE__ */ jsx(Hero, {}),
      /* @__PURE__ */ jsx("div", { className: "section-py-xl", children: /* @__PURE__ */ jsx(Features, {}) }),
      /* @__PURE__ */ jsx("div", { className: "w-full flex justify-center items-center py-8", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-4xl px-4", children: /* @__PURE__ */ jsx(AdUnit, {}) }) }),
      /* @__PURE__ */ jsx("div", { className: "section-py-xl", children: /* @__PURE__ */ jsx(Stats, {}) }),
      /* @__PURE__ */ jsx("div", { className: "section-py-xl", children: /* @__PURE__ */ jsx(Newsletter, {}) }),
      /* @__PURE__ */ jsx("div", { className: "section-py-xl", children: /* @__PURE__ */ jsx(CTA, {}) })
    ] })
  ] });
};
export {
  Home as default
};
