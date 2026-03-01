import { useState } from "react";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function handleRegister() {
    if (!email) {
      setStatus("Email required");
      return;
    }

    setStatus("Registering...");

    try {
      const res = await fetch("http://18.140.66.145/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "defaultpassword",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Registered! Check your inbox.");
        setEmail("");
      } else {
        setStatus(data.detail || "Registration failed");
      }
    } catch {
      setStatus("Network error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Cloud Hosting</h1>
          <a
            href="/auth"
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Login
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-extrabold text-gray-900">
          Cloud Hosting <span className="text-blue-600">Made Easy</span>
        </h1>

        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Deploy apps in seconds. Automatic containers. Scalable hosting.
          No complex setup required.
        </p>

        {/* CTA */}
        <div className="mt-10 w-full max-w-md">
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleRegister}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>

          {status && (
            <p className="mt-3 text-sm text-gray-600">{status}</p>
          )}
        </div>
      </main>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-bold text-lg">Deploy Fast</h3>
            <p className="text-gray-600 mt-2">
              Deploy from GitHub or API with automatic containers.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-bold text-lg">Scalable</h3>
            <p className="text-gray-600 mt-2">
              Load balancer and containers scale with traffic.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-bold text-lg">Secure</h3>
            <p className="text-gray-600 mt-2">
              User authentication and isolated deployments.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}