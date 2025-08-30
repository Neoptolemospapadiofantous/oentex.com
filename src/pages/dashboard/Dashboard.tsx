import React from 'react';
import { 
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Progress,
  Avatar
} from '@heroui/react';
import { Star, Users, Award, TrendingUp, Settings, RefreshCw, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../lib/authContext';
import { useDealsQuery } from '../../hooks/queries/useDealsQuery';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const dealsQuery = useDealsQuery();

  const deals = dealsQuery.data?.deals || [];
  const companies = dealsQuery.data?.companies || [];

  const totalPlatforms = companies.length;
  const activePlatforms = companies.filter(c => c.status === 'active').length;
  const avgPlatformRating = companies.length > 0 
    ? (companies.reduce((sum, c) => sum + (c.overall_rating || 0), 0) / companies.length).toFixed(1)
    : '0.0';
  const totalReviews = companies.reduce((sum, c) => sum + (c.total_reviews || 0), 0);

  const topRatedPlatforms = companies
    .filter(c => c.overall_rating > 0)
    .sort((a, b) => (b.overall_rating || 0) - (a.overall_rating || 0))
    .slice(0, 4)
    .map(company => ({
      id: company.id,
      name: company.name,
      category: company.category?.replace('_', ' ') || 'Trading',
      rating: company.overall_rating?.toFixed(1) || '0.0',
      reviews: company.total_reviews || 0,
      logo: company.logo_url
    }));

  const categoryStats = companies.reduce((acc, company) => {
    const category = company.category?.replace('_', ' ') || 'Unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .map(([category, count]) => ({ category, count }));

  if (dealsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-default-600">Loading your platform overview...</p>
        </div>
        
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-default-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (dealsQuery.error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-default-600">Error loading dashboard data</p>
        </div>
        
        <Card>
          <CardBody className="text-center p-6">
            <p className="text-danger mb-4">Failed to load dashboard data</p>
            <Button
              color="primary"
              onPress={() => dealsQuery.refetch()}
            >
              Try Again
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Platforms',
      value: totalPlatforms,
      subtitle: 'Available to rate',
      icon: Users,
      color: 'primary' as const,
      progress: (activePlatforms / totalPlatforms) * 100
    },
    {
      title: 'Active Platforms',
      value: activePlatforms,
      subtitle: 'Currently active',
      icon: TrendingUp,
      color: 'success' as const,
      progress: 100
    },
    {
      title: 'Total Reviews',
      value: totalReviews.toLocaleString(),
      subtitle: 'Community reviews',
      icon: Award,
      color: 'warning' as const,
      progress: Math.min((totalReviews / 1000) * 100, 100)
    },
    {
      title: 'Avg. Platform Rating',
      value: avgPlatformRating,
      subtitle: 'Overall quality',
      icon: Star,
      color: 'secondary' as const,
      progress: (parseFloat(avgPlatformRating) / 5) * 100
    }
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-default-600">
          Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}! Here's your platform overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-small font-medium text-default-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-small font-medium text-success mt-1">{stat.subtitle}</p>
                  </div>
                  <Avatar
                    icon={<stat.icon className="w-6 h-6" />}
                    className={`bg-${stat.color}-100 text-${stat.color}`}
                  />
                </div>
                <Progress 
                  value={stat.progress} 
                  color={stat.color}
                  size="sm"
                  className="mt-2"
                />
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="flex justify-between">
              <h2 className="text-xl font-semibold">Top Rated Platforms</h2>
              <Button variant="light" color="primary" size="sm">View All</Button>
            </CardHeader>
            <CardBody>
              {topRatedPlatforms.length > 0 ? (
                <div className="space-y-4">
                  {topRatedPlatforms.map((platform, index) => (
                    <Card key={platform.id} className="bg-content2">
                      <CardBody className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Chip color="primary" variant="solid" size="sm">
                              {index + 1}
                            </Chip>
                            <Avatar
                              src={platform.logo}
                              name={platform.name}
                              size="sm"
                              fallback={<TrendingUp className="w-4 h-4" />}
                            />
                            <div className="flex-1">
                              <h3 className="font-medium">{platform.name}</h3>
                              <div className="flex items-center space-x-4 mt-1">
                                <Chip size="sm" variant="flat" color="default">
                                  {platform.category}
                                </Chip>
                                <span className="text-small font-medium text-primary">
                                  {platform.reviews} reviews
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-warning fill-current" />
                              <span className="font-medium">{platform.rating}</span>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-8 h-8 mx-auto mb-3 text-default-400" />
                  <p className="text-default-600">No rated platforms yet</p>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-xl font-semibold">Platform Categories</h2>
            </CardHeader>
            <CardBody>
              {topCategories.length > 0 ? (
                <div className="space-y-4">
                  {topCategories.map((category, index) => (
                    <Card key={index} className="bg-content2">
                      <CardBody className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar
                              icon={<Users className="w-4 h-4" />}
                              className={`${
                                index % 3 === 0 ? 'bg-primary-100 text-primary' : 
                                index % 3 === 1 ? 'bg-success-100 text-success' : 
                                'bg-warning-100 text-warning'
                              }`}
                              size="sm"
                            />
                            <div>
                              <h3 className="font-medium capitalize">{category.category}</h3>
                              <p className="text-small text-default-600">Trading category</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{category.count}</p>
                            <p className="text-small text-default-600">platforms</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-8 h-8 mx-auto mb-3 text-default-400" />
                  <p className="text-default-600">No categories available</p>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
          <CardHeader>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                as="a"
                href="/deals"
                variant="flat"
                color="primary"
                className="h-auto p-4 justify-start"
                startContent={<Users className="w-6 h-6" />}
              >
                <div className="text-left">
                  <h3 className="font-medium">Browse Platforms</h3>
                  <p className="text-small text-default-600">Discover and rate trading platforms</p>
                </div>
              </Button>
              
              <Button 
                as="a"
                href="/my-deals"
                variant="flat"
                color="success"
                className="h-auto p-4 justify-start"
                startContent={<Star className="w-6 h-6" />}
              >
                <div className="text-left">
                  <h3 className="font-medium">My Ratings</h3>
                  <p className="text-small text-default-600">View and manage your platform ratings</p>
                </div>
              </Button>
              
              <Button 
                as="a"
                href="/profile"
                variant="flat"
                color="warning"
                className="h-auto p-4 justify-start"
                startContent={<Settings className="w-6 h-6" />}
              >
                <div className="text-left">
                  <h3 className="font-medium">Profile Settings</h3>
                  <p className="text-small text-default-600">Manage your account preferences</p>
                </div>
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;