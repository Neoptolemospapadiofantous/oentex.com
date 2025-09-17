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
  
  // Real metrics from database
  const totalDeals = deals.length;
  const activeDeals = deals.filter(d => d.is_active).length;
  

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

  // Top performing categories
  const topCategories = enhancedCategoryStats.slice(0, 3);

  // Professional Dashboard Stats - Using your available icons
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
      change: `${Math.round((activePlatforms / Math.max(companies.length, 1)) * 100)}% active`,
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

  // Enhanced loading state with skeleton cards
  if (dealsQuery.isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container-page section-py-xl">
          {/* Loading Header */}
          <div className="text-center mb-2xl">
            <div className="w-64 h-8 bg-content2 rounded-lg mx-auto mb-lg animate-pulse"></div>
            <div className="w-48 h-6 bg-content2 rounded-lg mx-auto animate-pulse"></div>
          </div>
          
          {/* Loading Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg lg:gap-xl mb-2xl">
            {[...Array(4)].map((_, index) => (
              <StatCardSkeleton key={index} />
            ))}
          </div>
          
          {/* Loading Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-xl">
            <div className="xl:col-span-2 space-y-xl">
              <div className="bg-content1/60 backdrop-blur-xl rounded-3xl container-p-2xl border border-divider/30">
                <div className="space-y-lg">
                  <div className="w-48 h-6 bg-content2 rounded-lg animate-pulse"></div>
                  <div className="w-32 h-4 bg-content2 rounded-lg animate-pulse"></div>
                  <div className="space-y-md mt-xl">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-full h-16 bg-content2 rounded-2xl animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-xl">
              <div className="bg-content1/60 backdrop-blur-xl rounded-3xl container-p-xl border border-divider/30">
                <div className="space-y-lg">
                  <div className="w-32 h-6 bg-content2 rounded-lg animate-pulse"></div>
                  <div className="w-24 h-4 bg-content2 rounded-lg animate-pulse"></div>
                  <div className="space-y-md mt-lg">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-full h-12 bg-content2 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (dealsQuery.isError) {
    return (
      <div className="min-h-screen">
        <div className="container-page section-py-xl">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mb-2xl shadow-2xl shadow-red-500/20">
                <Icons.warning className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-lg">Failed to load dashboard</h2>
              <p className="text-xl text-foreground/70 mb-2xl max-w-lg mx-auto">
                There was an error loading your dashboard data. Please try refreshing the page.
              </p>
              <button
                onClick={() => dealsQuery.refetch()}
                className="px-2xl py-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25"
              >
                <Icons.refresh className="w-5 h-5 mr-sm inline" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container-page section-py-xl">
        {/* Enhanced Header */}
        <div className="text-center mb-2xl">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-lg">
            Trading Platform Dashboard
          </h1>
          <p className="text-lg text-foreground/70 mb-sm">
            Real-time insights and analytics
          </p>
          <p className="text-sm text-foreground/60">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <section className="mb-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg lg:gap-xl">
            {stats.map((stat) => (
              <div 
                key={stat.title} 
                className="group relative overflow-hidden bg-content1/80 backdrop-blur-2xl rounded-3xl container-px-2xl container-py-lg border border-divider/40 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-[1.02]"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-lg">
                    <div className="relative">
                      <div className={`w-14 h-14 bg-gradient-to-br ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div className="text-xs font-semibold container-px-sm container-py-xs rounded-lg bg-success/20 text-success border border-success/30">
                      {stat.change}
                    </div>
                  </div>

                  <div className="space-y-sm">
                    <h3 className={`text-4xl font-bold ${stat.color} group-hover:text-primary transition-colors duration-300 tracking-tight`}>
                      {stat.value}
                    </h3>
                    <p className="text-base font-semibold text-foreground group-hover:text-foreground transition-colors duration-300">
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2xl">
          
          {/* Left Column - Advanced Analytics */}
          <div className="xl:col-span-2 space-y-2xl">
            
            {/* Platform Overview */}
            <div className="bg-content1/90 backdrop-blur-2xl rounded-3xl border border-divider/50 container-p-2xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden relative">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2xl">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-sm group-hover:text-primary transition-colors duration-300">
                      Platform Overview
                    </h2>
                    <p className="text-foreground/60">Trading platform statistics and metrics</p>
                  </div>
                  <Icons.database className="w-8 h-8 text-primary/60 group-hover:text-primary transition-colors duration-300" />
                </div>
                
                {/* Platform Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-2xl">
                  <div className="text-center container-p-lg bg-content2/50 rounded-2xl backdrop-blur-sm border border-divider/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <div className="text-3xl font-bold text-primary mb-sm">{companies.length}</div>
                    <div className="text-sm text-foreground/60 font-medium">Total Platforms</div>
                  </div>
                  <div className="text-center container-p-lg bg-content2/50 rounded-2xl backdrop-blur-sm border border-divider/30 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10">
                    <div className="text-3xl font-bold text-secondary mb-sm">{totalDeals}</div>
                    <div className="text-sm text-foreground/60 font-medium">Total Deals</div>
                  </div>
                  <div className="text-center container-p-lg bg-content2/50 rounded-2xl backdrop-blur-sm border border-divider/30 hover:border-warning/30 transition-all duration-300 hover:shadow-lg hover:shadow-warning/10">
                    <div className="text-3xl font-bold text-warning mb-sm">{avgPlatformRating}</div>
                    <div className="text-sm text-foreground/60 font-medium">Avg Rating</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2xl">
                  <div className="flex items-center gap-md">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-foreground/80">{activePlatforms} Active Platforms</span>
                  </div>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-sm transition-all duration-200 hover:gap-md">
                    View All <Icons.arrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Category Distribution */}
            <div className="bg-content1/90 backdrop-blur-2xl my-2xl rounded-3xl border border-divider/50 container-p-2xl hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-500 group overflow-hidden relative">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2xl">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-sm group-hover:text-secondary transition-colors duration-300">
                      Category Distribution
                    </h2>
                    <p className="text-foreground/60">Platform categories and performance metrics</p>
                  </div>
                  <Icons.chart className="w-8 h-8 text-secondary/60 group-hover:text-secondary transition-colors duration-300" />
                </div>
                
                <div className="space-y-lg">
                  {enhancedCategoryStats.map((category) => (
                    <div key={category.category} className="hover:bg-content2/30 rounded-2xl container-p-lg transition-all duration-300 hover:shadow-lg hover:shadow-secondary/5">
                      <div className="flex items-center justify-between mb-sm">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground capitalize hover:text-secondary transition-colors duration-200">
                            {category.category}
                          </h3>
                          <p className="text-sm text-foreground/60">
                            {category.count} platforms • {category.avgRating.toFixed(1)} avg rating
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">{category.percentage}%</div>
                          <div className="text-xs text-foreground/50">of total</div>
                        </div>
                      </div>
                      
                      {/* Enhanced progress bar */}
                      <div className="w-full bg-content2/60 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Quick Stats */}
          <div className="space-y-2xl">
            
            {/* Top Categories */}
            <div className="bg-content1/90 backdrop-blur-2xl rounded-3xl border border-divider/50 container-p-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden relative">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2xl">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-sm group-hover:text-primary transition-colors duration-300">
                      Top Categories
                    </h2>
                    <p className="text-sm text-foreground/60">Most popular platform types</p>
                  </div>
                  <Icons.trophy className="w-6 h-6 text-warning/60 group-hover:text-warning transition-colors duration-300" />
                </div>
                
                <div className="space-y-md">
                  {topCategories.map((category, index) => (
                    <div 
                      key={category.category} 
                      className="flex items-center justify-between container-p-md rounded-2xl bg-content2/30 hover:bg-content2/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                    >
                      <div className="flex items-center gap-md">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          index === 0 ? 'bg-gradient-to-br from-warning/30 to-warning/20 text-warning' :
                          index === 1 ? 'bg-gradient-to-br from-default-300/30 to-default-300/20 text-default-600' :
                          'bg-gradient-to-br from-default-200/30 to-default-200/20 text-default-500'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-foreground capitalize hover:text-primary transition-colors duration-200">
                          {category.category}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-primary">
                        {category.count} platforms
                      </div>
                    </div>
                  ))}
                </div>
                
                {enhancedCategoryStats.length > 3 && (
                  <div className="mt-lg pt-lg border-t border-divider/30">
                    <button className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200">
                      View All Categories
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Spacer Component */}
            {/* <div className="flex items-center justify-center my-2xl">
            </div> */}

            {/* Quick Actions */}
            <div className="bg-content1/90 backdrop-blur-2xl my-2xl rounded-3xl border border-divider/50 container-p-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden relative">
              <div className="relative z-10">
                <div className="mb-2xl">
                  <h2 className="text-xl font-bold text-foreground mb-sm group-hover:text-secondary transition-colors duration-300">
                    Quick Actions
                  </h2>
                  <p className="text-sm text-foreground/60">Manage your dashboard</p>
                </div>
                
                <div className="space-y-sm">
                  <button className="w-full flex items-center gap-md container-p-md bg-content2/30 hover:bg-primary/10 rounded-2xl transition-all duration-300 group/action hover:shadow-lg hover:shadow-primary/10">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-200">
                      <Icons.add className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground group-hover/action:text-primary transition-colors duration-200">
                      Add New Platform
                    </span>
                  </button>
                  
                  <button className="w-full flex items-center gap-md container-p-md bg-content2/30 hover:bg-secondary/10 rounded-2xl transition-all duration-300 group/action hover:shadow-lg hover:shadow-secondary/10">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center group-hover/action:scale-110 transition-transform duration-200">
                      <Icons.refresh className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="font-medium text-foreground group-hover/action:text-secondary transition-colors duration-200">
                      Refresh Data
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;