import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';

const NewVehicle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    año: '',
    placa: '',
    estado: 'active'
  });

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
      await vehicleService.createVehicle(formData);
      navigate('/vehicles');
    } catch (err) {
      setError(err.message || 'Error al crear el vehículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Agregar Nuevo Vehículo</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-400 rounded text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
            Marca
          </label>
          <input
            type="text"
            id="marca"
            name="marca"
            required
            value={formData.marca}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
            Modelo
          </label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            required
            value={formData.modelo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="año" className="block text-sm font-medium text-gray-700">
            Año
          </label>
          <input
            type="number"
            id="año"
            name="año"
            required
            min="1900"
            max={new Date().getFullYear() + 1}
            value={formData.año}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="placa" className="block text-sm font-medium text-gray-700">
            Placa
          </label>
          <input
            type="text"
            id="placa"
            name="placa"
            required
            value={formData.placa}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="active">Activo</option>
            <option value="maintenance">En Mantenimiento</option>
            <option value="inactive">Inactivo</option>
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
            {loading ? 'Guardando...' : 'Guardar Vehículo'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/vehicles')}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewVehicle; 