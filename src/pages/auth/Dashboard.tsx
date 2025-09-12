import { useMemo } from 'react';
import { Icons } from '@components/icons';
import { useAuth } from '../../lib/authContext';
import { useDealsQuery } from '../../hooks/queries/useDealsQuery';

// Enhanced Loading Skeleton Component
const StatCardSkeleton = () => (
  <div className="bg-content1/60 backdrop-blur-xl rounded-3xl container-p-xl border border-divider/30 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-content2 rounded-2xl"></div>
          <div className="w-16 h-6 bg-content2 rounded-lg"></div>
        </div>
        <div className="space-y-3">
          <div className="w-20 h-8 bg-content2 rounded-lg"></div>
          <div className="w-32 h-4 bg-content2 rounded-md"></div>
          <div className="w-28 h-3 bg-content2 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const dealsQuery = useDealsQuery();

  // Get real data from API
  const companies = dealsQuery.data?.companies || [];
  const deals = dealsQuery.data?.deals || [];

  // Calculate real metrics from database
  const activePlatforms = companies.filter(c => c.status === 'active').length;
  const avgPlatformRating = companies.length > 0 
    ? (companies.reduce((sum, c) => sum + (c.overall_rating || 0), 0) / companies.length).toFixed(1)
    : '0.0';
  const totalReviews = companies.reduce((sum, c) => sum + (c.total_reviews || 0), 0);
  
  // Real metrics from database
  const totalDeals = deals.length;
  const activeDeals = deals.filter(d => d.is_active).length;
  
  // Calculate average deal value from actual deal values
  const avgDealValue = deals.length > 0 
    ? deals.reduce((sum, d) => {
        const value = parseFloat((d as any).value?.replace(/[^0-9.-]/g, '') || '0');
        return sum + value;
      }, 0) / deals.length
    : 0;

  // Category distribution
  const categoryStats = companies.reduce((acc, company) => {
    const category = company.category?.replace('_', ' ') || 'Unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Top performing categories
  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([category, count]) => ({ category, count: count as number }));

  // Enhanced category statistics
  const enhancedCategoryStats = useMemo(() => {
    const stats = companies.reduce((acc, company) => {
      const category = company.category?.replace('_', ' ') || 'Unknown';
      if (!acc[category]) {
        acc[category] = { count: 0, totalRating: 0 };
      }
      acc[category].count += 1;
      acc[category].totalRating += company.overall_rating || 0;
      return acc;
    }, {} as Record<string, { count: number; totalRating: number }>);

    return Object.entries(stats)
      .map(([category, data]) => ({
        category,
        count: data.count,
        avgRating: data.count > 0 ? (data.totalRating / data.count) : 0,
        percentage: Math.round((data.count / companies.length) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }, [companies]);

  // Professional Dashboard Stats - Only real data from database
  const stats = [
    {
      title: "Total Platforms",
      value: companies.length.toString(),
      change: `${activePlatforms} active`,
      trend: "up",
      icon: Icons.users,
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      description: "Trading platforms in database"
    },
    {
      title: "Active Platforms",
      value: activePlatforms.toString(),
      change: `${Math.round((activePlatforms / companies.length) * 100)}% active`,
      trend: "up", 
      icon: Icons.users,
      iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
      description: "Currently operational"
    },
    {
      title: "Total Deals",
      value: totalDeals.toString(),
      change: `${activeDeals} active`,
      trend: "up",
      icon: Icons.gift,
      iconBg: "bg-gradient-to-br from-purple-500 to-violet-600",
      description: "Available promotions"
    },
    {
      title: "Avg Rating",
      value: avgPlatformRating,
      change: "High quality",
      trend: "up",
      icon: Icons.star,
      iconBg: "bg-gradient-to-br from-amber-500 to-yellow-600",
      description: "Platform satisfaction"
    }
  ];

  // Loading state with simple spinner
  if (dealsQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state with professional styling
  if (dealsQuery.isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-content1/10 to-background">
        <div className="container-page section-py-3xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mb-xl shadow-2xl shadow-red-500/20">
              <Icons.warning className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-lg">Failed to load dashboard</h2>
            <p className="text-xl text-foreground/60 mb-2xl max-w-lg">
              There was an error loading your dashboard data. Please try refreshing the page.
            </p>
            <button
              onClick={() => dealsQuery.refetch()}
              className="px-xl py-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 transform"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Enhanced Header */}


        {/* Enhanced Stats Grid */}
        <section className="container-page section-py-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg lg:gap-xl">
            {stats.map((stat, index) => (
              <div 
                key={stat.title} 
                className="group relative overflow-hidden bg-content1/60 backdrop-blur-xl rounded-3xl container-p-2xl border border-divider/30 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-[1.02] animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-lg px-2">
                    <div className="relative">
                      <div className={`relative w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 px-2">
                    <h3 className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
                      {stat.value}
                    </h3>
                    <p className="text-base font-semibold text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                      {stat.title}
                    </p>
                    <p className="text-sm text-foreground/60 leading-relaxed">
                      {stat.description}
                    </p>
                    

                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Analytics Grid */}
        <div className="container-page">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-xl">
            
            {/* Left Column - Advanced Analytics */}
            <div className="xl:col-span-2 space-y-enhanced">
              
              {/* Platform Overview */}
              <div className="bg-content1/80 backdrop-blur-2xl rounded-3xl border border-divider/40 container-p-2xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden relative mb-6xl">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-xl">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        Platform Overview
                      </h2>
                      <p className="text-foreground/60">Trading platform statistics and metrics</p>
                    </div>
                  </div>
                  
                  {/* Platform Statistics Grid */}
                  <div className="grid grid-cols-3 gap-lg mb-xl">
                    <div className="text-center container-p-md bg-content2/30 rounded-2xl backdrop-blur-sm border border-divider/20">
                      <div className="text-3xl font-bold text-primary mb-2">{companies.length}</div>
                      <div className="text-sm text-foreground/60">Total Platforms</div>
                    </div>
                    <div className="text-center container-p-md bg-content2/30 rounded-2xl backdrop-blur-sm border border-divider/20">
                      <div className="text-3xl font-bold text-secondary mb-2">{totalDeals}</div>
                      <div className="text-sm text-foreground/60">Total Deals</div>
                    </div>
                    <div className="text-center container-p-md bg-content2/30 rounded-2xl backdrop-blur-sm border border-divider/20">
                      <div className="text-3xl font-bold text-amber-600 mb-2">{avgPlatformRating}</div>
                      <div className="text-sm text-foreground/60">Avg Rating</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2xl">
                    <div className="flex items-center gap-md">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-foreground/80">{activePlatforms} Active Platforms</span>
                    </div>
                    <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors hover:gap-2">
                      View All <Icons.arrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Category Distribution */}
              <div className="bg-content1/80 backdrop-blur-2xl rounded-3xl border border-divider/40 container-p-2xl hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-500 group overflow-hidden relative">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-xl">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors duration-300">
                        Category Distribution
                      </h2>
                      <p className="text-foreground/60">Platform categories and performance</p>
                    </div>
                  </div>
                  
                  <div className="space-y-lg">
                    {enhancedCategoryStats.map((category, index) => (
                      <div key={category.category} className="group/category hover:bg-content2/20 rounded-2xl container-p-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-md">
                          <div>
                            <h3 className="font-semibold text-foreground capitalize group-hover/category:text-secondary transition-colors duration-200">
                              {category.category}
                            </h3>
                            <p className="text-sm text-foreground/60">
                              {category.count} platforms • {category.avgRating.toFixed(1)} avg rating
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">{category.percentage}%</div>
                            <div className="text-xs text-foreground/50">of total</div>
                          </div>
                        </div>
                        
                        {/* Enhanced progress bar */}
                        <div className="w-full bg-content2 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                              width: `${category.percentage}%`,
                              animationDelay: `${index * 200}ms`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Activity & Quick Stats */}
            <div className="space-y-enhanced">
              
              {/* Top Categories */}
              <div className="bg-content1/80 backdrop-blur-2xl rounded-3xl border border-divider/40 container-p-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden relative">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-xl">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        Top Categories
                      </h2>
                      <p className="text-sm text-foreground/60">Most popular platform types</p>
                    </div>
                  </div>
                  
                  <div className="space-y-md">
                    {topCategories.map((category, index) => (
                      <div 
                        key={category.category} 
                        className="flex items-center justify-between p-md rounded-2xl bg-content2/20 hover:bg-content2/40 transition-colors duration-300"
                      >
                        <div className="flex items-center gap-md">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium text-foreground capitalize">
                            {category.category}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          {category.count} platforms
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced Quick Stats */}
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="container-page section-py-xl">
          <div className="text-center">
            <p className="text-sm text-foreground/50">
              Dashboard data updates in real-time • Last refresh: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;