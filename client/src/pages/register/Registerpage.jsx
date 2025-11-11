import { useState } from "react";

function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    rolId: "", // ✅ Nuevo campo
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Usuario registrado exitosamente");
        console.log("Usuario:", data.user);
      } else {
        alert(`⚠️ Error: ${data.message || "No se pudo registrar"}`);
        console.error(data);
      }
    } catch (error) {
      alert("❌ Error de conexión con el servidor");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Registro</h2>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
          required
        />

        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
          required
        />

        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
          required
        />

        {/* ✅ Nuevo campo para seleccionar el rol */}
        <select
          name="rolId"
          value={formData.rolId}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
          required
        >
          <option value="">Seleccione un rol</option>
          <option value="administrador">Administrador</option>
          <option value="vendedor">Vendedor</option>
          <option value="comprador">Comprador</option>
          <option value="visitante">Visitante</option>
        </select>

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
