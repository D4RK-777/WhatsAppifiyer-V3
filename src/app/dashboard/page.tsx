import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/analytics">View Analytics</Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="text-lg font-medium">Feedback Overview</h2>
          <p className="mt-2 text-gray-500">
            View and analyze user feedback to improve your WhatsApp message generation.
          </p>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard/analytics">Go to Analytics</Link>
            </Button>
          </div>
        </div>
        
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="text-lg font-medium">Recent Activity</h2>
          <p className="mt-2 text-gray-500">
            Check the latest user interactions and feedback.
          </p>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard/analytics">View Activity</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
