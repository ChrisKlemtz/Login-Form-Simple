import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form className="p-6 bg-white rounded-xl shadow-md w-80" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <input
          className="w-full p-2 mb-2 border rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full p-2 mb-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}
