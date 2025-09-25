import { jsx, jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { u as useAuth, I as Icons } from "../entry-server.js";
import { c as useDealsQuery } from "./useDealsQuery-CZaqgNr5.js";
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
const StatCardSkeleton = () => /* @__PURE__ */ jsx("div", { className: "bg-content1/60 backdrop-blur-xl rounded-3xl container-p-xl border border-divider/30 animate-pulse", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4", children: [
  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-content2 rounded-2xl" }),
    /* @__PURE__ */ jsx("div", { className: "w-16 h-6 bg-content2 rounded-lg" })
  ] }),
  /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx("div", { className: "w-20 h-8 bg-content2 rounded-lg" }),
    /* @__PURE__ */ jsx("div", { className: "w-32 h-4 bg-content2 rounded-md" }),
    /* @__PURE__ */ jsx("div", { className: "w-28 h-3 bg-content2 rounded-md" })
  ] })
] }) }) });
const Dashboard = () => {
  var _a, _b, _c, _d;
  const { user } = useAuth();
  const dealsQuery = useDealsQuery();
  const companies = ((_a = dealsQuery.data) == null ? void 0 : _a.companies) || [];
  const deals = ((_b = dealsQuery.data) == null ? void 0 : _b.deals) || [];
  const activePlatforms = companies.filter((c) => c.status === "active").length;
  const avgPlatformRating = companies.length > 0 ? (companies.reduce((sum, c) => sum + (c.overall_rating || 0), 0) / companies.length).toFixed(1) : "0.0";
  const totalDeals = deals.length;
  const activeDeals = deals.filter((d) => d.is_active).length;
  const enhancedCategoryStats = useMemo(() => {
    const stats2 = companies.reduce((acc, company) => {
      var _a2;
      const category = ((_a2 = company.category) == null ? void 0 : _a2.replace("_", " ")) || "Unknown";
      if (!acc[category]) {
        acc[category] = { count: 0, totalRating: 0 };
      }
      acc[category].count += 1;
      acc[category].totalRating += company.overall_rating || 0;
      return acc;
    }, {});
    return Object.entries(stats2).map(([category, data]) => ({
      category,
      count: data.count,
      avgRating: data.count > 0 ? data.totalRating / data.count : 0,
      percentage: Math.round(data.count / companies.length * 100)
    })).sort((a, b) => b.count - a.count);
  }, [companies]);
  const topCategories = enhancedCategoryStats.slice(0, 3);
  const stats = [
    {
      title: "Total Platforms",
      value: companies.length.toString(),
      change: `${activePlatforms} active`,
      icon: Icons.users,
      iconBg: "from-blue-500 to-indigo-600",
      description: "Trading platforms in database",
      color: "text-blue-600"
    },
    {
      title: "Active Platforms",
      value: activePlatforms.toString(),
      change: `${Math.round(activePlatforms / Math.max(companies.length, 1) * 100)}% active`,
      icon: Icons.users,
      iconBg: "from-emerald-500 to-green-600",
      description: "Currently operational",
      color: "text-emerald-600"
    },
    {
      title: "Total Deals",
      value: totalDeals.toString(),
      change: `${activeDeals} active`,
      icon: Icons.gift,
      iconBg: "from-purple-500 to-violet-600",
      description: "Available promotions",
      color: "text-purple-600"
    },
    {
      title: "Avg Rating",
      value: avgPlatformRating,
      change: "High quality",
      icon: Icons.star,
      iconBg: "from-amber-500 to-yellow-600",
      description: "Platform satisfaction",
      color: "text-amber-600"
    }
  ];
  if (dealsQuery.isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen", children: /* @__PURE__ */ jsxs("div", { className: "container-page section-py-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-2xl", children: [
        /* @__PURE__ */ jsx("div", { className: "w-64 h-8 bg-content2 rounded-lg mx-auto mb-lg animate-pulse" }),
        /* @__PURE__ */ jsx("div", { className: "w-48 h-6 bg-content2 rounded-lg mx-auto animate-pulse" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg lg:gap-xl mb-2xl", children: [...Array(4)].map((_, index) => /* @__PURE__ */ jsx(StatCardSkeleton, {}, index)) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-xl", children: [
        /* @__PURE__ */ jsx("div", { className: "xl:col-span-2 space-y-xl", children: /* @__PURE__ */ jsx("div", { className: "bg-content1/60 backdrop-blur-xl rounded-3xl container-p-2xl border border-divider/30", children: /* @__PURE__ */ jsxs("div", { className: "space-y-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "w-48 h-6 bg-content2 rounded-lg animate-pulse" }),
          /* @__PURE__ */ jsx("div", { className: "w-32 h-4 bg-content2 rounded-lg animate-pulse" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-md mt-xl", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "w-full h-16 bg-content2 rounded-2xl animate-pulse" }, i)) })
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-xl", children: /* @__PURE__ */ jsx("div", { className: "bg-content1/60 backdrop-blur-xl rounded-3xl container-p-xl border border-divider/30", children: /* @__PURE__ */ jsxs("div", { className: "space-y-lg", children: [
          /* @__PURE__ */ jsx("div", { className: "w-32 h-6 bg-content2 rounded-lg animate-pulse" }),
          /* @__PURE__ */ jsx("div", { className: "w-24 h-4 bg-content2 rounded-lg animate-pulse" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-md mt-lg", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "w-full h-12 bg-content2 rounded-xl animate-pulse" }, i)) })
        ] }) }) })
      ] })
    ] }) });
  }
  if (dealsQuery.isError) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen", children: /* @__PURE__ */ jsx("div", { className: "container-page section-py-xl", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-96", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mb-2xl shadow-2xl shadow-red-500/20", children: /* @__PURE__ */ jsx(Icons.warning, { className: "w-10 h-10 text-white" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold gradient-text mb-lg", children: "Failed to load dashboard" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-foreground/70 mb-2xl max-w-lg mx-auto", children: "There was an error loading your dashboard data. Please try refreshing the page." }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => dealsQuery.refetch(),
          className: "px-2xl py-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25",
          children: [
            /* @__PURE__ */ jsx(Icons.refresh, { className: "w-5 h-5 mr-sm inline" }),
            "Try Again"
          ]
        }
      )
    ] }) }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen", children: /* @__PURE__ */ jsxs("div", { className: "container-page section-py-xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-2xl", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold gradient-text mb-lg", children: "Trading Platform Dashboard" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-foreground/70 mb-sm", children: "Real-time insights and analytics" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-foreground/60", children: [
        "Welcome back, ",
        ((_c = user == null ? void 0 : user.user_metadata) == null ? void 0 : _c.full_name) || ((_d = user == null ? void 0 : user.email) == null ? void 0 : _d.split("@")[0]) || "User"
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "mb-2xl", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg lg:gap-xl", children: stats.map((stat) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "group relative overflow-hidden bg-content1/80 backdrop-blur-2xl rounded-3xl container-px-2xl container-py-lg border border-divider/40 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-[1.02]",
        children: /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-lg", children: [
            /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: `w-14 h-14 bg-gradient-to-br ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`, children: /* @__PURE__ */ jsx(stat.icon, { className: "w-7 h-7 text-white" }) }) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold container-px-sm container-py-xs rounded-lg bg-success/20 text-success border border-success/30", children: stat.change })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-sm", children: [
            /* @__PURE__ */ jsx("h3", { className: `text-4xl font-bold ${stat.color} group-hover:text-primary transition-colors duration-300 tracking-tight`, children: stat.value }),
            /* @__PURE__ */ jsx("p", { className: "text-base font-semibold text-foreground group-hover:text-foreground transition-colors duration-300", children: stat.title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60 leading-relaxed", children: stat.description })
          ] })
        ] })
      },
      stat.title
    )) }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "xl:col-span-2 space-y-2xl", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-content1/90 backdrop-blur-2xl rounded-3xl border border-divider/50 container-p-2xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden relative", children: /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2xl", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground mb-sm group-hover:text-primary transition-colors duration-300", children: "Platform Overview" }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground/60", children: "Trading platform statistics and metrics" })
            ] }),
            /* @__PURE__ */ jsx(Icons.database, { className: "w-8 h-8 text-primary/60 group-hover:text-primary transition-colors duration-300" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-lg mb-2xl", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center container-p-lg bg-content2/50 rounded-2xl backdrop-blur-sm border border-divider/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-primary mb-sm", children: companies.length }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-foreground/60 font-medium", children: "Total Platforms" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center container-p-lg bg-content2/50 rounded-2xl backdrop-blur-sm border border-divider/30 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-secondary mb-sm", children: totalDeals }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-foreground/60 font-medium", children: "Total Deals" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center container-p-lg bg-content2/50 rounded-2xl backdrop-blur-sm border border-divider/30 hover:border-warning/30 transition-all duration-300 hover:shadow-lg hover:shadow-warning/10", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-warning mb-sm", children: avgPlatformRating }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-foreground/60 font-medium", children: "Avg Rating" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-2xl", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-md", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-success rounded-full animate-pulse" }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-foreground/80", children: [
                activePlatforms,
                " Active Platforms"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("button", { className: "text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-sm transition-all duration-200 hover:gap-md", children: [
              "View All ",
              /* @__PURE__ */ jsx(Icons.arrowRight, { className: "w-4 h-4" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-content1/90 backdrop-blur-2xl my-2xl rounded-3xl border border-divider/50 container-p-2xl hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-500 group overflow-hidden relative", children: /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2xl", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground mb-sm group-hover:text-secondary transition-colors duration-300", children: "Category Distribution" }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground/60", children: "Platform categories and performance metrics" })
            ] }),
            /* @__PURE__ */ jsx(Icons.chart, { className: "w-8 h-8 text-secondary/60 group-hover:text-secondary transition-colors duration-300" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-lg", children: enhancedCategoryStats.map((category) => /* @__PURE__ */ jsxs("div", { className: "hover:bg-content2/30 rounded-2xl container-p-lg transition-all duration-300 hover:shadow-lg hover:shadow-secondary/5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground capitalize hover:text-secondary transition-colors duration-200", children: category.category }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-foreground/60", children: [
                  category.count,
                  " platforms • ",
                  category.avgRating.toFixed(1),
                  " avg rating"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-xl font-bold text-primary", children: [
                  category.percentage,
                  "%"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-foreground/50", children: "of total" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-content2/60 rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-1000 ease-out",
                style: { width: `${category.percentage}%` }
              }
            ) })
          ] }, category.category)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2xl", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-content1/90 backdrop-blur-2xl rounded-3xl border border-divider/50 container-p-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden relative", children: /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2xl", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-foreground mb-sm group-hover:text-primary transition-colors duration-300", children: "Top Categories" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60", children: "Most popular platform types" })
            ] }),
            /* @__PURE__ */ jsx(Icons.trophy, { className: "w-6 h-6 text-warning/60 group-hover:text-warning transition-colors duration-300" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-md", children: topCategories.map((category, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center justify-between container-p-md rounded-2xl bg-content2/30 hover:bg-content2/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-md", children: [
                  /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${index === 0 ? "bg-gradient-to-br from-warning/30 to-warning/20 text-warning" : index === 1 ? "bg-gradient-to-br from-default-300/30 to-default-300/20 text-default-600" : "bg-gradient-to-br from-default-200/30 to-default-200/20 text-default-500"}`, children: index + 1 }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground capitalize hover:text-primary transition-colors duration-200", children: category.category })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-sm font-semibold text-primary", children: [
                  category.count,
                  " platforms"
                ] })
              ]
            },
            category.category
          )) }),
          enhancedCategoryStats.length > 3 && /* @__PURE__ */ jsx("div", { className: "mt-lg pt-lg border-t border-divider/30", children: /* @__PURE__ */ jsx("button", { className: "w-full text-center text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200", children: "View All Categories" }) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-content1/90 backdrop-blur-2xl my-2xl rounded-3xl border border-divider/50 container-p-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden relative", children: /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-2xl", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-foreground mb-sm group-hover:text-secondary transition-colors duration-300", children: "Quick Actions" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/60", children: "Manage your dashboard" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-sm", children: [
            /* @__PURE__ */ jsxs("button", { className: "w-full flex items-center gap-md container-p-md bg-content2/30 hover:bg-primary/10 rounded-2xl transition-all duration-300 group/action hover:shadow-lg hover:shadow-primary/10", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-200", children: /* @__PURE__ */ jsx(Icons.add, { className: "w-5 h-5 text-primary" }) }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground group-hover/action:text-primary transition-colors duration-200", children: "Add New Platform" })
            ] }),
            /* @__PURE__ */ jsxs("button", { className: "w-full flex items-center gap-md container-p-md bg-content2/30 hover:bg-secondary/10 rounded-2xl transition-all duration-300 group/action hover:shadow-lg hover:shadow-secondary/10", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-200", children: /* @__PURE__ */ jsx(Icons.refresh, { className: "w-5 h-5 text-secondary" }) }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground group-hover/action:text-secondary transition-colors duration-200", children: "Refresh Data" })
            ] })
          ] })
        ] }) })
      ] })
    ] })
  ] }) });
};
export {
  Dashboard as default
};
