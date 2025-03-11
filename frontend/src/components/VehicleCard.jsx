import { Link } from 'react-router-dom';
import { 
  ClockIcon, 
  WrenchScrewdriverIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-red-100 text-red-800'
};

const VehicleCard = ({ vehicle }) => {
  const statusColor = statusColors[vehicle.status?.toLowerCase()] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-gray-500">{vehicle.year}</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
            {vehicle.status}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="h-5 w-5 mr-2" />
            Last Maintenance: {new Date(vehicle.lastMaintenance).toLocaleDateString()}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
            Maintenance Count: {vehicle.maintenanceCount || 0}
          </div>

          {vehicle.alerts > 0 && (
            <div className="flex items-center text-sm text-red-600">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              {vehicle.alerts} Alert{vehicle.alerts > 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="mt-6 flex space-x-3">
          <Link
            to={`/vehicles/${vehicle.id}`}
            className="flex-1 text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View Details
          </Link>
          <Link
            to={`/vehicles/${vehicle.id}/maintenance`}
            className="flex-1 text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Maintenance Log
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
