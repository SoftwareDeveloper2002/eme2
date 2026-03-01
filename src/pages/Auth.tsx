import { useState } from "react";

export default function App() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit() {
    if (!email || !password) {
      setStatus("Email and password required");
      return;
    }

    setStatus("Processing...");

    const endpoint =
      mode === "register"
        ? "http://18.140.66.145/auth/register"
        : "http://18.140.66.145/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (mode === "login") {
          setStatus("Login successful! Redirecting...");
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1000);
        } else {
          setStatus("Registered successfully! You can login.");
          setMode("login");
        }
      } else {
        setStatus(data.detail || "Request failed");
      }
    } catch {
      setStatus("Network error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Cloud Hosting
          </h1>
          <p className="text-gray-500">
            {mode === "register"
              ? "Create your account"
              : "Login to your dashboard"}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setMode("register")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              mode === "register"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setMode("login")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              mode === "login"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Login
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {mode === "register" ? "Register" : "Login"}
          </button>
        </div>

        {/* Status */}
        {status && (
          <p className="mt-4 text-sm text-center text-gray-600">{status}</p>
        )}
      </div>
    </div>
  );
}