import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import maintenanceService from '../services/maintenanceService';
import vehicleService from '../services/vehicleService';

const NewMaintenance = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    type: '',
    description: '',
    cost: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
    } catch (err) {
      setError('Error al cargar los vehículos');
      console.error('Error fetching vehicles:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await maintenanceService.createMaintenance(formData);
      navigate('/maintenance');
    } catch (err) {
      setError(err.message || 'Error al crear el registro de mantenimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Registro de Mantenimiento</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-400 rounded text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="vehicle_id" className="block text-sm font-medium text-gray-700">
            Vehículo
          </label>
          <select
            id="vehicle_id"
            name="vehicle_id"
            required
            value={formData.vehicle_id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar vehículo</option>
            {vehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.placa} - {vehicle.marca} {vehicle.modelo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tipo de Mantenimiento
          </label>
          <input
            type="text"
            id="type"
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            placeholder="Ej: Cambio de aceite, Revisión de frenos"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
            Costo
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="cost"
              name="cost"
              required
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-7 pr-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Fecha
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">Pendiente</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? 'Guardando...' : 'Guardar Mantenimiento'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/maintenance')}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewMaintenance; 