import { useState } from 'react';
import { registerUser } from './authService';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    rolId: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <select
          name="rolId"
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        >
          <option value="">Seleccionar rol</option>
          <option value="ADMIN">Administrador</option>
          <option value="VENDEDOR">Vendedor</option>
          <option value="COMPRADOR">Comprador</option>
          <option value="VISITANTE">Visitante</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600"
        >
          Registrarse
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
