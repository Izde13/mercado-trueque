import { useState } from 'react';
import { loginUser } from './authService';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      localStorage.setItem('token', res.data.access_token);
      setMessage('Inicio de sesión exitoso');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <input
          type="email"
          name="email"
          placeholder="Correo"
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600"
        >
          Entrar
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
