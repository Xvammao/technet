import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cable } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Intentando login con:', { username });
      
      // Detectar la URL base del backend
      const getBackendURL = () => {
        if (window.location.hostname.includes('ngrok')) {
          // CAMBIA ESTO CON TU URL DE DJANGO DE NGROK
          return '�++https://68d80cce2993.ngrok-free.app';
        }
        if (import.meta.env.VITE_API_URL) {
          return import.meta.env.VITE_API_URL;
        }
        return '�++https://32d9eea2fd69.ngrok-free.app';
      };
      
      // Intentar login con Djoser
      const response = await axios.post(`${getBackendURL()}/token/login/`, {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Respuesta del servidor:', response.data);

      // Guardar token
      if (response.data.auth_token) {
        localStorage.setItem('authToken', response.data.auth_token);
        console.log('Token guardado exitosamente');
        
        // Redirigir al dashboard
        navigate('/');
      } else {
        setError('No se recibió el token de autenticación');
      }
    } catch (err: any) {
      console.error('Error completo de login:', err);
      console.error('Respuesta del error:', err.response);
      
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Error al conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8000');
      } else if (err.response?.status === 400) {
        setError('Usuario o contraseña incorrectos. Verifica tus credenciales.');
      } else if (err.response?.status === 401) {
        setError('Usuario o contraseña incorrectos');
      } else {
        setError(`Error del servidor: ${err.response?.status || 'Desconocido'}. ${err.response?.data?.detail || ''}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Cable className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              TechNet
            </span>
          </div>
          <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Sistema de Gestión de Telecomunicaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <div className="text-sm text-center text-slate-600 dark:text-slate-400 mt-4">
              
              
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
