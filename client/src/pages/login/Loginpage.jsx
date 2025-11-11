import { useState } from "react";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      alert("Inicio de sesión exitoso");
      localStorage.setItem("token", data.access_token);
    } else {
      alert(data.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Iniciar Sesión</h2>
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
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className="w-full border rounded p-2 mb-3"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
