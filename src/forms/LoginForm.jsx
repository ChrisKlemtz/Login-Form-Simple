import { useState } from "react";

// Früher kam die Prüfung vom Express-Backend (backend/server.js).
// Für die Sammlung wird sie lokal simuliert, damit kein Server nötig ist.
const DEMO_USERS = [
  { username: "admin", password: "password" },
  { username: "chris", password: "123456789" },
];

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = DEMO_USERS.find((u) => u.username === username && u.password === password);
    setSuccess(Boolean(user));
    setMessage(user ? "Login erfolgreich!" : "Falsche Anmeldedaten!");
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gray-100 p-6">
      <form className="p-6 bg-white rounded-xl shadow-md w-80" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <input
          className="w-full p-2 mb-2 border rounded"
          type="text"
          placeholder="Username"
          aria-label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full p-2 mb-2 border rounded"
          type="password"
          placeholder="Password"
          aria-label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">
          Login
        </button>
      </form>
      {message && (
        <p role="status" className={`mt-4 ${success ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
