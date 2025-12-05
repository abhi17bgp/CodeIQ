import React, { useState, useEffect } from 'react';
import { Users, FileCode, TrendingUp } from 'lucide-react';
import axios from 'axios';

const PlatformStats: React.FC = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalFiles: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    // Listen for file deletion/creation events to refresh stats immediately
    const handleStatsUpdate = () => {
      fetchStats();
    };
    window.addEventListener('statsUpdate', handleStatsUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('statsUpdate', handleStatsUpdate);
    };
  }, []);

  const fetchStats = async () => {
    try {
      // axios baseURL is already set to "http://localhost:5000/api" in AuthContext
      // So we only need to call "/stats" not "/api/stats"
      const response = await axios.get('/stats');
      console.log('Stats API response:', response.data);
      if (response.data && typeof response.data.totalUsers === 'number' && typeof response.data.totalFiles === 'number') {
        setStats({
          totalUsers: response.data.totalUsers,
          totalFiles: response.data.totalFiles
        });
      } else {
        console.error('Invalid stats response format:', response.data);
        // Set default values if response format is unexpected
        setStats({ totalUsers: 0, totalFiles: 0 });
      }
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      // Keep current stats on error instead of resetting to 0
    } finally {
      setLoading(false);
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}K+`;
    } else if (count >= 100) {
      return `${Math.floor(count / 100) * 100}+`;
    } else if (count >= 10) {
      // For numbers 10-99, round down to nearest 10 and add +
      return `${Math.floor(count / 10) * 10}+`;
    } else if (count > 0) {
      // For numbers 1-9, show exact count with +
      return `${count}+`;
    }
    return '0';
  };

  return (
    <section id="platform-stats" className="bg-muted/50 py-12 border-t border-border scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Platform Statistics
          </h2>
          <p className="text-muted-foreground">
            Join thousands of developers coding and learning together
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Users Stat */}
          <div className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {loading ? (
                    <span className="inline-block w-16 h-8 bg-muted rounded animate-pulse"></span>
                  ) : (
                    formatCount(stats.totalUsers)
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Developers using CodeIQ
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>

          {/* Files Stat */}
          <div className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Code Files
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {loading ? (
                    <span className="inline-block w-16 h-8 bg-muted rounded animate-pulse"></span>
                  ) : (
                    formatCount(stats.totalFiles)
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Projects created
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileCode className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformStats;

