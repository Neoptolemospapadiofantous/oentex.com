import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { u as useAuth, s as supabase, I as Icons } from "../entry-server.js";
import { useQuery } from "@tanstack/react-query";
import { R as RatingModal } from "./RatingModal-D0MNzkGa.js";
import "react-dom/server";
import "react-router-dom/server.mjs";
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
import "./useDealsQuery-CZaqgNr5.js";
const StatCardSkeleton = () => /* @__PURE__ */ jsx("div", { className: "bg-content1/60 backdrop-blur-xl rounded-3xl container-p-lg border border-divider/30 animate-pulse", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-md", children: [
  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-content2 rounded-2xl" }),
    /* @__PURE__ */ jsx("div", { className: "w-16 h-6 bg-content2 rounded-lg" })
  ] }),
  /* @__PURE__ */ jsxs("div", { className: "space-y-sm", children: [
    /* @__PURE__ */ jsx("div", { className: "w-20 h-8 bg-content2 rounded-lg" }),
    /* @__PURE__ */ jsx("div", { className: "w-32 h-4 bg-content2 rounded-md" })
  ] })
] }) }) });
const RatingCardSkeleton = () => /* @__PURE__ */ jsx("div", { className: "bg-content1/60 backdrop-blur-xl rounded-3xl container-p-lg border border-divider/30 animate-pulse", children: /* @__PURE__ */ jsxs("div", { className: "space-y-md", children: [
  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-md", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-content2 rounded-2xl" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "w-32 h-5 bg-content2 rounded-md" }),
        /* @__PURE__ */ jsx("div", { className: "w-24 h-4 bg-content2 rounded-md" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-16 h-8 bg-content2 rounded-lg" })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "w-full h-16 bg-content2 rounded-lg" }),
  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsx("div", { className: "w-24 h-4 bg-content2 rounded-md" }),
    /* @__PURE__ */ jsx("div", { className: "w-20 h-8 bg-content2 rounded-lg" })
  ] })
] }) });
function averageFromCategories(r) {
  const nums = [
    r.platform_usability,
    r.customer_support,
    r.fees_commissions,
    r.security_trust,
    r.educational_resources,
    r.mobile_app
  ].filter((n) => typeof n === "number" && n > 0);
  if (!nums.length) return 0;
  return Math.round(nums.reduce((s, n) => s + n, 0) / nums.length * 10) / 10;
}
const MyDeals = () => {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [activeCompanyName, setActiveCompanyName] = useState("");
  const [existingRating, setExistingRating] = useState(null);
  const [activeCompanyStats, setActiveCompanyStats] = useState(void 0);
  const {
    data: myRatings = [],
    isLoading: ratingsLoading,
    error: ratingsError,
    refetch: refetchRatings
  } = useQuery({
    queryKey: ["my-ratings", user == null ? void 0 : user.id],
    enabled: !!(user == null ? void 0 : user.id),
    queryFn: async () => {
      const { data, error } = await supabase.from("ratings").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((r) => ({
        ...r,
        rating: r.overall_rating && r.overall_rating > 0 ? r.overall_rating : averageFromCategories(r)
      }));
    }
  });
  const companyIds = useMemo(
    () => Array.from(new Set(myRatings.map((r) => r.company_id))),
    [myRatings]
  );
  const {
    data: companies = [],
    isLoading: companiesLoading,
    error: companiesError,
    refetch: refetchCompanies
  } = useQuery({
    queryKey: ["my-rated-companies", companyIds.sort().join(",")],
    enabled: companyIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase.from("trading_companies").select("id, name, slug, logo_url, category, overall_rating, total_reviews").in("id", companyIds);
      if (error) throw error;
      return data || [];
    }
  });
  const ratingsArray = useMemo(() => {
    const byId = new Map(companies.map((c) => [c.id, c]));
    return myRatings.map((r) => {
      const company = byId.get(r.company_id);
      return {
        ...r,
        company,
        company_name: (company == null ? void 0 : company.name) || "Unknown Company"
      };
    });
  }, [myRatings, companies]);
  const filteredAndSortedRatings = useMemo(() => {
    let filtered = ratingsArray;
    if (filterRating !== "all") {
      filtered = filtered.filter((r) => Number(r.rating) === Number(filterRating));
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "company":
          return (a.company_name || "").localeCompare(b.company_name || "");
        default:
          return 0;
      }
    });
    return filtered;
  }, [ratingsArray, sortBy, filterRating]);
  const openEditModal = (r) => {
    const company = companies.find((c) => c.id === r.company_id);
    setActiveCompanyId(r.company_id);
    setActiveCompanyName((company == null ? void 0 : company.name) || "Unknown Company");
    setExistingRating(r);
    setActiveCompanyStats(
      company ? {
        averageRating: company.overall_rating || 0,
        totalRatings: company.total_reviews || 0
      } : void 0
    );
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setActiveCompanyId(null);
    setExistingRating(null);
  };
  const handleRatingSubmitted = () => {
    refetchRatings();
    refetchCompanies();
  };
  const handleRetry = () => {
    refetchRatings();
    refetchCompanies();
  };
  if (ratingsLoading || companiesLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen", children: /* @__PURE__ */ jsxs("div", { className: "container-page section-py-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-2xl", children: [
        /* @__PURE__ */ jsx("div", { className: "w-48 h-8 bg-content2 rounded-lg mx-auto mb-lg animate-pulse" }),
        /* @__PURE__ */ jsx("div", { className: "w-64 h-6 bg-content2 rounded-lg mx-auto animate-pulse" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-lg mb-2xl", children: [...Array(3)].map((_, index) => /* @__PURE__ */ jsx(StatCardSkeleton, {}, index)) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-md", children: [...Array(4)].map((_, index) => /* @__PURE__ */ jsx(RatingCardSkeleton, {}, index)) })
    ] }) });
  }
  if (ratingsError || companiesError) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen", children: /* @__PURE__ */ jsx("div", { className: "container-page section-py-xl", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-96", children: /* @__PURE__ */ jsxs("div", { className: "text-center animate-fade-in-up", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-danger to-danger/80 rounded-3xl flex items-center justify-center mb-2xl shadow-2xl shadow-danger/20", children: /* @__PURE__ */ jsx(Icons.warning, { className: "w-10 h-10 text-danger-foreground" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold gradient-text mb-lg", children: "Failed to load your ratings" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-foreground/70 mb-2xl max-w-lg mx-auto", children: "There was an error loading your ratings data. Please try refreshing the page." }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleRetry,
          className: "px-2xl py-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25",
          children: [
            /* @__PURE__ */ jsx(Icons.refresh, { className: "w-5 h-5 mr-sm inline" }),
            "Try Again"
          ]
        }
      )
    ] }) }) }) });
  }
  const totalRatings = ratingsArray.length;
  const averageRating = totalRatings > 0 ? (ratingsArray.reduce((sum, r) => sum + (r.rating || 0), 0) / totalRatings).toFixed(1) : "0.0";
  const lastUpdated = totalRatings > 0 ? new Date(Math.max(...ratingsArray.map((r) => new Date(r.updated_at).getTime()))).toLocaleDateString() : "Never";
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen", children: /* @__PURE__ */ jsxs("div", { className: "container-page section-py-xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-2xl", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold gradient-text mb-lg", children: "My Platform Ratings" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-foreground/70 mb-sm", children: "Manage and review your platform ratings and reviews" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60", children: "Track your trading platform experiences and share feedback with the community" })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "mb-2xl", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "group relative overflow-hidden bg-content1/60 backdrop-blur-xl rounded-3xl container-p-lg border border-divider/30 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-[1.02]", children: /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3", children: /* @__PURE__ */ jsx(Icons.star, { className: "w-7 h-7 text-primary-foreground" }) }) }),
          /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold px-sm py-xs rounded-lg bg-primary/20 text-primary border border-primary/30", children: "Platforms rated" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-4xl font-bold text-primary group-hover:text-primary transition-colors duration-300 tracking-tight", children: totalRatings }),
          /* @__PURE__ */ jsx("p", { className: "text-base font-semibold text-foreground group-hover:text-foreground transition-colors duration-300", children: "Total Ratings" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60 leading-relaxed", children: "Platforms you've reviewed" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "group relative overflow-hidden bg-content1/60 backdrop-blur-xl rounded-3xl container-p-lg border border-divider/30 hover:border-success/30 transition-all duration-500 hover:shadow-2xl hover:shadow-success/10 transform hover:scale-[1.02]", children: /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-gradient-to-br from-success to-success/80 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3", children: /* @__PURE__ */ jsx(Icons.arrowTrendingUp, { className: "w-7 h-7 text-success-foreground" }) }) }),
          /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold px-sm py-xs rounded-lg bg-success/20 text-success border border-success/30", children: "Your average" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-4xl font-bold text-success group-hover:text-success transition-colors duration-300 tracking-tight", children: averageRating }),
          /* @__PURE__ */ jsx("p", { className: "text-base font-semibold text-foreground group-hover:text-foreground transition-colors duration-300", children: "Average Rating" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60 leading-relaxed", children: "Your satisfaction score" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "group relative overflow-hidden bg-content1/60 backdrop-blur-xl rounded-3xl container-p-lg border border-divider/30 hover:border-warning/30 transition-all duration-500 hover:shadow-2xl hover:shadow-warning/10 transform hover:scale-[1.02]", children: /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-gradient-to-br from-warning to-warning/80 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3", children: /* @__PURE__ */ jsx(Icons.calendar, { className: "w-7 h-7 text-warning-foreground" }) }) }),
          /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold px-sm py-xs rounded-lg bg-warning/20 text-warning border border-warning/30", children: "Most recent" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-warning group-hover:text-warning transition-colors duration-300 tracking-tight", children: lastUpdated }),
          /* @__PURE__ */ jsx("p", { className: "text-base font-semibold text-foreground group-hover:text-foreground transition-colors duration-300", children: "Last Updated" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60 leading-relaxed", children: "Latest rating activity" })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "mb-xl", children: /* @__PURE__ */ jsxs("div", { className: "bg-content1/90 backdrop-blur-2xl rounded-3xl border border-divider/50 container-p-lg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-md mb-lg", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center", children: /* @__PURE__ */ jsx(Icons.filter, { className: "w-4 h-4 text-white" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-foreground", children: "Filter & Sort" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-lg", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-sm", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-sm", children: "Filter by Rating" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filterRating,
              onChange: (e) => setFilterRating(e.target.value === "all" ? "all" : Number(e.target.value)),
              className: "w-full container-px-lg container-py-md border border-divider/50 rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-foreground bg-content1 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-content2 hover:shadow-lg hover:shadow-primary/10",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Ratings" }),
                /* @__PURE__ */ jsx("option", { value: 5, children: "5 Stars ⭐⭐⭐⭐⭐" }),
                /* @__PURE__ */ jsx("option", { value: 4, children: "4 Stars ⭐⭐⭐⭐" }),
                /* @__PURE__ */ jsx("option", { value: 3, children: "3 Stars ⭐⭐⭐" }),
                /* @__PURE__ */ jsx("option", { value: 2, children: "2 Stars ⭐⭐" }),
                /* @__PURE__ */ jsx("option", { value: 1, children: "1 Star ⭐" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-sm", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-sm", children: "Sort By" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: sortBy,
              onChange: (e) => setSortBy(e.target.value),
              className: "w-full container-px-lg container-py-md border border-divider/50 rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-foreground bg-content1 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-content2 hover:shadow-lg hover:shadow-primary/10",
              children: [
                /* @__PURE__ */ jsx("option", { value: "newest", children: "Newest First" }),
                /* @__PURE__ */ jsx("option", { value: "oldest", children: "Oldest First" }),
                /* @__PURE__ */ jsx("option", { value: "rating", children: "Highest Rating" }),
                /* @__PURE__ */ jsx("option", { value: "company", children: "Company A-Z" })
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { children: filteredAndSortedRatings.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-md", children: filteredAndSortedRatings.map((rating, index) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "group bg-content1/90 backdrop-blur-2xl rounded-3xl border border-divider/50 container-p-lg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:border-primary/30 transform hover:scale-[1.01]",
        style: { animationDelay: `${index * 100}ms` },
        children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-md mb-lg", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center", children: /* @__PURE__ */ jsx(Icons.star, { className: "w-6 h-6 text-primary" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300", children: rating.company_name }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-md", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-xs", children: [
                [...Array(5)].map((_, i) => {
                  const filled = Math.round(rating.rating || 0);
                  return /* @__PURE__ */ jsx(
                    Icons.star,
                    {
                      className: `w-4 h-4 ${i < filled ? "text-warning fill-current" : "text-foreground/300"}`
                    },
                    i
                  );
                }),
                /* @__PURE__ */ jsxs("span", { className: "ml-sm text-sm font-semibold text-foreground/80", children: [
                  (rating.rating || 0).toFixed(1),
                  "/5"
                ] })
              ] }) })
            ] })
          ] }),
          rating.review && /* @__PURE__ */ jsx("div", { className: "bg-content2/50 rounded-2xl container-p-lg mb-lg border border-divider/30", children: /* @__PURE__ */ jsxs("p", { className: "text-foreground/80 leading-relaxed italic", children: [
            '"',
            rating.review,
            '"'
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-lg text-sm text-foreground/60 mb-lg", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-xs", children: [
              /* @__PURE__ */ jsx(Icons.calendar, { className: "w-4 h-4" }),
              "Rated on ",
              new Date(rating.created_at).toLocaleDateString()
            ] }),
            rating.updated_at !== rating.created_at && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-xs", children: [
              /* @__PURE__ */ jsx(Icons.refresh, { className: "w-4 h-4" }),
              "Updated on ",
              new Date(rating.updated_at).toLocaleDateString()
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => openEditModal(rating),
              className: "flex items-center gap-sm px-xl py-md bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25",
              children: [
                /* @__PURE__ */ jsx(Icons.edit, { className: "w-4 h-4" }),
                "Edit Rating"
              ]
            }
          )
        ] }) })
      },
      rating.id
    )) }) : (
      /* Enhanced Empty State */
      /* @__PURE__ */ jsxs("div", { className: "text-center py-4xl", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mb-2xl mx-auto shadow-2xl shadow-primary/20", children: /* @__PURE__ */ jsx(Icons.star, { className: "w-10 h-10 text-white" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold gradient-text mb-lg", children: filterRating !== "all" ? `No ${filterRating}-star ratings found` : "No ratings yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-foreground/70 mb-2xl max-w-lg mx-auto", children: filterRating !== "all" ? "Try adjusting your filter criteria or rate some platforms first." : "Start rating platforms to see them appear here and help the community." }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => window.location.href = "/deals",
            className: "px-2xl py-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25",
            children: [
              /* @__PURE__ */ jsx(Icons.search, { className: "w-5 h-5 mr-sm inline" }),
              "Browse Platforms"
            ]
          }
        )
      ] })
    ) }),
    isModalOpen && activeCompanyId && /* @__PURE__ */ jsx(
      RatingModal,
      {
        isOpen: isModalOpen,
        onClose: handleModalClose,
        companyId: activeCompanyId,
        companyName: activeCompanyName,
        existingRating,
        onRatingSubmitted: handleRatingSubmitted,
        companyRating: activeCompanyStats
      }
    )
  ] }) });
};
export {
  MyDeals as default
};
