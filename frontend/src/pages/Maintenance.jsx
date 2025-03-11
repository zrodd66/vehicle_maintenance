import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import maintenanceService from '../services/maintenanceService';

const Maintenance = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchMaintenanceRecords();
  }, []);

  const fetchMaintenanceRecords = async () => {
    try {
      const data = await maintenanceService.getAllMaintenance();
      setMaintenanceRecords(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los registros de mantenimiento');
      console.error('Error fetching maintenance records:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = (
      record.vehicle?.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Registros de Mantenimiento</h1>
        <Link
          to="/maintenance/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Nuevo Mantenimiento
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <input
            type="text"
            placeholder="Buscar registros..."
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron registros de mantenimiento</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <li key={record.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-blue-600">
                        Vehículo: {record.vehicle?.placa} - {record.vehicle?.marca} {record.vehicle?.modelo}
                      </p>
                      <p className="text-sm text-gray-500">
                        Tipo: {record.type}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{record.description}</p>
                    <div className="mt-2 flex justify-between">
                      <p className="text-sm text-gray-500">
                        Fecha: {new Date(record.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Costo: ${record.cost}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Maintenance; 