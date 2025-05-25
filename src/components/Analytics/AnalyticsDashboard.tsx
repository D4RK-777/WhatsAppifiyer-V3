'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type AnalyticsData = {
  feedbackOverTime: Record<string, { positive: number; negative: number }>;
  tagUsage: Record<string, number>;
  totalFeedback: number;
  positiveFeedback: number;
  negativeFeedback: number;
};

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError('Failed to load analytics data');
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to connect to analytics service');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-gray-500">
        No analytics data available
      </div>
    );
  }

  // Prepare data for charts
  const feedbackDates = Object.keys(data.feedbackOverTime).sort();
  const feedbackChartData = {
    labels: feedbackDates,
    datasets: [
      {
        label: 'Positive',
        data: feedbackDates.map(date => data.feedbackOverTime[date]?.positive || 0),
        backgroundColor: '#10B981',
      },
      {
        label: 'Negative',
        data: feedbackDates.map(date => data.feedbackOverTime[date]?.negative || 0),
        backgroundColor: '#EF4444',
      },
    ],
  };

  const tagLabels = Object.keys(data.tagUsage);
  const tagChartData = {
    labels: tagLabels,
    datasets: [
      {
        data: tagLabels.map(tag => data.tagUsage[tag]),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899',
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Feedback Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1 border rounded-md text-sm"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalFeedback}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Positive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.positiveFeedback}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Negative</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.negativeFeedback}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Feedback Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={feedbackChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback by Tag</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {tagLabels.length > 0 ? (
                <Pie
                  data={tagChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No tag data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
