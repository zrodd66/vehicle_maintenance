import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import vehicleService from '../services/vehicleService';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const DashboardCard = ({ title, value, icon: Icon, color, description }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {description && (
                <div className="ml-2 text-sm text-gray-500">{description}</div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    inMaintenance: 0,
    alerts: 0,
  });
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const vehicles = await vehicleService.getAllVehicles();
        
        // Calculate stats
        const activeVehicles = vehicles.filter(v => v.status === 'active').length;
        const inMaintenance = vehicles.filter(v => v.status === 'maintenance').length;
        const alerts = vehicles.reduce((acc, v) => acc + (v.alerts || 0), 0);

        setStats({
          totalVehicles: vehicles.length,
          activeVehicles,
          inMaintenance,
          alerts,
        });

        // Get recent vehicles (last 5)
        setRecentVehicles(vehicles.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your vehicle fleet
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Vehicles"
          value={stats.totalVehicles}
          icon={ChartBarIcon}
          color="text-blue-600"
        />
        <DashboardCard
          title="Active Vehicles"
          value={stats.activeVehicles}
          icon={CheckCircleIcon}
          color="text-green-600"
        />
        <DashboardCard
          title="In Maintenance"
          value={stats.inMaintenance}
          icon={WrenchScrewdriverIcon}
          color="text-yellow-600"
        />
        <DashboardCard
          title="Active Alerts"
          value={stats.alerts}
          icon={ExclamationTriangleIcon}
          color="text-red-600"
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Vehicles</h2>
          <Link
            to="/vehicles"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentVehicles.map((vehicle) => (
              <li key={vehicle.id}>
                <Link
                  to={`/vehicles/${vehicle.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {vehicle.make} {vehicle.model}
                        </p>
                        <p className="ml-2 text-sm text-gray-500">
                          {vehicle.year}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            vehicle.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : vehicle.status === 'maintenance'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {vehicle.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
