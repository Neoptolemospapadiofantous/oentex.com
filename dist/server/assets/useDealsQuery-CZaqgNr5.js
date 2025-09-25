import "react/jsx-runtime";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { s as supabase, u as useAuth, b as showSuccessToast, a as showErrorToast } from "../entry-server.js";
const RATING_CATEGORIES = [
  { key: "platform_usability", label: "Platform Usability", required: false },
  { key: "customer_support", label: "Customer Support", required: false },
  { key: "fees_commissions", label: "Fees & Commissions", required: false },
  { key: "security_trust", label: "Security & Trust", required: false },
  { key: "educational_resources", label: "Educational Resources", required: false },
  { key: "mobile_app", label: "Mobile App", required: false }
];
const ratingService = {
  // ✅ MODERN: Main atomic rating submission
  async submitRating(userId, companyId, ratings, existingRating) {
    try {
      console.log("🔄 Modern atomic rating submission starting...");
      console.log("📊 Rating data:", ratings);
      const { data, error } = await supabase.rpc("submit_rating_transaction", {
        p_user_id: userId,
        p_company_id: companyId,
        p_overall_rating: ratings.overall_rating || null,
        p_platform_usability: ratings.platform_usability || null,
        p_customer_support: ratings.customer_support || null,
        p_fees_commissions: ratings.fees_commissions || null,
        p_security_trust: ratings.security_trust || null,
        p_educational_resources: ratings.educational_resources || null,
        p_mobile_app: ratings.mobile_app || null,
        p_rating_type: ratings.overall_rating ? "overall" : "categories"
      });
      if (error) {
        console.error("❌ Atomic transaction failed:", error);
        throw error;
      }
      if (!data) {
        throw new Error("No data returned from atomic transaction");
      }
      console.log("✅ Modern atomic transaction completed:", data);
      return { data, error: null };
    } catch (error) {
      console.error("❌ Modern rating submission failed:", error);
      return { data: null, error };
    }
  },
  // ✅ MODERN: Get user's existing rating
  async getUserRating(userId, companyId) {
    try {
      console.log("📊 Fetching user rating...");
      const { data, error } = await supabase.from("ratings").select("*").eq("user_id", userId).eq("company_id", companyId).maybeSingle();
      if (error) {
        console.error("❌ Error fetching user rating:", error);
        return null;
      }
      if (!data) {
        return null;
      }
      let ratingType = "overall";
      if (data.overall_rating) {
        ratingType = "overall";
      } else if (data.platform_usability || data.customer_support || data.fees_commissions || data.security_trust || data.educational_resources || data.mobile_app) {
        ratingType = "categories";
      }
      return {
        ...data,
        rating_type: ratingType
      };
    } catch (error) {
      console.error("❌ Error in getUserRating:", error);
      return null;
    }
  },
  // ✅ MODERN: Batch company ratings for efficient loading
  async getMultipleCompanyRatings(companyIds) {
    try {
      if (companyIds.length === 0) return {};
      console.log("📊 Batch fetching ratings for", companyIds.length, "companies");
      const { data, error } = await supabase.from("trading_companies").select("id, overall_rating, total_reviews, name").in("id", companyIds);
      if (error) {
        console.error("❌ Error fetching batch ratings:", error);
        return {};
      }
      const ratingsByCompany = {};
      data == null ? void 0 : data.forEach((company) => {
        ratingsByCompany[company.id] = {
          averageRating: company.overall_rating || 0,
          totalRatings: company.total_reviews || 0
        };
        console.log(`📊 ${company.name}: ${company.overall_rating}⭐ (${company.total_reviews} reviews)`);
      });
      return ratingsByCompany;
    } catch (error) {
      console.error("❌ Error in getMultipleCompanyRatings:", error);
      return {};
    }
  },
  // ✅ MODERN: Single company rating
  async getCompanyAverageRating(companyId) {
    try {
      console.log("📊 Fetching company rating from database...");
      const { data, error } = await supabase.from("trading_companies").select("overall_rating, total_reviews, name").eq("id", companyId).single();
      if (error) {
        console.error("❌ Error fetching company rating:", error);
        return { averageRating: 0, totalRatings: 0 };
      }
      return {
        averageRating: data.overall_rating || 0,
        totalRatings: data.total_reviews || 0,
        name: data.name
      };
    } catch (error) {
      console.error("❌ Error in getCompanyAverageRating:", error);
      return { averageRating: 0, totalRatings: 0 };
    }
  },
  // ✅ MODERN: Company ratings breakdown
  async getCompanyRatings(companyId) {
    try {
      console.log("📊 Fetching detailed company ratings...");
      const { data, error } = await supabase.from("ratings").select(`
          overall_rating,
          platform_usability,
          customer_support,
          fees_commissions,
          security_trust,
          educational_resources,
          mobile_app,
          rating_type,
          created_at
        `).eq("company_id", companyId).order("created_at", { ascending: false });
      if (error) {
        console.error("❌ Error fetching company ratings breakdown:", error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error("❌ Error in getCompanyRatings:", error);
      throw error;
    }
  },
  // ✅ MODERN: Debug helper
  async debugRatingConsistency(companyId) {
    try {
      console.log("🔍 DEBUG: Checking rating consistency...");
      const { data: company } = await supabase.from("trading_companies").select("name, overall_rating, total_reviews").eq("id", companyId).single();
      const { data: ratings } = await supabase.from("ratings").select("overall_rating, platform_usability, customer_support, rating_type").eq("company_id", companyId);
      const debugInfo = {
        company_name: company == null ? void 0 : company.name,
        stored_rating: company == null ? void 0 : company.overall_rating,
        stored_reviews: company == null ? void 0 : company.total_reviews,
        actual_ratings_count: (ratings == null ? void 0 : ratings.length) || 0,
        ratings_sample: ratings == null ? void 0 : ratings.slice(0, 3)
      };
      console.log("🔍 DEBUG RESULTS:", debugInfo);
      return debugInfo;
    } catch (error) {
      console.error("❌ Debug check failed:", error);
      return null;
    }
  }
};
const useDealsQuery = () => {
  const { isFullyReady } = useAuth();
  return useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      try {
        console.log("🔄 Fetching deals and companies...");
        const { data: dealsData, error: dealsError } = await supabase.from("company_deals").select(`
            id,
            company_id,
            title,
            description,
            deal_type,
            value,
            terms,
            start_date,
            end_date,
            is_active,
            click_count,
            conversion_rate,
            affiliate_link,
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
        const { data: companiesData, error: companiesError } = await supabase.from("trading_companies").select(`
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
        if (!dealsData || !companiesData) {
          return {
            deals: [],
            companies: [],
            totalCount: 0,
            totalCompaniesCount: 0,
            totalDealsCount: 0
          };
        }
        const deals = dealsData.filter((deal) => deal.company && deal.company.status === "active").map((deal) => {
          var _a, _b, _c, _d;
          return {
            id: deal.id,
            company_id: deal.company_id,
            title: deal.title,
            description: deal.description,
            deal_type: deal.deal_type,
            value: deal.value,
            terms: deal.terms,
            start_date: deal.start_date || deal.created_at,
            end_date: deal.end_date,
            is_active: deal.is_active,
            click_count: deal.click_count || 0,
            conversion_rate: deal.conversion_rate || 0,
            affiliate_link: deal.affiliate_link,
            created_at: deal.created_at,
            updated_at: deal.updated_at,
            company: deal.company,
            // Compatibility fields for direct access
            company_name: ((_a = deal.company) == null ? void 0 : _a.name) || "",
            merchant_name: (_b = deal.company) == null ? void 0 : _b.name,
            category: (_c = deal.company) == null ? void 0 : _c.category,
            rating: (_d = deal.company) == null ? void 0 : _d.overall_rating,
            bonus_amount: deal.value,
            features: [],
            tracking_link: deal.affiliate_link
          };
        });
        const companies = companiesData.map((company) => ({
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
        console.log("✅ Deals and companies fetched successfully:", {
          dealsCount: deals.length,
          companiesCount: companies.length
        });
        return {
          deals,
          companies,
          totalCount: deals.length,
          totalCompaniesCount: companies.length,
          totalDealsCount: deals.length
        };
      } catch (error) {
        console.error("❌ Failed to fetch deals:", error);
        throw error;
      }
    },
    enabled: isFullyReady,
    staleTime: 5 * 60 * 1e3,
    // 5 minutes
    gcTime: 10 * 60 * 1e3,
    // 10 minutes
    retry: (failureCount, error) => {
      var _a, _b;
      if (((_a = error.message) == null ? void 0 : _a.includes("permission")) || ((_b = error.message) == null ? void 0 : _b.includes("policy"))) {
        return false;
      }
      return failureCount < 2;
    }
  });
};
const usePaginatedDealsQuery = (page = 1, limit = 12, filters = {}) => {
  const { isFullyReady } = useAuth();
  return useQuery({
    queryKey: ["paginated-deals", page, limit, filters],
    queryFn: async () => {
      try {
        console.log("🔄 Fetching paginated deals...", { page, limit, filters });
        const offset = (page - 1) * limit;
        try {
          return await fetchPaginatedDeals(page, limit, filters);
        } catch (error) {
          console.warn("⚠️ Paginated query failed, falling back to original query:", error);
          return await fetchDealsWithClientPagination(page, limit, filters);
        }
      } catch (error) {
        console.error("❌ Failed to fetch paginated deals:", error);
        throw error;
      }
    },
    enabled: isFullyReady,
    staleTime: 2 * 60 * 1e3,
    // 2 minutes for paginated data
    gcTime: 5 * 60 * 1e3,
    // 5 minutes
    retry: (failureCount, error) => {
      var _a, _b;
      if (((_a = error.message) == null ? void 0 : _a.includes("permission")) || ((_b = error.message) == null ? void 0 : _b.includes("policy"))) {
        return false;
      }
      return failureCount < 2;
    }
  });
};
async function fetchPaginatedDeals(page, limit, filters) {
  const offset = (page - 1) * limit;
  let query = supabase.from("company_deals").select(`
      id,
      company_id,
      title,
      description,
      deal_type,
      value,
      terms,
      start_date,
      end_date,
      is_active,
      click_count,
      conversion_rate,
      affiliate_link,
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
    `, { count: "exact" }).eq("is_active", true).not("company", "is", null);
  if (filters.category && filters.category !== "all") {
    query = query.eq("company.category", filters.category);
  }
  if (filters.searchTerm) {
    query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
  }
  switch (filters.sortBy) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "popular":
      query = query.order("click_count", { ascending: false });
      break;
    case "rating":
      query = query.order("created_at", { ascending: false });
      break;
    case "name":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }
  query = query.range(offset, offset + limit - 1);
  const { data: dealsData, error: dealsError, count } = await query;
  console.log("📊 Paginated query result:", {
    dealsCount: (dealsData == null ? void 0 : dealsData.length) || 0,
    totalCount: count,
    page,
    limit,
    offset,
    filters
  });
  if (dealsError) {
    console.error("❌ Paginated deals error:", dealsError);
    throw new Error(`Failed to fetch deals: ${dealsError.message}`);
  }
  const { data: companiesData, error: companiesError } = await supabase.from("trading_companies").select(`
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
  if (!dealsData) {
    console.warn("⚠️ No deals data returned from paginated query");
    return {
      deals: [],
      companies: companiesData || [],
      totalCount: 0,
      totalCompaniesCount: (companiesData == null ? void 0 : companiesData.length) || 0,
      totalDealsCount: 0
    };
  }
  if (!companiesData) {
    console.warn("⚠️ No companies data returned");
    return {
      deals: [],
      companies: [],
      totalCount: 0,
      totalCompaniesCount: 0,
      totalDealsCount: 0
    };
  }
  const deals = dealsData.filter((deal) => deal.company && deal.company.status === "active").map((deal) => {
    var _a, _b, _c, _d;
    return {
      id: deal.id,
      company_id: deal.company_id,
      title: deal.title,
      description: deal.description,
      deal_type: deal.deal_type,
      value: deal.value,
      terms: deal.terms,
      start_date: deal.start_date || deal.created_at,
      end_date: deal.end_date,
      is_active: deal.is_active,
      click_count: deal.click_count || 0,
      conversion_rate: deal.conversion_rate || 0,
      affiliate_link: deal.affiliate_link,
      created_at: deal.created_at,
      updated_at: deal.updated_at,
      company: deal.company,
      // Compatibility fields for direct access
      company_name: ((_a = deal.company) == null ? void 0 : _a.name) || "",
      merchant_name: (_b = deal.company) == null ? void 0 : _b.name,
      category: (_c = deal.company) == null ? void 0 : _c.category,
      rating: (_d = deal.company) == null ? void 0 : _d.overall_rating,
      bonus_amount: deal.value,
      features: [],
      tracking_link: deal.affiliate_link
    };
  });
  const companies = companiesData.map((company) => ({
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
  console.log("✅ Paginated deals fetched successfully:", {
    dealsCount: deals.length,
    companiesCount: companies.length,
    totalCount: count || 0
  });
  return {
    deals,
    companies,
    totalCount: count || 0,
    totalCompaniesCount: companies.length,
    totalDealsCount: count || 0
  };
}
async function fetchDealsWithClientPagination(page, limit, filters) {
  console.log("🔄 Using fallback client-side pagination...", { page, limit, filters });
  const { data: dealsData, error: dealsError } = await supabase.from("company_deals").select(`
      id,
      company_id,
      title,
      description,
      deal_type,
      value,
      terms,
      start_date,
      end_date,
      is_active,
      click_count,
      conversion_rate,
      affiliate_link,
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
  const { data: companiesData, error: companiesError } = await supabase.from("trading_companies").select(`
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
  if (!dealsData || !companiesData) {
    return {
      deals: [],
      companies: [],
      totalCount: 0,
      totalCompaniesCount: 0,
      totalDealsCount: 0
    };
  }
  let deals = dealsData.filter((deal) => deal.company && deal.company.status === "active").map((deal) => {
    var _a, _b, _c, _d;
    return {
      id: deal.id,
      company_id: deal.company_id,
      title: deal.title,
      description: deal.description,
      deal_type: deal.deal_type,
      value: deal.value,
      terms: deal.terms,
      start_date: deal.start_date || deal.created_at,
      end_date: deal.end_date,
      is_active: deal.is_active,
      click_count: deal.click_count || 0,
      conversion_rate: deal.conversion_rate || 0,
      affiliate_link: deal.affiliate_link,
      created_at: deal.created_at,
      updated_at: deal.updated_at,
      company: deal.company,
      // Compatibility fields for direct access
      company_name: ((_a = deal.company) == null ? void 0 : _a.name) || "",
      merchant_name: (_b = deal.company) == null ? void 0 : _b.name,
      category: (_c = deal.company) == null ? void 0 : _c.category,
      rating: (_d = deal.company) == null ? void 0 : _d.overall_rating,
      bonus_amount: deal.value,
      features: [],
      tracking_link: deal.affiliate_link
    };
  });
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    deals = deals.filter(
      (deal) => deal.company_name.toLowerCase().includes(searchLower) || deal.title.toLowerCase().includes(searchLower) || deal.description.toLowerCase().includes(searchLower)
    );
  }
  if (filters.category && filters.category !== "all") {
    deals = deals.filter((deal) => {
      var _a;
      return ((_a = deal.company) == null ? void 0 : _a.category) === filters.category;
    });
  }
  deals.sort((a, b) => {
    var _a, _b;
    switch (filters.sortBy) {
      case "rating":
        return (((_a = b.company) == null ? void 0 : _a.overall_rating) || 0) - (((_b = a.company) == null ? void 0 : _b.overall_rating) || 0);
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "popular":
        return (b.click_count || 0) - (a.click_count || 0);
      case "name":
        return a.company_name.localeCompare(b.company_name);
      default:
        return 0;
    }
  });
  const totalCount = deals.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedDeals = deals.slice(startIndex, endIndex);
  const companies = companiesData.map((company) => ({
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
  console.log("✅ Client-side paginated deals fetched successfully:", {
    dealsCount: paginatedDeals.length,
    totalCount,
    page,
    limit
  });
  return {
    deals: paginatedDeals,
    companies,
    totalCount,
    totalCompaniesCount: companies.length,
    totalDealsCount: totalCount
  };
}
const useUserRatingsQuery = (userId, companyIds) => {
  const { isFullyReady } = useAuth();
  return useQuery({
    queryKey: ["user-ratings", userId, companyIds],
    queryFn: async () => {
      if (!userId || companyIds.length === 0) {
        return {};
      }
      try {
        console.log("🔄 Fetching user ratings for", companyIds.length, "companies...");
        const { data, error } = await supabase.from("ratings").select("*").eq("user_id", userId).in("company_id", companyIds);
        if (error) {
          console.error("❌ Error fetching user ratings:", error);
          return {};
        }
        const ratingsMap = {};
        data == null ? void 0 : data.forEach((rating) => {
          ratingsMap[rating.company_id] = rating;
        });
        console.log("✅ User ratings fetched:", Object.keys(ratingsMap).length, "ratings");
        return ratingsMap;
      } catch (error) {
        console.error("❌ Failed to fetch user ratings:", error);
        return {};
      }
    },
    enabled: isFullyReady && !!userId && companyIds.length > 0,
    staleTime: 2 * 60 * 1e3,
    // 2 minutes
    gcTime: 5 * 60 * 1e3
    // 5 minutes
  });
};
const useUpdateDealClickMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ dealId }) => {
      try {
        console.log("🔄 Updating deal click count for deal:", dealId);
        const { error } = await supabase.rpc("increment_deal_clicks", {
          deal_id: dealId
        });
        if (error) {
          throw error;
        }
        console.log("✅ Deal click count updated successfully");
        return { success: true };
      } catch (error) {
        console.error("❌ Failed to update deal click count:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["featured-deals"] });
    }
  });
};
const useSubmitRatingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      companyId,
      ratings,
      existingRating
    }) => {
      console.log("🔄 Submitting rating via mutation hook...");
      const result = await ratingService.submitRating(userId, companyId, ratings, existingRating);
      if (result.error) {
        throw result.error;
      }
      return result.data;
    },
    onMutate: async ({ companyId }) => {
      await queryClient.cancelQueries({ queryKey: ["deals"] });
      await queryClient.cancelQueries({ queryKey: ["company-ratings", companyId] });
      const previousDeals = queryClient.getQueryData(["deals"]);
      return { previousDeals };
    },
    onError: (error, variables, context) => {
      console.error("❌ Rating submission failed:", error);
      showErrorToast("Failed to submit rating. Please try again.");
      if (context == null ? void 0 : context.previousDeals) {
        queryClient.setQueryData(["deals"], context.previousDeals);
      }
    },
    onSuccess: (data, { companyId }) => {
      console.log("✅ Rating submitted successfully:", data);
      showSuccessToast("Rating submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["company-ratings", companyId] });
      queryClient.invalidateQueries({ queryKey: ["featured-deals"] });
    }
  });
};
export {
  RATING_CATEGORIES as R,
  useUserRatingsQuery as a,
  useUpdateDealClickMutation as b,
  useDealsQuery as c,
  useSubmitRatingMutation as d,
  usePaginatedDealsQuery as u
};
