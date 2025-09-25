import { useQuery } from "@tanstack/react-query";
import { I as Icons, s as supabase } from "../entry-server.js";
const ICON_MAP = {
  gift: Icons.gift,
  zap: Icons.bolt,
  building: Icons.building,
  star: Icons.star,
  trending_up: Icons.trendingUp,
  bar_chart: Icons.chart,
  shield: Icons.shield,
  smartphone: Icons.mobile
};
const DEFAULT_CATEGORIES = [
  {
    value: "crypto_exchange",
    label: "Crypto Exchanges",
    icon: Icons.building,
    description: "Cryptocurrency trading platforms"
  },
  {
    value: "prop_firm",
    label: "Prop Trading Firms",
    icon: Icons.trendingUp,
    description: "Proprietary trading companies"
  },
  {
    value: "multi_asset",
    label: "Multi-Asset Brokers",
    icon: Icons.chart,
    description: "Multi-asset trading platforms"
  },
  {
    value: "trading_tool",
    label: "Trading Tools",
    icon: Icons.bolt,
    description: "Trading software and tools"
  },
  {
    value: "stock_broker",
    label: "Stock Brokers",
    icon: Icons.shield,
    description: "Stock trading platforms"
  },
  {
    value: "forex_broker",
    label: "Forex Brokers",
    icon: Icons.mobile,
    description: "Foreign exchange trading platforms"
  }
];
const fetchCategories = async () => {
  console.log("Fetching categories from categories table...");
  try {
    const { data, error } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order", { ascending: true });
    if (error) {
      console.error("Categories Error:", error);
      return [];
    }
    if (!data || data.length === 0) {
      console.warn("No categories found in categories table, using defaults");
      return [];
    }
    console.log("Categories loaded from database:", data.length, "categories");
    return data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};
const useCategoriesQuery = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1e3,
    retry: (failureCount, error) => {
      var _a, _b, _c;
      console.log(`Categories query retry attempt ${failureCount + 1}`, error == null ? void 0 : error.message);
      if ((_a = error == null ? void 0 : error.message) == null ? void 0 : _a.includes('relation "categories" does not exist')) {
        console.log("Categories table not found - using fallback!");
        return false;
      }
      if (((_b = error == null ? void 0 : error.message) == null ? void 0 : _b.includes("permission")) || ((_c = error == null ? void 0 : error.message) == null ? void 0 : _c.includes("policy"))) {
        console.log("Categories permission error - using fallback!");
        return false;
      }
      return failureCount < 2;
    },
    select: (data) => {
      console.log("Processing categories...");
      const allCategory = {
        value: "all",
        label: "All Categories",
        icon: Icons.gift,
        description: "View all available deals and platforms"
      };
      let processedCategories = [];
      if (data && data.length > 0) {
        processedCategories = data.map((category) => ({
          value: category.value,
          label: category.label,
          icon: ICON_MAP[category.icon_name] || Icons.star,
          description: category.description
        }));
        console.log("Using database categories:", processedCategories.length);
      } else {
        processedCategories = DEFAULT_CATEGORIES;
        console.log("Using fallback categories:", processedCategories.length);
      }
      const finalCategories = [allCategory, ...processedCategories];
      console.log("Final categories:", finalCategories.length, "total");
      return finalCategories;
    }
  });
  return {
    ...query,
    data: query.data || [
      {
        value: "all",
        label: "All Categories",
        icon: Icons.gift,
        description: "View all available deals and platforms"
      },
      ...DEFAULT_CATEGORIES
    ],
    error: query.error,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching
  };
};
const useCategoryStatsQuery = (deals) => {
  return useQuery({
    queryKey: ["category-stats", (deals == null ? void 0 : deals.length) || 0],
    queryFn: () => {
      const stats = /* @__PURE__ */ new Map();
      const dealsArray = deals || [];
      stats.set("all", dealsArray.length);
      dealsArray.forEach((deal) => {
        var _a;
        const category = ((_a = deal.company) == null ? void 0 : _a.category) || deal.category;
        if (category) {
          stats.set(category, (stats.get(category) || 0) + 1);
        }
      });
      console.log("Category stats calculated:", Object.fromEntries(stats));
      return stats;
    },
    enabled: deals && deals.length > 0
  });
};
const useCategoryInfoQuery = (companies) => {
  return useQuery({
    queryKey: ["category-info", (companies == null ? void 0 : companies.length) || 0],
    queryFn: () => {
      const categoryInfo = /* @__PURE__ */ new Map();
      const companiesArray = companies || [];
      const categoryGroups = companiesArray.reduce((acc, company) => {
        const category = company.category;
        if (category) {
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(company.name);
        }
        return acc;
      }, {});
      Object.entries(categoryGroups).forEach(([category, companyNames]) => {
        categoryInfo.set(category, {
          companies: companyNames,
          count: companyNames.length
        });
      });
      console.log("Category info calculated:", Object.fromEntries(categoryInfo));
      return categoryInfo;
    },
    enabled: companies && companies.length > 0
  });
};
export {
  useCategoryStatsQuery as a,
  useCategoryInfoQuery as b,
  useCategoriesQuery as u
};
