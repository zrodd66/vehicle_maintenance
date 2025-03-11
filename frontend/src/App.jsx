import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import NewVehicle from './pages/NewVehicle';
import Maintenance from './pages/Maintenance';
import NewMaintenance from './pages/NewMaintenance';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/vehicles" element={<Vehicles />} />
                      <Route path="/vehicles/new" element={<NewVehicle />} />
                      <Route path="/maintenance" element={<Maintenance />} />
                      <Route path="/maintenance/new" element={<NewMaintenance />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Layout component with Navbar
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default App;
