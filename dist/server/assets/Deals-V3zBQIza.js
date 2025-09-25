import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useCallback } from "react";
import { u as useAuth, I as Icons, D as DealsSkeleton, A as AuthModal, G as GuestLayout } from "../entry-server.js";
import { u as useDebounce, U as UnifiedDealCard } from "./useDebounce-BhBIovgt.js";
import { R as RatingModal } from "./RatingModal-D0MNzkGa.js";
import { u as usePaginatedDealsQuery, a as useUserRatingsQuery, b as useUpdateDealClickMutation } from "./useDealsQuery-CZaqgNr5.js";
import { u as useCategoriesQuery, a as useCategoryStatsQuery, b as useCategoryInfoQuery } from "./useCategoriesQuery-BP0yqNTQ.js";
import { A as AdUnit } from "./AdUnit-Div7rPfI.js";
import { g as generateDealsStructuredData, S as SEO, s as seoData } from "./seoData-LGOe0Do4.js";
import "react-dom/server";
import "react-router-dom/server.mjs";
import "@tanstack/react-query";
import "@heroui/react";
import "./react-B6hsMDRz.js";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "react-router-dom";
import "@tanstack/react-query-devtools";
import "@supabase/supabase-js";
import "@heroicons/react/24/outline";
import "react-hot-toast";
const Deals = ({ isInDashboard = false }) => {
  var _a, _b, _c, _d, _e;
  const { user, isFullyReady } = useAuth();
  const isDashboardContext = isInDashboard || !!user;
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "all",
    sortBy: "rating"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);
  const pageLimit = 12;
  const paginatedQuery = usePaginatedDealsQuery(currentPage, pageLimit, {
    searchTerm: debouncedSearchTerm,
    category: filters.category,
    sortBy: filters.sortBy
  });
  const deals = ((_a = paginatedQuery.data) == null ? void 0 : _a.deals) || [];
  const companies = ((_b = paginatedQuery.data) == null ? void 0 : _b.companies) || [];
  const totalCount = ((_c = paginatedQuery.data) == null ? void 0 : _c.totalCount) || 0;
  const categoriesQuery = useCategoriesQuery();
  const categories = categoriesQuery.data || [];
  const companyIds = useMemo(
    () => deals.map((deal) => {
      var _a2;
      return (_a2 = deal.company) == null ? void 0 : _a2.id;
    }).filter(Boolean),
    [deals]
  );
  const userRatingsQuery = useUserRatingsQuery(user == null ? void 0 : user.id, companyIds);
  const categoryStatsQuery = useCategoryStatsQuery(deals);
  const categoryStats = categoryStatsQuery.data || /* @__PURE__ */ new Map();
  const categoryInfoQuery = useCategoryInfoQuery(companies);
  const categoryInfo = categoryInfoQuery.data || /* @__PURE__ */ new Map();
  const updateDealClickMutation = useUpdateDealClickMutation();
  const dealsWithUserRatings = useMemo(() => {
    const userRatings = userRatingsQuery.data || {};
    return deals.map((deal) => {
      var _a2;
      return {
        ...deal,
        userRating: ((_a2 = deal.company) == null ? void 0 : _a2.id) ? userRatings[deal.company.id] : void 0
      };
    });
  }, [deals, userRatingsQuery.data]);
  const totalPages = Math.ceil(totalCount / pageLimit);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const selectedCategoryInfo = useMemo(() => {
    if (filters.category === "all") return null;
    const category = categories.find((cat) => cat.value === filters.category);
    const info = categoryInfo.get(filters.category);
    return {
      title: (category == null ? void 0 : category.label) || "Category Deals",
      description: (category == null ? void 0 : category.description) || "Exclusive deals in this category",
      companies: (info == null ? void 0 : info.companies) || [],
      count: (info == null ? void 0 : info.count) || 0
    };
  }, [filters.category, categories, categoryInfo]);
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const handleRateClick = useCallback((deal) => {
    if (!user) {
      if (isDashboardContext) {
        console.warn("Unauthenticated user in dashboard context");
        return;
      }
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }
    if (!deal.company) return;
    setSelectedDeal(deal);
    setShowRatingModal(true);
  }, [user, isDashboardContext]);
  const handleTrackClick = useCallback(async (deal) => {
    try {
      await updateDealClickMutation.mutateAsync(deal.id);
      window.open(deal.affiliate_link, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error tracking deal click:", error);
      window.open(deal.affiliate_link, "_blank", "noopener,noreferrer");
    }
  }, [updateDealClickMutation]);
  const handleRatingSubmitted = useCallback(() => {
    setShowRatingModal(false);
    setSelectedDeal(null);
  }, []);
  const handleRetry = useCallback(() => {
    paginatedQuery.refetch();
    categoriesQuery.refetch();
  }, [paginatedQuery, categoriesQuery]);
  if (categoriesQuery.error) {
    return /* @__PURE__ */ jsx(
      ErrorStateComponent,
      {
        isDashboard: isDashboardContext,
        icon: Icons.database,
        title: "Categories Not Available",
        description: "Categories table not found. Please run the SQL script to create the categories table.",
        actionLabel: "Retry Connection",
        onAction: handleRetry,
        colorScheme: "danger"
      }
    );
  }
  const isLoading = !isFullyReady || paginatedQuery.isLoading || categoriesQuery.isLoading;
  if (isLoading) {
    return /* @__PURE__ */ jsxs(PageWrapper, { isDashboard: isDashboardContext, children: [
      /* @__PURE__ */ jsx(
        HeaderSection,
        {
          companiesCount: companies.length,
          categoriesCount: categories.length - 1,
          isDashboard: isDashboardContext,
          isLoading: true
        }
      ),
      /* @__PURE__ */ jsx(DealsSkeleton, {})
    ] });
  }
  if (paginatedQuery.error) {
    return /* @__PURE__ */ jsx(
      ErrorStateComponent,
      {
        isDashboard: isDashboardContext,
        icon: Icons.warning,
        title: "Unable to Load Deals",
        description: paginatedQuery.error instanceof Error ? paginatedQuery.error.message : "Failed to load deals",
        actionLabel: "Try Again",
        onAction: handleRetry,
        colorScheme: "warning"
      }
    );
  }
  if (!categories.length) {
    return /* @__PURE__ */ jsx(
      ErrorStateComponent,
      {
        isDashboard: isDashboardContext,
        icon: Icons.database,
        title: "No Categories Found",
        description: "The categories table exists but contains no data. Please add categories to the database.",
        actionLabel: "Reload Categories",
        onAction: handleRetry,
        colorScheme: "default"
      }
    );
  }
  const dynamicSEO = {
    ...seoData.deals,
    structuredData: generateDealsStructuredData(dealsWithUserRatings),
    description: `Browse ${dealsWithUserRatings.length} curated trading deals and exclusive bonuses from top platforms. ${categories.length - 1} categories available with real ratings and reviews.`
  };
  const mainContent = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SEO, { ...dynamicSEO }),
    /* @__PURE__ */ jsxs(PageWrapper, { isDashboard: isDashboardContext, children: [
      /* @__PURE__ */ jsx(
        HeaderSection,
        {
          companiesCount: companies.length,
          categoriesCount: categories.length - 1,
          isDashboard: isDashboardContext
        }
      ),
      /* @__PURE__ */ jsx(
        FiltersSection,
        {
          filters,
          categories,
          categoryStats,
          onFilterChange: handleFilterChange
        }
      ),
      selectedCategoryInfo && /* @__PURE__ */ jsx(CategoryInfoSection, { categoryInfo: selectedCategoryInfo }),
      dealsWithUserRatings.length === 0 && !paginatedQuery.isLoading && /* @__PURE__ */ jsx(
        NoResultsSection,
        {
          searchTerm: filters.searchTerm,
          selectedCategory: filters.category,
          onClearFilters: () => {
            setFilters({ searchTerm: "", category: "all", sortBy: "rating" });
            setCurrentPage(1);
          }
        }
      ),
      !isDashboardContext && /* @__PURE__ */ jsx("div", { className: "my-4xl", children: /* @__PURE__ */ jsx(AdUnit, {}) }),
      dealsWithUserRatings.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl my-4xl animate-fade-in-up", children: dealsWithUserRatings.map((deal, index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "animate-scale-in",
          style: { animationDelay: `${index * 100}ms` },
          children: /* @__PURE__ */ jsx(
            UnifiedDealCard,
            {
              deal,
              onRateClick: handleRateClick,
              onTrackClick: handleTrackClick,
              isGuest: !user,
              showRatingButton: !!user
            }
          )
        },
        deal.id
      )) }),
      totalPages > 1 && /* @__PURE__ */ jsx(
        PaginationSection,
        {
          currentPage,
          totalPages,
          hasNextPage,
          hasPrevPage,
          onPageChange: handlePageChange
        }
      ),
      dealsWithUserRatings.length > 0 && /* @__PURE__ */ jsxs("div", { className: "text-center text-foreground/70 text-sm mb-2xl", children: [
        "Showing ",
        (currentPage - 1) * pageLimit + 1,
        " to ",
        Math.min(currentPage * pageLimit, totalCount),
        " of ",
        totalCount,
        " deals"
      ] }),
      /* @__PURE__ */ jsx(
        FooterSection,
        {
          companiesCount: companies.length,
          categories,
          categoryStats,
          totalCount
        }
      ),
      showRatingModal && selectedDeal && user && /* @__PURE__ */ jsx(
        RatingModal,
        {
          isOpen: showRatingModal,
          onClose: () => {
            setShowRatingModal(false);
            setSelectedDeal(null);
          },
          companyId: selectedDeal.company.id,
          companyName: selectedDeal.company.name,
          existingRating: selectedDeal.userRating,
          onRatingSubmitted: handleRatingSubmitted,
          companyRating: {
            averageRating: ((_d = selectedDeal.company) == null ? void 0 : _d.overall_rating) || 0,
            totalRatings: ((_e = selectedDeal.company) == null ? void 0 : _e.total_reviews) || 0
          }
        }
      ),
      showAuthModal && !user && /* @__PURE__ */ jsx(
        AuthModal,
        {
          isOpen: showAuthModal,
          onClose: () => setShowAuthModal(false),
          mode: authMode,
          onModeChange: setAuthMode
        }
      )
    ] })
  ] });
  return isDashboardContext ? mainContent : /* @__PURE__ */ jsx(GuestLayout, { hideFooter: true, children: mainContent });
};
const PageWrapper = ({
  isDashboard,
  children
}) => /* @__PURE__ */ jsx("div", { className: `min-h-screen ${isDashboard ? "" : "background-enhanced"}`, children: /* @__PURE__ */ jsx("div", { className: isDashboard ? "container-p-sm md:container-p-md lg:container-p-lg" : "container-page section-px-lg section-py-xl", children }) });
const HeaderSection = ({ companiesCount, categoriesCount, isDashboard, isLoading = false }) => /* @__PURE__ */ jsx("div", { className: "text-center mb-6xl animate-fade-in-up", children: /* @__PURE__ */ jsxs("div", { className: "glass-enhanced rounded-3xl container-p-2xl border border-divider/30 shadow-enhanced-lg", children: [
  /* @__PURE__ */ jsx("h1", { className: "text-4xl lg:text-5xl font-bold text-foreground mb-3xl", children: /* @__PURE__ */ jsx("span", { className: "gradient-text-animated", children: isDashboard ? "Browse Trading Platforms" : "Trading Deals & Exclusive Bonuses" }) }),
  /* @__PURE__ */ jsx("p", { className: "text-xl text-foreground/70 mb-xl text-center", children: isLoading ? "Loading exclusive offers with real-time ratings..." : `Curated offers from top platforms across ${categoriesCount} categories` }),
  !isLoading && /* @__PURE__ */ jsxs("p", { className: "text-foreground/70", children: [
    companiesCount,
    " vetted platforms • Real community ratings • Updated daily"
  ] })
] }) });
const FiltersSection = ({ filters, categories, categoryStats, onFilterChange }) => /* @__PURE__ */ jsx("div", { className: "glass-enhanced rounded-2xl border border-divider/40 mb-2xl shadow-enhanced backdrop-blur-strong animate-slide-in-left", children: /* @__PURE__ */ jsxs("div", { className: "container-p-3xl", children: [
  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-lg mb-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Icons.search, { className: "absolute text-foreground/60 w-5 h-5 z-10", style: { left: "var(--heroui-padding-lg)", top: "50%", transform: "translateY(-50%)" } }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Search deals, companies...",
          value: filters.searchTerm,
          onChange: (e) => onFilterChange("searchTerm", e.target.value),
          className: "w-full py-3 bg-content1 border border-divider/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none text-foreground text-base font-medium backdrop-blur-sm transition-all duration-300 hover:border-divider/70 hover:bg-content2 placeholder:text-foreground/60 h-12 focus-enhanced shadow-sm",
          style: { paddingLeft: "var(--heroui-padding-3xl)", paddingRight: "var(--heroui-padding-md)" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Icons.filter, { className: "absolute text-foreground/60 w-5 h-5 z-10", style: { left: "var(--heroui-padding-lg)", top: "50%", transform: "translateY(-50%)" } }),
      /* @__PURE__ */ jsx(
        "select",
        {
          value: filters.category,
          onChange: (e) => onFilterChange("category", e.target.value),
          className: "w-full py-3 bg-content1 border border-divider/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none text-foreground backdrop-blur-sm transition-all duration-300 hover:border-divider/70 hover:bg-content2 h-12 appearance-none focus-enhanced shadow-sm",
          style: { paddingLeft: "var(--heroui-padding-3xl)", paddingRight: "var(--heroui-padding-2xl)" },
          children: categories.map((category) => /* @__PURE__ */ jsxs("option", { value: category.value, children: [
            category.label,
            " ",
            category.value !== "all" && `(${categoryStats.get(category.value) || 0})`
          ] }, category.value))
        }
      ),
      /* @__PURE__ */ jsx(Icons.chevronDown, { className: "absolute text-foreground/60 w-4 h-4 pointer-events-none", style: { right: "var(--heroui-padding-sm)", top: "50%", transform: "translateY(-50%)" } })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: filters.sortBy,
          onChange: (e) => onFilterChange("sortBy", e.target.value),
          className: "w-full py-3 bg-content1 border border-divider/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none text-foreground backdrop-blur-sm transition-all duration-300 hover:border-divider/70 hover:bg-content2 h-12 appearance-none focus-enhanced shadow-sm",
          style: { paddingLeft: "var(--heroui-padding-md)", paddingRight: "var(--heroui-padding-2xl)" },
          children: [
            /* @__PURE__ */ jsx("option", { value: "rating", children: "Highest Rated" }),
            /* @__PURE__ */ jsx("option", { value: "newest", children: "Newest First" }),
            /* @__PURE__ */ jsx("option", { value: "popular", children: "Most Claimed" }),
            /* @__PURE__ */ jsx("option", { value: "name", children: "Company A-Z" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(Icons.chevronDown, { className: "absolute text-foreground/60 w-4 h-4 pointer-events-none", style: { right: "var(--heroui-padding-sm)", top: "50%", transform: "translateY(-50%)" } })
    ] })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-lg py-xl", children: categories.map((category, index) => {
    const count = categoryStats.get(category.value) || 0;
    const isActive = filters.category === category.value;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onFilterChange("category", category.value),
        className: `relative overflow-hidden gap-md flex items-center px-lg py-md text-sm font-medium transition-all duration-300 rounded-full animate-scale-in ${isActive ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-enhanced animate-glow-pulse" : "bg-content2/50 text-foreground/80 border border-divider/50 hover:border-primary/30 hover:bg-content2/70"}`,
        style: { animationDelay: `${index * 50}ms` },
        children: [
          /* @__PURE__ */ jsx("span", { className: "relative z-10", children: category.label }),
          category.value !== "all" && /* @__PURE__ */ jsx("span", { className: `relative z-10 text-xs font-bold px-sm py-xs rounded-full transition-all duration-300 ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-foreground/10 text-foreground/70"}`, children: count }),
          isActive && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-white/5 to-transparent animate-shimmer" })
        ]
      },
      category.value
    );
  }) })
] }) });
const CategoryInfoSection = ({ categoryInfo }) => /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-primary/15 via-primary/8 to-secondary/15 rounded-xl container-p-lg mb-xl border border-primary/30 shadow-enhanced backdrop-blur-sm animate-slide-in-bottom", children: [
  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground mb-md", children: categoryInfo.title }),
  /* @__PURE__ */ jsx("p", { className: "text-foreground/70 mb-lg", children: categoryInfo.description }),
  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-md", children: [
    categoryInfo.companies.slice(0, 8).map((company, index) => /* @__PURE__ */ jsx(
      "span",
      {
        className: "bg-primary/20 text-primary container-px-md container-py-sm rounded-lg text-sm border border-primary/30 animate-scale-in",
        style: { animationDelay: `${index * 100}ms` },
        children: company
      },
      company
    )),
    categoryInfo.companies.length > 8 && /* @__PURE__ */ jsxs("span", { className: "text-foreground/70 text-sm animate-fade-in", children: [
      "+",
      categoryInfo.companies.length - 8,
      " more"
    ] })
  ] })
] });
const NoResultsSection = ({ searchTerm, selectedCategory, onClearFilters }) => /* @__PURE__ */ jsxs("div", { className: "text-center py-4xl animate-fade-in-up", children: [
  /* @__PURE__ */ jsx(Icons.gift, { className: "w-16 h-16 text-foreground/40 mx-auto mb-xl animate-float" }),
  /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-foreground mb-md", children: "No deals found" }),
  /* @__PURE__ */ jsx("p", { className: "text-foreground/70 mb-2xl", children: searchTerm || selectedCategory !== "all" ? "Try adjusting your search or filter criteria" : "No deals are currently available. Check back soon!" }),
  /* @__PURE__ */ jsx(
    "button",
    {
      onClick: onClearFilters,
      className: "btn-enhanced bg-primary text-primary-foreground px-xl py-md rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium hover:scale-105",
      children: "Clear Filters"
    }
  )
] });
const PaginationSection = ({ currentPage, totalPages, hasNextPage, hasPrevPage, onPageChange }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-xl my-4xl animate-fade-in-up", children: [
  /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => onPageChange(currentPage - 1),
      disabled: !hasPrevPage,
      className: "inline-flex items-center gap-sm bg-content2/50 text-foreground px-xl py-md rounded-lg hover:bg-content2/70 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed card-hover-enhanced focus-enhanced",
      children: [
        /* @__PURE__ */ jsx(Icons.chevronLeft, { className: "w-4 h-4" }),
        "Previous"
      ]
    }
  ),
  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-xl", children: [
    Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      const pageNum = i + 1;
      const isActive = pageNum === currentPage;
      return /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onPageChange(pageNum),
          className: `w-10 h-10 rounded-lg font-medium transition-all duration-300 card-hover-enhanced focus-enhanced ${isActive ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-enhanced" : "bg-content2/50 text-foreground hover:bg-content2/70"}`,
          children: pageNum
        },
        pageNum
      );
    }),
    totalPages > 5 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("span", { className: "text-foreground/50", children: "..." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onPageChange(totalPages),
          className: "w-10 h-10 bg-content2/50 text-foreground rounded-lg hover:bg-content2/70 transition-all duration-300 font-medium card-hover-enhanced focus-enhanced",
          children: totalPages
        }
      )
    ] })
  ] }),
  /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => onPageChange(currentPage + 1),
      disabled: !hasNextPage,
      className: "inline-flex items-center gap-sm bg-content2/50 text-foreground px-xl py-md rounded-lg hover:bg-content2/70 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed card-hover-enhanced focus-enhanced",
      children: [
        "Next",
        /* @__PURE__ */ jsx(Icons.chevronRight, { className: "w-4 h-4" })
      ]
    }
  )
] });
const FooterSection = ({ companiesCount, categories, categoryStats }) => /* @__PURE__ */ jsxs("div", { className: "glass-enhanced rounded-2xl container-p-2xl text-center shadow-enhanced-lg border border-divider/30 animate-fade-in-up background-enhanced", children: [
  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-md my-xl", children: [
    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-enhanced animate-float", children: /* @__PURE__ */ jsx(Icons.users, { className: "w-6 h-6 text-white" }) }),
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-foreground", children: "Curated Trading Platforms" })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center", children: /* @__PURE__ */ jsxs("p", { className: "text-foreground/70 max-w-3xl mx-auto my-2xl text-center text-lg leading-relaxed", children: [
    companiesCount,
    " handpicked platforms across ",
    categories.filter((cat) => cat.value !== "all" && (categoryStats.get(cat.value) || 0) > 0).length,
    " categories. Every company is verified, regulated, and trusted by our trading community."
  ] }) }),
  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-lg text-sm text-foreground/70", children: [
    categories.filter((cat) => cat.value !== "all").filter((cat) => (categoryStats.get(cat.value) || 0) > 0).slice(0, 3).map((category, index) => {
      const count = categoryStats.get(category.value) || 0;
      return /* @__PURE__ */ jsxs(
        "span",
        {
          className: "flex items-center gap-xs bg-content2/50 px-3 py-2 rounded-full border border-divider/30 animate-scale-in",
          style: { animationDelay: `${index * 200}ms` },
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-success", children: "✓" }),
            /* @__PURE__ */ jsxs("span", { children: [
              count,
              " ",
              category.label
            ] })
          ]
        },
        category.value
      );
    }),
    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-xs bg-content2/50 px-3 py-2 rounded-full border border-divider/30 animate-scale-in", style: { animationDelay: "600ms" }, children: [
      /* @__PURE__ */ jsx("span", { className: "text-success", children: "✓" }),
      /* @__PURE__ */ jsx("span", { children: "Real Reviews" })
    ] })
  ] })
] });
const ErrorStateComponent = ({ isDashboard, icon: Icon, title, description, actionLabel, onAction, colorScheme }) => /* @__PURE__ */ jsx(PageWrapper, { isDashboard, children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-96", children: /* @__PURE__ */ jsxs("div", { className: "text-center animate-fade-in-up", children: [
  /* @__PURE__ */ jsx(Icon, { className: `w-12 h-12 mx-auto mb-xl ${colorScheme === "danger" ? "text-danger" : colorScheme === "warning" ? "text-warning" : "text-foreground/40"}` }),
  /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-foreground mb-md", children: title }),
  /* @__PURE__ */ jsx("p", { className: "text-foreground/70 mb-2xl max-w-md mx-auto", children: description }),
  /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: onAction,
      className: `btn-enhanced inline-flex items-center gap-sm px-xl py-md rounded-lg transition-all duration-300 font-medium hover:scale-105 focus-enhanced ${colorScheme === "danger" ? "bg-danger text-danger-foreground hover:bg-danger/90" : colorScheme === "warning" ? "bg-warning text-warning-foreground hover:bg-warning/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}`,
      children: [
        /* @__PURE__ */ jsx(Icons.refresh, { className: "w-4 h-4" }),
        actionLabel
      ]
    }
  )
] }) }) });
export {
  Deals as default
};
