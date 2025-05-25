'use client';

import { AnalyticsDashboard } from '@/components/Analytics/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Feedback Analytics</h1>
      <AnalyticsDashboard />
    </div>
  );
}
